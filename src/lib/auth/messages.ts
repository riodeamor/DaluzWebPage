/** Public Supabase Auth messages, localized for the es-AR storefront. */
export function authMessage(error: { code?: string; message?: string } | null | undefined): string {
  const code = error?.code;
  const message = error?.message ?? "";
  if (code === "invalid_credentials" || /invalid login credentials/i.test(message)) return "El email o la contraseña son incorrectos.";
  if (code === "email_not_confirmed" || /email not confirmed/i.test(message)) return "Confirmá tu email antes de iniciar sesión.";
  if (code === "user_already_exists" || code === "email_exists" || /already registered|already been registered|user already/i.test(message)) return "Ya existe una cuenta con ese email. Iniciá sesión o recuperá tu contraseña.";
  if (code === "weak_password" || /password should be|weak password/i.test(message)) return "Elegí una contraseña más segura, de al menos 6 caracteres.";
  if (code === "same_password") return "Elegí una contraseña diferente de la anterior.";
  if (code === "otp_expired") return "El enlace venció. Solicitá uno nuevo.";
  if (code?.includes("rate_limit") || /rate limit|too many requests|security purposes/i.test(message)) return "Esperá unos minutos antes de volver a intentarlo.";
  return "No pudimos completar la solicitud. Intentá de nuevo en unos minutos.";
}
