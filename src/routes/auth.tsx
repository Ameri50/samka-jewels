import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserRoleAndNavigate = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle(); // ← cambiado de .single() a .maybeSingle()

        if (data?.role === "admin") {
          toast.success("¡Bienvenido, Administrador!");
          navigate({ to: "/admin" });
        } else {
          // Customers o usuarios sin rol van a /cuenta
          toast.success("¡Bienvenido!");
          navigate({ to: "/cuenta" });
        }
      } catch (err) {
        console.error("Error validando rol:", err);
        // Ante cualquier error, redirigir a /cuenta
        toast.success("¡Bienvenido!");
        navigate({ to: "/cuenta" });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserRoleAndNavigate(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        checkUserRoleAndNavigate(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:8080/auth",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          }
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error("No se pudo conectar con Google. Inténtalo de nuevo.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: "http://localhost:8080/auth" },
      });
      if (error) throw error;
      toast.success("¡Te enviamos un enlace de acceso a tu correo!");
    } catch (error) {
      toast.error("Error al enviar el enlace. Verifica tu correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-2">Ingresa a Samka</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Inicia sesión para gestionar tus compras y agilizar tu pago.
      </p>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-accent"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.355 0 3.36 2.62 1.34 6.433l3.926 3.332z" />
            <path fill="#4285F4" d="M23.49 12.275c0-.826-.074-1.62-.21-2.386H12v4.512h6.446a5.51 5.51 0 0 1-2.39 3.613l3.737 2.899c2.186-2.014 3.447-4.98 3.447-8.638z" />
            <path fill="#FBBC05" d="M5.266 14.235L1.34 17.567A11.934 11.934 0 0 0 12 24c3.055 0 5.782-1.014 7.782-2.738l-3.738-2.899a7.114 7.114 0 0 1-4.044 1.146 7.078 7.078 0 0 1-6.734-5.274z" />
            <path fill="#34A853" d="M5.266 9.765A7.043 7.043 0 0 1 5 12c0 .79.13 1.554.366 2.265l4.01-3.131-4.11-1.369z" />
          </svg>
          Continuar con Google
        </button>

        <div className="relative flex py-2 items-center justify-center">
          <div className="grow border-t border-border"></div>
          <span className="shrink mx-4 text-xs tracking-widest uppercase text-muted-foreground">O</span>
          <div className="grow border-t border-border"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40 transition"
              required
            />
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Ingresar con mi correo"}
          </button>
        </form>
      </div>
    </div>
  );
}