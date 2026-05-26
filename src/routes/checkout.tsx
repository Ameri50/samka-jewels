import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart-store";
import { PaymentQR } from "@/components/PaymentQR";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Samka" }] }),
  component: CheckoutPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(80),
  phone: z.string().trim().min(7, "El teléfono debe tener entre 7 y 20 dígitos").max(20),
  email: z.string().trim().email("Ingresa un correo electrónico válido").max(160),
  address: z.string().trim().min(5, "Especifica una dirección más detallada").max(240),
  city: z.string().trim().min(2, "Ingresa tu departamento/ciudad").max(80),
  notes: z.string().trim().max(400).optional(),
});

const SHIPPING = 15;

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "pay" | "done">("info");
  const [method, setMethod] = useState<"yape" | "plin">("yape");
  const [orderNumber, setOrderNumber] = useState<string>("");
  
  // Código de operación escrito por el cliente
  const [operationCode, setOperationCode] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "", phone: "", email: user?.email ?? "", address: "", city: "Lima", notes: "",
  });

  useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email! }));
  }, [user]);

  if (items.length === 0 && step !== "done") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Tu bolsa está vacía</h1>
        <Link to="/catalogo" className="mt-6 inline-flex rounded-full bg-gradient-gold px-6 py-3 text-sm text-primary-foreground">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const total = subtotal + SHIPPING;

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Inicia sesión para continuar");
      navigate({ to: "/auth" });
      return;
    }
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setStep("pay");
  };

  const confirmOrder = async () => {
    if (!user) return;

    // Validar que el usuario haya escrito el código antes de enviar la orden
    if (!operationCode.trim()) {
      toast.error("Por favor, ingresa el número de operación de tu pago");
      return;
    }

    try {
      // Guardamos la orden respetando los valores nativos de tu base de datos
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          notes: form.notes || null,
          subtotal,
          shipping: SHIPPING,
          total: total,
          total_amount: total,
          payment_method: method, 
          // Guardamos el código de operación de manera nativa e independiente de las notas
          payment_reference: operationCode.trim(), 
          status: "pending",
        } as any) // El truco "as any" evita discrepancias estrictas en lo que corre la sync
        .select()
        .single();
        
      if (error) throw error;

      const itemsToInsert = items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        product_image: i.image && i.image.trim() !== "" ? i.image : "https://placehold.co/100x100?text=Samka",
        unit_price: i.unitPrice + i.attributesPriceMod,
        quantity: i.quantity,
        selected_attributes: i.attributes,
        subtotal: (i.unitPrice + i.attributesPriceMod) * i.quantity,
      }));
      
      const { error: e2 } = await supabase.from("order_items").insert(itemsToInsert);
      if (e2) throw e2;

      // Usamos el ID o el número de orden de respuesta para mostrar el éxito
      setOrderNumber(order.order_number || order.id.slice(0, 8).toUpperCase());
      clear();
      setStep("done");
    } catch (err) {
      toast.error((err as { message?: string }).message ?? "Error creando pedido");
    }
  };

  if (step === "done") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
        <h1 className="mt-6 font-display text-4xl">¡Pedido confirmado!</h1>
        <p className="mt-3 text-muted-foreground">
          Tu pedido <span className="font-mono text-foreground font-semibold">#{orderNumber}</span> fue registrado.
          Validaremos tu pago en las próximas horas con el código enviado.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/cuenta" className="rounded-full bg-gradient-gold px-6 py-3 text-sm text-primary-foreground">
            Ver mis pedidos
          </Link>
          <Link to="/catalogo" className="rounded-full border border-border px-6 py-3 text-sm">
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl text-center mb-8">Checkout</h1>

      <div className="mb-8 flex justify-center gap-3 text-xs tracking-widest uppercase font-medium">
        <span className={step === "info" ? "text-gold" : "text-muted-foreground"}>1. Datos</span>
        <span>·</span>
        <span className={step === "pay" ? "text-gold" : "text-muted-foreground"}>2. Pago</span>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_400px]">
        <div>
          {step === "info" && (
            <form onSubmit={goToPayment} className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-5">
              <h2 className="font-display text-2xl">Datos de envío</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre completo" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
                <Field label="Teléfono / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Dirección (Calle, Nro, Dpto)" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
              <Field label="Departamento / Ciudad" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground">Notas o Referencia (opcional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-gold/40 transition"
                  maxLength={400}
                />
              </div>
              <button className="w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-luxe hover:opacity-95 transition">
                Continuar al pago
              </button>
            </form>
          )}

          {step === "pay" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-2xl mb-4">Método de pago</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["yape", "plin"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`rounded-2xl border-2 p-4 text-left transition ${method === m ? "border-gold bg-accent" : "border-border hover:border-gold/40"}`}
                    >
                      <p className="font-display text-xl capitalize">{m}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Pago instantáneo con QR</p>
                    </button>
                  ))}
                </div>
              </div>

              <PaymentQR
                method={method}
                amount={total}
                reference={`SMK-${Date.now().toString().slice(-6)}`}
                operationCode={operationCode}
                setOperationCode={setOperationCode}
              />

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("info")} className="flex-1 rounded-full border border-border py-3 text-sm hover:bg-accent transition">
                  Volver
                </button>
                <button
                  type="button"
                  onClick={confirmOrder}
                  className="flex-1 rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-luxe hover:opacity-95 transition"
                >
                  Ya pagué — Confirmar pedido
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen lateral */}
        <aside className="rounded-3xl border border-border bg-gradient-cream p-6 h-fit md:sticky md:top-20">
          <h3 className="font-display text-xl mb-4">Resumen</h3>
          <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {items.map((i, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <img 
                  src={i.image && i.image.trim() !== "" ? i.image : "https://placehold.co/100x100?text=Samka"} 
                  alt={i.name} 
                  className="h-14 w-14 rounded-lg object-cover bg-muted" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground">x{i.quantity}</p>
                </div>
                <span className="font-medium">S/ {((i.unitPrice + i.attributesPriceMod) * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>S/ {SHIPPING.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-border pt-3 font-semibold text-base">
              <span>Total</span>
              <span className="text-gradient-gold">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs tracking-widest uppercase text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40 transition"
        required
      />
    </div>
  );
}