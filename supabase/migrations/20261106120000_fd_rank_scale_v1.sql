-- FIGHT DYNASTY rank scale (brief §4): one rank per account, 0-10000 points, DYNASTY numbered top 250.
-- NOT YET APPLIED to production (needs Max's approval). The game already displays the new scale
-- client-side; this migration adds the server pieces: points in the API, DYNASTY position, season,
-- and the reward ladder on the new divisions.
-- Rank points are a rescaling of the existing account ELO, so matchmaking stays consistent:
--   rp = max(0, (elo - 800) * 8)   ->  elo 1000 = 1600 (Argent III), elo 2050 = 10000 (DYNASTY)
create or replace function public.cr_rp(p_elo integer) returns integer
language sql immutable set search_path to '' as $$ select greatest(0, (p_elo - 800) * 8) $$;

create or replace function public.cr_rp_elo(p_rp integer) returns integer
language sql immutable set search_path to '' as $$ select 800 + ceil(p_rp / 8.0)::int $$;

-- World position inside DYNASTY (null below 10000 points). Top 250 only.
create or replace function public.cr_dpos(p_id uuid) returns integer
language sql stable set search_path to '' as $$
  select pos from (
    select id, row_number() over (order by elo desc, created_at) pos
    from public.players where elo >= public.cr_rp_elo(10000)
  ) t where id = p_id and pos <= 250 $$;

create or replace function public.cr_pub(p players) returns jsonb
language sql stable set search_path to '' as $$
  select jsonb_build_object('id',p.id,'name',p.name,'club',p.club,'code',p.code,'elo',p.elo,'rp',public.cr_rp(p.elo),
    'dpos',public.cr_dpos(p.id),'season',public.cr_season(),
    'w',p.w,'l',p.l,'d',p.d,'kos',p.kos,'seen',p.seen_at,'bot',p.is_bot,'coins',p.coins,'boost',p.boost,'ostreak',p.ostreak,
    'title',p.title,'badge',p.badge,'cc',p.geo_cc,'rc',p.geo_rc,'rn',p.geo_rn,'prem',p.prem,'admin',p.admin,'owned',p.owned)
$$;

create or replace function public.cr_top() returns jsonb
language sql security definer set search_path to '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'club',club,'elo',elo,'rp',public.cr_rp(elo),'dpos',public.cr_dpos(id),
    'w',w,'l',l,'d',d,'bot',is_bot) order by elo desc), '[]'::jsonb)
  from (select * from public.players where w+l+d > 0 order by elo desc limit 30) t
$$;

-- Reward ladder on the new divisions. 'r' stays in elo units (cr_rank_claim compares it with cr_best).
create or replace function public.cr_rkdefs() returns jsonb
language sql immutable set search_path to '' as $$
  select jsonb_agg(jsonb_build_object('r', public.cr_rp_elo(rp), 'rp', rp, 'n', n, 'c', c) order by rp)
  from (values
    (500,'Bronze II',50),(1000,'Bronze I',80),
    (1500,'Argent III',100),(2000,'Argent II',120),(2500,'Argent I',150),
    (3000,'Or III',200),(3500,'Or II',250),(4000,'Or I',300),
    (4500,'Platine III',400),(5000,'Platine II',500),(5500,'Platine I',600),
    (6000,'Diamant III',800),(6500,'Diamant II',900),(7000,'Diamant I',1000),
    (7500,'Maître III',1200),(8000,'Maître II',1400),(8500,'Maître I',1600),
    (9000,'Champion III',2000),(9334,'Champion II',2500),(9667,'Champion I',3000),
    (10000,'DYNASTY',5000)) v(rp, n, c)
$$;

create or replace function public.cr_rank_claim(p_token text, p_r integer) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players; q jsonb;
begin
  me := public.cr_me(p_token);
  select x into q from jsonb_array_elements(public.cr_rkdefs()) x where (x->>'r')::int = p_r;
  if q is null or public.cr_best(me.id) < p_r then raise exception 'rank'; end if;
  if me.rkdone ? p_r::text then raise exception 'claimed'; end if;
  update public.players set rkdone = rkdone || to_jsonb(p_r::text), coins = coins + (q->>'c')::int,
    trophies = case when (q->>'rp')::int >= 6000 then trophies || jsonb_build_array(jsonb_build_object('t','Rang '||(q->>'n')||' atteint','at',now(),'box','')) else trophies end
  where id = me.id;
  return jsonb_build_object('gain', (q->>'c')::int, 'coins', me.coins + (q->>'c')::int);
end $$;
