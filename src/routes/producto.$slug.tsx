import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Check, Plus, Minus, ShoppingBag, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart-store";
import { resolveImg } from "@/lib/img";

export const Route = createFileRoute("/producto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Samka` },
      { name: "description", content: "Joyería artesanal peruana hecha a mano." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { add, setOpen } = useCart(); // <-- Añadimos setOpen aquí
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, { value: string; mod: number }>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: prod } = await supabase
        .from("products")
        .select("*, categories(name, slug), product_attributes(*)")
        .eq("slug", slug)
        .maybeSingle();
      return prod;
    },
  });

  const groupedAttrs = useMemo(() => {
    const g: Record<string, { value: string; mod: number }[]> = {};
    data?.product_attributes?.forEach((a: { attribute_type: string; value: string; price_modifier: number }) => {
      g[a.attribute_type] = g[a.attribute_type] ?? [];
      g[a.attribute_type].push({ value: a.value, mod: Number(a.price_modifier) });
    });
    return g;
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl grid gap-12 px-4 py-12 md:grid-cols-2 md:px-8">
        <div className="aspect-square rounded-2xl bg-muted shimmer" />
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded shimmer" />
          <div className="h-12 w-2/3 bg-muted rounded shimmer" />
          <div className="h-24 bg-muted rounded shimmer" />
        </div>
      </div>
    );
  }

  const modSum = Object.values(selected).reduce((s, v) => s + v.mod, 0);
  const finalPrice = Number(data.price) + modSum;
  const lowStock = data.stock > 0 && data.stock <= data.low_stock_threshold;

  const handleAdd = () => {
    const attrEntries = Object.entries(selected);
    if (Object.keys(groupedAttrs).length > 0 && attrEntries.length < Object.keys(groupedAttrs).length) {
      toast.error("Selecciona todas las opciones");
      return;
    }
    if (data.stock < 1) {
      toast.error("Sin stock");
      return;
    }
    
    // 1. Agrega el producto al estado global
    add({
      productId: data.id,
      name: data.name,
      image: resolveImg(data.image_url),
      unitPrice: Number(data.price),
      quantity: qty,
      attributes: Object.fromEntries(attrEntries.map(([k, v]) => [k, v.value])),
      attributesPriceMod: modSum,
    });
    
    // 2. Muestra notificación de éxito
    toast.success("Agregado a tu bolsa");

    // 3. Abre forzosamente el panel lateral del carrito (CartDrawer)
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <nav className="text-xs text-muted-foreground mb-6 flex gap-2">
        <Link to="/" className="hover:text-foreground">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link>
        <span>/</span>
        <span className="text-foreground">{data.name}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-cream aspect-square shadow-card">
            <img
              src={resolveImg(data.image_url)}
              alt={data.name}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="reveal">
          {data.categories && (
            <p className="text-xs tracking-widest uppercase text-gold">{(data.categories as { name: string }).name}</p>
          )}
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{data.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-gradient-gold">S/ {finalPrice.toFixed(2)}</span>
            {modSum > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                S/ {Number(data.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{data.description}</p>

          {lowStock && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive">
              <Sparkles className="h-3 w-3" /> ¡Solo quedan {data.stock}!
            </div>
          )}

          {/* Personalización */}
          <div className="mt-8 space-y-6">
            {Object.entries(groupedAttrs).map(([type, opts]) => (
              <div key={type}>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">{type}</p>
                <div className="flex flex-wrap gap-2">
                  {opts.map((o) => {
                    const active = selected[type]?.value === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setSelected({ ...selected, [type]: o })}
                        className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-gold bg-gradient-gold text-primary-foreground shadow-soft" : "border-border hover:border-gold/50"}`}
                      >
                        {active && <Check className="inline h-3 w-3 mr-1" />}
                        {o.value}
                        {o.mod > 0 && <span className="ml-1 opacity-80">+S/{o.mod}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cantidad + CTA */}
          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-accent rounded-l-full">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 w-10 text-center font-medium">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="p-3 hover:bg-accent rounded-r-full">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={data.stock < 1}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe hover:opacity-95 disabled:opacity-50 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              {data.stock < 1 ? "Agotado" : "Agregar a la bolsa"}
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border p-5 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-gold" /> Envío a todo el Perú en 2-5 días</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-gold" /> Garantía de calidad artesanal</div>
            <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-gold" /> Pieza única hecha a mano</div>
          </div>
        </div>
      </div>
    </div>
  );
}