"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";

/* Conectamos esta página al mismo CSS que armamos para el Login */
import "@/app/(auth)/login/login.css";
const signupSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(10, "Ingresa un número de teléfono válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signUpWithGoogle, resendConfirmation, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setFormError("");
    try {
      await signUp(
        data.email,
        data.password,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }
      );
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      const rawMessage: string =
        err?.message || "No pudimos crear la cuenta. Intentá de nuevo en unos minutos.";
      const normalized = /already registered|already been registered|user already/i.test(rawMessage)
        ? "Ya existe una cuenta registrada con ese email. Iniciá sesión o recuperá tu contraseña."
        : rawMessage;
      setFormError(normalized);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail || resendStatus === "sending") return;
    setResendStatus("sending");
    setResendMessage("");
    try {
      const { error: resendError } = await resendConfirmation(submittedEmail);
      if (resendError) {
        setResendStatus("error");
        setResendMessage(resendError.message || "No pudimos reenviar el email. Intentá de nuevo en unos minutos.");
      } else {
        setResendStatus("sent");
        setResendMessage("Te reenviamos el email de confirmación.");
      }
    } catch (err: any) {
      setResendStatus("error");
      setResendMessage(err?.message || "Error inesperado al reenviar el email.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await signUpWithGoogle();
    } catch (err) {
      console.error("Google sign up error:", err);
      setGoogleLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="login-card w-full shadow-alkimya">
        <CardHeader className="login-header space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-white/10 p-4">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="login-title font-title">
            ¡Cuenta Creada!
          </CardTitle>
          <CardDescription className="login-description font-text">
            Revisa tu email para confirmar tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="login-content space-y-5">
          <Alert className="bg-white border-brand-primary/20">
            <AlertDescription className="text-text-primary font-text">
              Te enviamos un email de confirmación a <strong>{submittedEmail}</strong>.
              Hacé clic en el enlace para activar tu cuenta.
              <br /><br />
              <span className="text-sm text-text-primary/70">
                ¿No lo ves? Revisá tu carpeta de <strong>spam / correo no deseado</strong>.
                Puede tardar unos minutos en llegar.
              </span>
            </AlertDescription>
          </Alert>

          {resendMessage && (
            <Alert
              className={
                resendStatus === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }
            >
              <AlertDescription
                className={resendStatus === "error" ? "text-red-800" : "text-green-800"}
              >
                {resendMessage}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            onClick={handleResend}
            disabled={resendStatus === "sending" || resendStatus === "sent"}
            variant="outline"
            className="w-full py-6 text-base font-text rounded-[15px]"
          >
            {resendStatus === "sending" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Reenviando...
              </>
            ) : resendStatus === "sent" ? (
              "Email reenviado"
            ) : (
              "Reenviar email de confirmación"
            )}
          </Button>

          <Button
            asChild
            className="login-submit-btn"
          >
            <Link href="/login">Ir al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="login-card w-full shadow-alkimya">
      <CardHeader className="login-header space-y-2">
        <CardTitle className="login-title font-title">
          Crear Cuenta
        </CardTitle>
        <CardDescription className="login-description font-text">
          Únete a la comunidad DA LUZ CONSCIENTE
        </CardDescription>
      </CardHeader>
      
      <CardContent className="login-content space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {(formError || error) && (
            <Alert variant="destructive" className="login-alert">
              <AlertDescription className="login-alert-text">
                {formError || error?.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="login-field-group">
              <Label htmlFor="firstName" className="login-field-label font-text">
                Nombre
              </Label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  {...register("firstName")}
                  className={`login-input ${errors.firstName ? "login-input--error" : ""}`}
                />
              </div>
              {errors.firstName && (
                <p className="login-error-text font-text">{errors.firstName.message}</p>
              )}
            </div>

            <div className="login-field-group">
              <Label htmlFor="lastName" className="login-field-label font-text">
                Apellido
              </Label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  {...register("lastName")}
                  className={`login-input ${errors.lastName ? "login-input--error" : ""}`}
                />
              </div>
              {errors.lastName && (
                <p className="login-error-text font-text">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="login-field-group">
            <Label htmlFor="email" className="login-field-label font-text">
              Email
            </Label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
                className={`login-input ${errors.email ? "login-input--error" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="login-error-text font-text">{errors.email.message}</p>
            )}
          </div>

          <div className="login-field-group">
            <Label htmlFor="phone" className="login-field-label font-text">
              Teléfono
            </Label>
            <div className="login-input-wrapper">
              <Phone className="login-input-icon" />
              <Input
                id="phone"
                type="tel"
                placeholder="+54 9 11 1234-5678"
                {...register("phone")}
                className={`login-input ${errors.phone ? "login-input--error" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="login-error-text font-text">{errors.phone.message}</p>
            )}
          </div>

          <div className="login-field-group">
            <Label htmlFor="password" className="login-field-label font-text">
              Contraseña
            </Label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                {...register("password")}
                className={`login-input--with-toggle ${errors.password ? "login-input--error" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="login-error-text font-text">{errors.password.message}</p>
            )}
          </div>

          <div className="login-field-group">
            <Label htmlFor="confirmPassword" className="login-field-label font-text">
              Confirmar Contraseña
            </Label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu contraseña"
                {...register("confirmPassword")}
                className={`login-input--with-toggle ${errors.confirmPassword ? "login-input--error" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="login-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="login-error-text font-text">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="login-submit-btn font-text"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line">
            <span />
          </div>
          <div className="login-divider-text-wrapper">
            <span className="login-divider-text font-text">O</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="login-google-btn"
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Conectando con Google...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </Button>

        <div className="login-signup-text">
          <p className="font-text">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="login-signup-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}