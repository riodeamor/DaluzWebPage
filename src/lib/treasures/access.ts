import "server-only";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TREASURES } from "./catalog";
import { verifyTreasure } from "./token";
import type { TesoroData } from "@/components/tesoros/TesoroLayout";
import { getServiceClient } from "@/lib/auth/helpers";
export async function unlockedTreasures(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("treasure_grants")
    .select("access_id")
    .eq("user_id", userId)
    .is("revoked_at", null);
  if (error) throw Error("No pudimos verificar los permisos");
  return [...new Set((data || []).map((g) => g.access_id as string))];
}
export async function protectTreasure(
  id: string,
  treasure: TesoroData,
  token?: string,
  adminPreview = false,
) {
  const entry = TREASURES.find((t) => t.id === id);
  if (!entry) throw Error("Tesoro inexistente");
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user)
    redirect(
      "/login?redirect=" +
        encodeURIComponent(
          entry.route + (adminPreview ? "?preview=admin" : token ? "?token=" + encodeURIComponent(token) : ""),
        ) +
        "&message=tesoro",
    );
  if (adminPreview) {
    const { data: isAdmin, error } = await db.rpc("is_admin", { user_id: user.id });
    if (error || isAdmin !== true) redirect("/perfil?aviso=tesoro-no-disponible");
  } else {
    const rights = await unlockedTreasures(db, user.id);
    if (!rights.includes(id) || (token && !verifyTreasure(token, user.id, id)))
      redirect("/perfil?aviso=tesoro-no-disponible");
  }
  const mediaDb = adminPreview ? getServiceClient() : db;
  const { data: media, error } = await mediaDb
    .from("treasure_catalog")
    .select("audio_url,pdf_url")
    .eq("access_id", id)
    .single();
  if (adminPreview && (error?.code === "PGRST205" || error?.code === "42P01"))
    return { treasure, pdfUrl: null };
  if (error || !media) throw Error("No pudimos cargar el Tesoro");
  return {
    treasure: media.audio_url
      ? {
          ...treasure,
          audios: treasure.audios.map((audio, i) =>
            i === 0 ? { ...audio, src: media.audio_url } : audio,
          ),
        }
      : treasure,
    pdfUrl: media.pdf_url as string | null,
  };
}
