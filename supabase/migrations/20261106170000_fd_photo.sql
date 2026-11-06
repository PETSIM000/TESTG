-- Photo de profil : portrait prêt (av:...) ou petite photo du téléphone (data:image jpeg/webp, ≤ 60 000 caractères).
alter table public.players add column if not exists photo text;

create or replace function public.cr_set_photo(p_token text, p_photo text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me public.players; v text := nullif(btrim(coalesce(p_photo,'')), '');
begin
  me := public.cr_me(p_token);
  if v is not null and not (
       v ~ '^av:[0-9]{1,2}(,[0-9]{1,2}){5}$'
    or (v ~ '^data:image/(jpeg|webp);base64,[A-Za-z0-9+/=]+$' and length(v) <= 60000)
  ) then raise exception 'photo invalide'; end if;
  update public.players set photo = v where id = me.id;
  return jsonb_build_object('photo', v);
end $$;
revoke all on function public.cr_set_photo(text, text) from public;
grant execute on function public.cr_set_photo(text, text) to anon, authenticated;

-- La photo suit le joueur partout où son badge est envoyé (profil, en-tête, membres de club).
do $$
declare f text; fn text;
begin
  foreach fn in array array['public.cr_pub(public.players)','public.cr_club_pub(public.clubs)'] loop
    f := pg_get_functiondef(fn::regprocedure);
    if position('''photo''' in f) = 0 then
      f := replace(f, '''badge'',p.badge', '''badge'',p.badge,''photo'',p.photo');
      execute f;
    end if;
  end loop;
end $$;
