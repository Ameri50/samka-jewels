import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: unknown;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  attributes: Record<string, string>;
  attributesPriceMod: number;
};

export function itemKey(i: CartItem) {
  return `${i.productId}::${JSON.stringify(i.attributes)}`;
}

type CartStore = {
  items: CartItem[];
  open: boolean;
  setOpen: (val: boolean) => void;
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (val) => set({ open: val }),
      add: (item) => {
        const items = get().items;
        const k = itemKey(item);
        const idx = items.findIndex((c) => itemKey(c) === k);
        const next =
          idx >= 0
            ? items.map((c, i) => (i === idx ? { ...c, quantity: c.quantity + item.quantity } : c))
            : [...items, item];
        set({ items: next, open: true });
      },
      remove: (key) => set({ items: get().items.filter((c) => itemKey(c) !== key) }),
      updateQty: (key, qty) =>
        set({
          items: get().items.map((c) =>
            itemKey(c) === key ? { ...c, quantity: Math.max(1, qty) } : c,
          ),
        }),
      clear: () => set({ items: [] }),
      get subtotal() {
        return get().items.reduce(
          (s, i) => s + (i.unitPrice + i.attributesPriceMod) * i.quantity,
          0,
        );
      },
      get count() {
        return get().items.reduce((s, i) => s + i.quantity, 0);
      },
    }),
    { name: "samka-cart-v1" },
  ),
);
