import "server-only";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TREASURES } from "./catalog";
import { verifyTreasure } from "./token";
import type { TesoroData } from "@/components/tesoros/TesoroLayout";
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
          entry.route + (token ? "?token=" + encodeURIComponent(token) : ""),
        ) +
        "&message=tesoro",
    );
  const rights = await unlockedTreasures(db, user.id);
  if (!rights.includes(id) || (token && !verifyTreasure(token, user.id, id)))
    redirect("/perfil?aviso=tesoro-no-disponible");
  const { data: media, error } = await db
    .from("treasure_catalog")
    .select("audio_url,pdf_url")
    .eq("access_id", id)
    .single();
  if (error) throw Error("No pudimos cargar el Tesoro");
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
