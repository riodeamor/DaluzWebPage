import { createHmac, timingSafeEqual } from "node:crypto";
const key = () => {
  const k = process.env.TREASURE_LINK_SECRET;
  if (!k || k.length < 32)
    throw Error("Configurar TREASURE_LINK_SECRET (mínimo 32 caracteres)");
  return k;
};
export function signTreasure(user: string, treasure: string, now = Date.now()) {
  const data = Buffer.from(
    JSON.stringify({ user, treasure, expires: Math.floor(now / 1000) + 900 }),
  ).toString("base64url");
  return (
    data + "." + createHmac("sha256", key()).update(data).digest("base64url")
  );
}
export function verifyTreasure(
  token: string,
  user: string,
  treasure: string,
  now = Date.now(),
) {
  try {
    if (token.length > 1024) return false;
    const [data, signature, ...rest] = token.split(".");
    if (rest.length || !signature) return false;
    const expected = createHmac("sha256", key()).update(data).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return false;
    const claim = JSON.parse(Buffer.from(data, "base64url").toString());
    return (
      claim.user === user &&
      claim.treasure === treasure &&
      Number.isInteger(claim.expires) &&
      claim.expires > Math.floor(now / 1000) &&
      claim.expires <= Math.floor(now / 1000) + 900
    );
  } catch {
    return false;
  }
}
