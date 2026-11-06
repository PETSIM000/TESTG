-- Ranked anti-abuse (security review): a result is only accepted after a plausible fight duration
-- (40 s after the ticket), and the ELO a player can GAIN per day is capped at 250. Losses are never capped.
-- The fight is still simulated on the client like every mode; full server simulation is a later step.
create or replace function public.cr_rk_result(p_token text, p_ticket uuid, p_res text, p_method text, p_rnd integer) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; op public.players; tk public.rk_tickets; r smallint; s numeric; e numeric; n int; d1 int; gained int;
begin
  me := public.cr_me(p_token);
  perform 1 from public.players where id = me.id for update;  -- serialize this player's reports
  update public.rk_tickets set used = true
   where id = p_ticket and p1 = me.id and not used
     and created_at < now() - interval '40 seconds' and created_at > now() - interval '30 minutes'
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
  gained := coalesce((select sum(greatest(d1, 0)) from public.matches where p1 = me.id and mode = 'rk' and created_at > now() - interval '1 day'), 0);
  if d1 > 0 then d1 := least(d1, greatest(0, 250 - gained)); end if;
  update public.players set elo = greatest(0, elo + d1), rk_w = rk_w + (r=1)::int, rk_l = rk_l + (r=2)::int, rk_d = rk_d + (r=0)::int where id = me.id;
  insert into public.matches(p1,p2,b1,b2,res,method,rnd,d1,d2,mode)
  values (me.id, op.id, jsonb_build_object('name', me.rk->>'name', 'style', me.rk->>'style'),
          jsonb_build_object('name', coalesce(op.rk->>'name', op.name), 'style', op.rk->>'style'), r, p_method, coalesce(p_rnd,0), d1, 0, 'rk');
  select * into me from public.players where id = me.id;
  return jsonb_build_object('d', d1, 'elo', me.elo, 'rp', public.cr_rp(me.elo), 'dpos', public.cr_dpos(me.id), 'repeat', n, 'capped', gained >= 250);
end $$;
