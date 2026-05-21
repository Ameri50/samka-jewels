// Lightweight cart store using localStorage + custom events.
import { useEffect, useState, useCallback } from "react";

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  attributes: Record<string, string>;
  attributesPriceMod: number;
};

const KEY = "samka-cart-v1";
const EVT = "samka-cart-change";
const EVT_OPEN = "samka-cart-open-change"; // <-- NUEVO: Evento global para abrir/cerrar

// Variable interna para guardar el estado de apertura fuera del ciclo del Hook
let globalOpen = false;

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

function itemKey(i: CartItem) {
  return `${i.productId}::${JSON.stringify(i.attributes)}`;
}

// Función global para cambiar el estado de apertura desde cualquier parte
function writeOpen(isOpen: boolean) {
  globalOpen = isOpen;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVT_OPEN, { detail: isOpen }));
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpenState] = useState(globalOpen); // <-- Estado sincronizado

  // Interceptamos la función setOpen original para que despache el evento global
  const setOpen = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === "function" ? val(globalOpen) : val;
    writeOpen(nextVal);
  }, []);

  useEffect(() => {
    setItems(read());
    setOpenState(globalOpen);

    const onChange = () => setItems(read());
    const onOpenChange = (e: Event) => {
      setOpenState((e as CustomEvent).detail);
    };

    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    window.addEventListener(EVT_OPEN, onOpenChange); // <-- Escucha cambios de apertura

    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
      window.removeEventListener(EVT_OPEN, onOpenChange);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const current = read();
    const k = itemKey(item);
    const idx = current.findIndex((c) => itemKey(c) === k);
    if (idx >= 0) {
      current[idx].quantity += item.quantity;
    } else {
      current.push(item);
    }
    write(current);
    writeOpen(true); // <-- Abre el carrito globalmente al añadir un producto
  }, []);

  const remove = useCallback((key: string) => {
    write(read().filter((c) => itemKey(c) !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    const next = read().map((c) =>
      itemKey(c) === key ? { ...c, quantity: Math.max(1, qty) } : c,
    );
    write(next);
  }, []);

  const clear = useCallback(() => write([]), []);

  const subtotal = items.reduce(
    (s, i) => s + (i.unitPrice + i.attributesPriceMod) * i.quantity,
    0,
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return { items, add, remove, updateQty, clear, subtotal, count, open, setOpen, itemKey };
}