-- FIGHT DYNASTY ranked: security fixes from the automated review of 20261106140000_fd_ranked_normal.sql.
-- 1. A ranked result must be bound to a fight the server opened (single-use ticket, opponent close in ELO).
-- 2. Asynchronous ranked: only the player who fought gains or loses ELO; the opponent (who did not take
--    part) is never changed. No more griefing of an arbitrary player.
-- 3. Reports from one player are serialized (row lock) so the rate limits cannot be raced.
-- 4. NULL inputs fail validation in cr_rk_set.
-- Note: the fight itself is still simulated on the client, like every other mode of the game.

create table if not exists public.rk_tickets (
  id uuid primary key default gen_random_uuid(),
  p1 uuid not null references public.players(id) on delete cascade,
  p2 uuid not null references public.players(id) on delete cascade,
  created_at timestamptz not null default now(),
  used boolean not null default false
);
alter table public.rk_tickets enable row level security;
create index if not exists rk_tickets_p1 on public.rk_tickets (p1, created_at desc);

-- Open a ranked fight: the opponent must be another player close in ELO. Returns the ticket.
create or replace function public.cr_rk_start(p_token text, p_opp uuid) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; op public.players; t uuid;
begin
  me := public.cr_me(p_token);
  if me.rk is null then raise exception 'rk'; end if;
  perform 1 from public.players where id = me.id for update;
  select * into op from public.players where id = p_opp;
  if op.id is null or op.id = me.id or abs(op.elo - me.elo) > 400 then raise exception 'opp'; end if;
  if (select count(*) from public.rk_tickets where p1 = me.id and created_at > now() - interval '1 day') >= 120 then raise exception 'dailyall'; end if;
  insert into public.rk_tickets(p1, p2) values (me.id, op.id) returning id into t;
  return jsonb_build_object('ticket', t);
end $$;

-- Old entry point (opponent chosen by the client, both ELOs changed): disabled.
create or replace function public.cr_rk_report(p_token text, p_opp uuid, p_res text, p_method text, p_rnd integer) returns jsonb
language plpgsql security definer set search_path to '' as $$ begin raise exception 'obsolete'; end $$;

create or replace function public.cr_rk_result(p_token text, p_ticket uuid, p_res text, p_method text, p_rnd integer) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; op public.players; tk public.rk_tickets; r smallint; s numeric; e numeric; n int; d1 int;
begin
  me := public.cr_me(p_token);
  perform 1 from public.players where id = me.id for update;  -- serialize this player's reports
  update public.rk_tickets set used = true
   where id = p_ticket and p1 = me.id and not used and created_at > now() - interval '30 minutes'
  returning * into tk;
  if tk.id is null then raise exception 'ticket'; end if;
  select * into op from public.players where id = tk.p2;
  if exists (select 1 from public.matches where p1 = me.id and created_at > now() - interval '20 seconds') then raise exception 'slow'; end if;
  if (select count(*) from public.matches where p1 = me.id and mode = 'rk' and created_at > now() - interval '1 day') >= 80 then raise exception 'dailyall'; end if;
  if p_method is null or p_method not in ('KO','TKO','DEC') or coalesce(p_rnd,0) not between 0 and 12 then raise exception 'res'; end if;
  r := case p_res when 'W' then 1 when 'L' then 2 when 'D' then 0 else null end;
  if r is null then raise exception 'res'; end if;
  s := case r when 1 then 1 when 2 then 0 else .5 end;
  e := 1 / (1 + power(10, (op.elo - me.elo) / 400.0));
  n := (select count(*) from public.matches where mode = 'rk' and p1 = me.id and p2 = op.id and created_at > now() - interval '1 day');
  d1 := round(32 * (s - e) / (1 + n));
  update public.players set elo = greatest(0, elo + d1), rk_w = rk_w + (r=1)::int, rk_l = rk_l + (r=2)::int, rk_d = rk_d + (r=0)::int where id = me.id;
  insert into public.matches(p1,p2,b1,b2,res,method,rnd,d1,d2,mode)
  values (me.id, op.id, jsonb_build_object('name', me.rk->>'name', 'style', me.rk->>'style'),
          jsonb_build_object('name', coalesce(op.rk->>'name', op.name), 'style', op.rk->>'style'), r, p_method, coalesce(p_rnd,0), d1, 0, 'rk');
  select * into me from public.players where id = me.id;
  return jsonb_build_object('d', d1, 'elo', me.elo, 'rp', public.cr_rp(me.elo), 'dpos', public.cr_dpos(me.id), 'repeat', n);
end $$;

create or replace function public.cr_rk_set(p_token text, p_name text, p_style text, p_abil jsonb) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; nm text := btrim(coalesce(p_name, ''));
begin
  me := public.cr_me(p_token);
  if char_length(nm) not between 2 and 16 or nm !~ '^[[:alnum:] .-]+$' then raise exception 'name'; end if;
  if p_style is null or p_style not in ('cogneur','technicien','defensif','pression','contreur') then raise exception 'style'; end if;
  if p_abil is null or coalesce(jsonb_typeof(p_abil), '') <> 'array' or jsonb_array_length(p_abil) <> 2
     or (p_abil->>0) is null or (p_abil->>1) is null or (p_abil->>0) = (p_abil->>1)
     or exists (select 1 from jsonb_array_elements_text(p_abil) a where a not in ('fer','finisseur','contre','moteur','eclair','bombe','roc'))
  then raise exception 'abil'; end if;
  update public.players set rk = jsonb_build_object('name', nm, 'style', p_style, 'abil', p_abil) where id = me.id;
  return jsonb_build_object('name', nm, 'style', p_style, 'abil', p_abil);
end $$;
