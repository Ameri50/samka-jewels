import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LogOut, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cuenta")({
  head: () => ({ meta: [{ title: "Mi cuenta — Samka" }] }),
  component: AccountPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado",
  processing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-gold">Mi cuenta</p>
          <h1 className="mt-1 font-display text-4xl">
            Hola, <span className="text-gradient-gold">{profile?.full_name ?? user.email}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link to="/admin" className="rounded-full border border-gold/40 px-5 py-2 text-sm hover:bg-accent">
              Panel admin
            </Link>
          )}
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-gold" /> Mis pedidos
      </h2>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Aún no tienes pedidos</p>
          <Link to="/catalogo" className="mt-4 inline-flex rounded-full bg-gradient-gold px-6 py-2.5 text-sm text-primary-foreground">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{o.order_number}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("es-PE", { dateStyle: "long" })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs">{STATUS_LABEL[o.status] ?? o.status}</span>
                  <p className="mt-2 font-display text-xl text-gradient-gold">S/ {Number(o.total).toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {o.order_items?.map((it: { id: string; product_image: string | null; product_name: string; quantity: number }) => (
                  <div key={it.id} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                    {it.product_image && <img src={it.product_image} alt="" className="h-10 w-10 rounded-md object-cover" />}
                    <div className="text-xs">
                      <p className="font-medium">{it.product_name}</p>
                      <p className="text-muted-foreground">x{it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
