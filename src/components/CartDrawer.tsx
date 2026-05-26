import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";

export function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal, itemKey } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // eslint-disable-next-line prettier/prettier
  // 🔴 ¡ESTA ES LA MAGIA! Si 'open' es falso, el carrito desaparece por completo del HTML 
  // y no se queda atascado en el fondo a la derecha de la pantalla.
  if (!open) return null;

  return (
    <>
      {/* Fondo oscuro traslúcido */}
      <div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity opacity-100"
        onClick={() => setOpen(false)}
      />
      {/* Panel del Carrito - Le quitamos el translate-x-full problemático */}
      // eslint-disable-next-line prettier/prettier
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-luxe transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] translate-x-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="font-display text-xl">Tu bolsa</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-accent"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="rounded-full bg-accent p-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Tu bolsa está vacía</p>
              <Link
                to="/catalogo"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gradient-gold px-6 py-2.5 text-sm text-primary-foreground hover:opacity-90"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-5">
                  {items.map((it) => {
                    const k = itemKey(it);
                    const lineTotal = (it.unitPrice + it.attributesPriceMod) * it.quantity;
                    return (
                      <li key={k} className="flex gap-4">
                        <img
                          src={
                            it.image && it.image.trim() !== ""
                              ? it.image
                              : "https://placehold.co/100x100?text=Samka"
                          }
                          alt={it.name}
                          className="h-24 w-24 rounded-xl object-cover bg-muted"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <h3 className="font-medium truncate">{it.name}</h3>
                            <button onClick={() => remove(k)} aria-label="Quitar">
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                          {Object.keys(it.attributes).length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              // eslint-disable-next-line prettier/prettier
                              {Object.entries(it.attributes)
                                .map(([k2, v]) => `${k2}: ${v}`)
                                .join(" · ")}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-border">
                              <button
                                className="p-1.5 hover:bg-accent rounded-l-full"
                                onClick={() => updateQty(k, it.quantity - 1)}
                                aria-label="Menos"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-sm w-8 text-center">{it.quantity}</span>
                              <button
                                className="p-1.5 hover:bg-accent rounded-r-full"
                                onClick={() => updateQty(k, it.quantity + 1)}
                                aria-label="Más"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-medium">S/ {lineTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-gradient-gold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-gradient-gold py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Finalizar compra
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
