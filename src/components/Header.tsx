import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/sobre-nosotros", label: "Historia" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  // Ahora extraemos 'items' y 'setOpen', los cuales ya están vinculados al disparador global por eventos
  const { items, setOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Evita problemas de hidratación en el contador
  const path = useRouterState({ select: (r) => r.location.pathname });

  // Nos aseguramos de calcular el conteo solo cuando el cliente esté listo en el navegador
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculamos el total sumando las cantidades de cada artículo de forma reactiva
  const cartCount =
    isMounted && items ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-wide">
            <span className="text-gradient-gold font-semibold">Samka</span>
          </span>
        </Link>

        {/* Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "text-sm tracking-wide transition-colors relative py-1",
                path === n.to ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {n.label}
              {path === n.to && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-gold" />
              )}
            </Link>
          ))}
        </nav>

        {/* Panel de Botones e Iconos */}
        <div className="flex items-center gap-2">
          {/* Cuenta / Autenticación */}
          <Link
            to={user ? (isAdmin ? "/admin" : "/cuenta") : "/auth"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
            aria-label="Cuenta"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* 🛒 Icono del Carrito - Ahora setOpen(true) despertará al CartDrawer global */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-gold px-1 text-[10px] font-semibold text-primary-foreground animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botón Hamburguesa (Móvil) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          <nav className="flex flex-col p-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to={user ? (isAdmin ? "/admin" : "/cuenta") : "/auth"}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-base"
            >
              {user ? (isAdmin ? "Panel admin" : "Mi cuenta") : "Iniciar sesión"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
