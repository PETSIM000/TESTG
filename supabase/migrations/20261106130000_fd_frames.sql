-- FIGHT DYNASTY: profile frames are owned cosmetics the player equips or removes (Max, 2026-11-06).
-- NOT YET APPLIED (needs Max's approval). Apply after 20261106120000_fd_rank_scale_v1.sql.
-- frames      : owned season-end frames, e.g. [{"rank":"or","season":1}] (written by the season-end job)
-- frame_eq    : frame id equipped on the avatar ('' = none)      ids: '<rank>-s<season>' or 'dynasty-live'
-- frame_show  : frame id shown in the banner showcase ('' = none)
alter table public.players
  add column if not exists frames jsonb not null default '[]'::jsonb,
  add column if not exists frame_eq text not null default '',
  add column if not exists frame_show text not null default '';

-- Does the player own this frame right now? 'dynasty-live' only while in the live top 250.
create or replace function public.cr_frame_owned(p players, p_id text) returns boolean
language sql stable set search_path to '' as $$
  select p_id = '' or (p_id = 'dynasty-live' and public.cr_dpos(p.id) is not null)
    or exists (select 1 from jsonb_array_elements(p.frames) f where (f->>'rank') || '-s' || (f->>'season') = p_id) $$;

create or replace function public.cr_frame_set(p_token text, p_eq text, p_show text) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare me public.players;
begin
  me := public.cr_me(p_token);
  if not public.cr_frame_owned(me, coalesce(p_eq, '')) or not public.cr_frame_owned(me, coalesce(p_show, '')) then raise exception 'frame'; end if;
  update public.players set frame_eq = coalesce(p_eq, ''), frame_show = coalesce(p_show, '') where id = me.id;
  return jsonb_build_object('eq', coalesce(p_eq, ''), 'show', coalesce(p_show, ''));
end $$;

-- Public profile: owned frames + the two slots. A numbered frame that is no longer owned
-- (player left the top 250) is reported as '' so it un-equips itself everywhere.
create or replace function public.cr_pub(p players) returns jsonb
language sql stable set search_path to '' as $$
  select jsonb_build_object('id',p.id,'name',p.name,'club',p.club,'code',p.code,'elo',p.elo,'rp',public.cr_rp(p.elo),
    'dpos',public.cr_dpos(p.id),'season',public.cr_season(),'frames',p.frames,
    'frame_eq',case when public.cr_frame_owned(p, p.frame_eq) then p.frame_eq else '' end,
    'frame_show',case when public.cr_frame_owned(p, p.frame_show) then p.frame_show else '' end,
    'w',p.w,'l',p.l,'d',p.d,'kos',p.kos,'seen',p.seen_at,'bot',p.is_bot,'coins',p.coins,'boost',p.boost,'ostreak',p.ostreak,
    'title',p.title,'badge',p.badge,'cc',p.geo_cc,'rc',p.geo_rc,'rn',p.geo_rn,'prem',p.prem,'admin',p.admin,'owned',p.owned)
$$;
