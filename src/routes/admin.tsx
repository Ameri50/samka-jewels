import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// 🔐 El Guardián del Admin: Validación dinámica y real por base de datos
export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // 1. Si no hay sesión iniciada en la pestaña, al Login (/auth)
    if (!session) {
      toast.error("Debes iniciar sesión para acceder al panel");
      throw redirect({ to: "/auth" });
    }

    try {
      // 2. Consulta dinámica a la tabla de roles usando el ID del usuario logueado
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      // Si hay un error en la consulta o el rol no es 'admin', se le deniega la entrada
      if (error || data?.role !== "admin") {
        toast.error("Acceso denegado: No tienes permisos de administrador");
        throw redirect({ to: "/" }); // Expulsado al inicio de la tienda
      }
    } catch (catchError) {
      // Si es una redirección propia de TanStack, la dejamos pasar para que ejecute el rebote
      if (catchError && typeof catchError === "object" && "to" in catchError) {
        throw catchError;
      }
      
      // Para cualquier otro error inesperado de red o base de datos, protegemos la ruta
      console.error("Error en el guardián de administración:", catchError);
      toast.error("Error de seguridad al validar tus permisos");
      throw redirect({ to: "/" });
    }
  },
  head: () => ({ meta: [{ title: "Panel de Control — Samka" }] }),
  component: AdminPanelPage,
});

type OrderTable = Tables<"orders">;

function AdminPanelPage() {
  const [orders, setOrders] = useState<OrderTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as OrderTable[]) || []);
    } catch (error) {
      toast.error("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: "paid" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus } as any)
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Pedido ${newStatus === "paid" ? "Aprobado" : "Rechazado"} con éxito`);
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      toast.error("No se pudo actualizar el estado del pedido");
    }
  };

  if (loading) {
    return <div className="p-24 text-center text-sm text-muted-foreground">Cargando panel de control...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-1 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide">Gestión de Pedidos</h1>
          <p className="text-sm text-muted-foreground">Revisa los pagos en tu app de Yape/Plin antes de aprobar los envíos.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="mt-4 sm:mt-0 px-4 py-2 text-xs uppercase tracking-widest font-medium border border-border rounded-full hover:bg-accent transition"
        >
          🔄 Actualizar Lista
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-3xl mt-8">
          Aún no tienes ningún pedido registrado en la tienda.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className={`rounded-3xl border p-6 bg-card shadow-sm transition-all duration-300 ${
                order.status === "paid" ? "border-emerald-500/20 bg-emerald-500/5" : 
                order.status === "cancelled" ? "border-destructive/20 bg-destructive/5" : "border-border"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold tracking-wider bg-accent px-3 py-1 rounded-full">
                      ID: #{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("es-PE", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      }) : ""}
                    </span>
                  </div>
                  <h3 className="font-display text-xl mt-3 text-card-foreground">{order.full_name}</h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Monto Total</p>
                  <p className="font-display text-2xl text-gold font-semibold mt-1">
                    S/ {(Number((order as any).total_amount || (order as any).total || 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 text-sm">
                {/* Detalles de Operación */}
                <div className="space-y-1 bg-accent/30 p-4 rounded-2xl border border-border/40">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium block">Detalles de Operación</span>
                  <p className="font-medium mt-1">Método: <span className="uppercase font-bold text-indigo-500">{order.payment_method}</span></p>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground block">Código Ingresado por Cliente:</span>
                    <span className="font-mono text-lg font-bold tracking-wider text-primary block mt-0.5">
                      {(order as any).payment_reference || (order as any).operation_code || (order as any).order_number || "NINGUNO"}
                    </span>
                  </div>
                </div>

                {/* Contacto */}
                <div className="space-y-1 py-1">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium block">Contacto del Cliente</span>
                  <p className="mt-2"><span className="text-muted-foreground">Telf:</span> +51 {order.phone}</p>
                  <p className="truncate"><span className="text-muted-foreground">Email:</span> {order.email}</p>
                </div>

                {/* Dirección */}
                <div className="space-y-1 py-1">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium block">Dirección de Entrega</span>
                  <p className="mt-2 text-muted-foreground leading-relaxed italic">
                    {order.address}, {order.city}
                  </p>
                  {order.notes && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      <span className="font-medium">Nota:</span> {order.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Estado actual:</span>
                  <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                    order.status === "paid" ? "bg-emerald-500/10 text-emerald-600" :
                    order.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                    "bg-amber-500/10 text-amber-600 animate-pulse"
                  }`}>
                    {order.status === "pending" ? "pendiente" : order.status === "paid" ? "pagado" : order.status}
                  </span>
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-medium transition"
                    >
                      ❌ Rechazar (Código Falso)
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "paid")}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition shadow-sm"
                    >
                      ✓ Aprobar Pago Recibido
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}