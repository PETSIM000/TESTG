-- FIGHT DYNASTY: two online modes (Max, 2026-11-06).
--   CLASSÉ : every fighter starts at the same overall (75), the player picks a name, a style (fixed
--            boosts, equal total) and 2 abilities. Only ranked fights move the account ELO / rank.
--   NORMAL : the existing stable (overall progression, XP, coins). It never touches the ELO / rank.
-- Apply after 20261106120000_fd_rank_scale_v1.sql and 20261106130000_fd_frames.sql.

alter table public.players
  add column if not exists rk jsonb,
  add column if not exists rk_w int not null default 0,
  add column if not exists rk_l int not null default 0,
  add column if not exists rk_d int not null default 0;
alter table public.matches add column if not exists mode text not null default 'normal';

-- NORMAL no longer moves the account ELO (boxer ratings, XP and coins are unchanged).
do $$
declare d text;
begin
  select pg_get_functiondef('public.cr_ob_gain(uuid,smallint,text,integer,boolean,integer)'::regprocedure) into d;
  if position('update public.players set elo = elo + p_d, w = w' in d) = 0 then raise exception 'cr_ob_gain changed, review migration'; end if;
  execute replace(d, 'update public.players set elo = elo + p_d, w = w', 'update public.players set w = w');
  select pg_get_functiondef('public.cr_ob_report(text,uuid,uuid,text,text,integer,integer)'::regprocedure) into d;
  if position('update public.players set elo = elo - d1, w = w' in d) = 0 then raise exception 'cr_ob_report changed, review migration'; end if;
  execute replace(d, 'update public.players set elo = elo - d1, w = w', 'update public.players set w = w');
end $$;

-- The rank (and its rewards) comes from the manager ELO only, never from a boxer rating.
create or replace function public.cr_best(p_id uuid) returns integer
language sql stable set search_path to '' as $$ select elo from public.players where id = p_id $$;

-- Ranked fighter of a player: name, style, 2 abilities. Stats are derived identically on every client.
create or replace function public.cr_rk_set(p_token text, p_name text, p_style text, p_abil jsonb) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; nm text := btrim(coalesce(p_name, ''));
begin
  me := public.cr_me(p_token);
  if char_length(nm) not between 2 and 16 or nm !~ '^[[:alnum:] .-]+$' then raise exception 'name'; end if;
  if p_style not in ('cogneur','technicien','defensif','pression','contreur') then raise exception 'style'; end if;
  if jsonb_typeof(p_abil) <> 'array' or jsonb_array_length(p_abil) <> 2 or (p_abil->>0) = (p_abil->>1)
     or exists (select 1 from jsonb_array_elements_text(p_abil) a where a not in ('fer','finisseur','contre','moteur','eclair','bombe','roc'))
  then raise exception 'abil'; end if;
  update public.players set rk = jsonb_build_object('name', nm, 'style', p_style, 'abil', p_abil) where id = me.id;
  return jsonb_build_object('name', nm, 'style', p_style, 'abil', p_abil);
end $$;

-- Ranked opponents: players and bots closest in ELO (bots get a fighter built client-side from their id).
create or replace function public.cr_rk_opps(p_token text) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players;
begin
  me := public.cr_me(p_token);
  return coalesce((select jsonb_agg(public.cr_pub(p) order by abs(p.elo - me.elo)) from (
    select * from public.players p where p.id <> me.id order by abs(p.elo - me.elo), random() limit 8) p), '[]'::jsonb);
end $$;

-- Ranked result: the only thing that moves the account ELO. Same opponent again within 24 h earns less.
create or replace function public.cr_rk_report(p_token text, p_opp uuid, p_res text, p_method text, p_rnd integer) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; op public.players; r smallint; s numeric; e numeric; n int; d1 int;
begin
  me := public.cr_me(p_token);
  if me.rk is null then raise exception 'rk'; end if;
  select * into op from public.players where id = p_opp for update;
  if op.id is null or op.id = me.id then raise exception 'opp'; end if;
  if exists (select 1 from public.matches where p1 = me.id and created_at > now() - interval '20 seconds') then raise exception 'slow'; end if;
  if (select count(*) from public.matches where p1 = me.id and mode = 'rk' and created_at > now() - interval '1 day') >= 80 then raise exception 'dailyall'; end if;
  if p_method not in ('KO','TKO','DEC') or coalesce(p_rnd,0) not between 0 and 12 then raise exception 'res'; end if;
  r := case p_res when 'W' then 1 when 'L' then 2 when 'D' then 0 else null end;
  if r is null then raise exception 'res'; end if;
  s := case r when 1 then 1 when 2 then 0 else .5 end;
  e := 1 / (1 + power(10, (op.elo - me.elo) / 400.0));
  n := (select count(*) from public.matches where mode = 'rk' and created_at > now() - interval '1 day'
          and ((p1 = me.id and p2 = op.id) or (p1 = op.id and p2 = me.id)));
  d1 := round(32 * (s - e) / (1 + n));
  update public.players set elo = greatest(0, elo + d1), rk_w = rk_w + (r=1)::int, rk_l = rk_l + (r=2)::int, rk_d = rk_d + (r=0)::int where id = me.id;
  update public.players set elo = greatest(0, elo - d1), rk_w = rk_w + (r=2)::int, rk_l = rk_l + (r=1)::int, rk_d = rk_d + (r=0)::int where id = op.id;
  insert into public.matches(p1,p2,b1,b2,res,method,rnd,d1,d2,mode)
  values (me.id, op.id, jsonb_build_object('name', me.rk->>'name', 'style', me.rk->>'style'),
          jsonb_build_object('name', coalesce(op.rk->>'name', op.name), 'style', op.rk->>'style'), r, p_method, coalesce(p_rnd,0), d1, -d1, 'rk');
  select * into me from public.players where id = me.id;
  return jsonb_build_object('d', d1, 'elo', me.elo, 'rp', public.cr_rp(me.elo), 'dpos', public.cr_dpos(me.id), 'repeat', n);
end $$;

-- Public profile: everything the client needs for ranks, frames and the ranked fighter.
create or replace function public.cr_pub(p players) returns jsonb
language sql stable set search_path to '' as $$
  select jsonb_build_object('id',p.id,'name',p.name,'club',p.club,'code',p.code,'elo',p.elo,'rp',public.cr_rp(p.elo),
    'dpos',public.cr_dpos(p.id),'season',public.cr_season(),'frames',p.frames,
    'frame_eq',case when public.cr_frame_owned(p, p.frame_eq) then p.frame_eq else '' end,
    'frame_show',case when public.cr_frame_owned(p, p.frame_show) then p.frame_show else '' end,
    'rk',p.rk,'rk_w',p.rk_w,'rk_l',p.rk_l,'rk_d',p.rk_d,
    'w',p.w,'l',p.l,'d',p.d,'kos',p.kos,'seen',p.seen_at,'bot',p.is_bot,'coins',p.coins,'boost',p.boost,'ostreak',p.ostreak,
    'title',p.title,'badge',p.badge,'cc',p.geo_cc,'rc',p.geo_rc,'rn',p.geo_rn,'prem',p.prem,'admin',p.admin,'owned',p.owned)
$$;
