import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/catalogo")({
  component: CatalogPage,
});

function CatalogPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const search = useSearch({ from: "/catalogo" }) as { orden?: string };
  const ordenActual = search.orden || "nuevo";

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos", ordenActual],
    queryFn: async () => {
      let query = supabase.from("products").select("*, categories(name, slug)");

      if (ordenActual === "nuevo") {
        query = query.order("created_at", { ascending: false });
      } else if (ordenActual === "precio-menor") {
        query = query.order("price", { ascending: true });
      } else if (ordenActual === "precio-mayor") {
        query = query.order("price", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isMounted,
  });

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-muted-foreground animate-pulse">Cargando catálogo de Samka...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap gap-3 items-center justify-between">
        <h1 className="font-display text-3xl">Nuestro Catálogo</h1>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/catalogo"
            search={{ orden: "nuevo" }}
            className={`rounded-full px-5 py-2 text-sm transition ${
              ordenActual === "nuevo"
                ? "bg-gradient-gold text-primary-foreground font-medium shadow-sm"
                : "border border-border bg-background hover:bg-accent text-foreground"
            }`}
          >
            Todas (Recientes)
          </Link>
          <Link
            to="/catalogo"
            search={{ orden: "precio-menor" }}
            className={`rounded-full px-5 py-2 text-sm transition ${
              ordenActual === "precio-menor"
                ? "bg-gradient-gold text-primary-foreground font-medium shadow-sm"
                : "border border-border bg-background hover:bg-accent text-foreground"
            }`}
          >
            Precio: Menor a Mayor
          </Link>
          <Link
            to="/catalogo"
            search={{ orden: "precio-mayor" }}
            className={`rounded-full px-5 py-2 text-sm transition ${
              ordenActual === "precio-mayor"
                ? "bg-gradient-gold text-primary-foreground font-medium shadow-sm"
                : "border border-border bg-background hover:bg-accent text-foreground"
            }`}
          >
            Precio: Mayor a Menor
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">
          Buscando piezas disponibles...
        </div>
      ) : productos.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No se encontraron productos disponibles.
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto: any) => (
            <ProductCard
              key={producto.id}
              slug={producto.slug}
              name={producto.name}
              price={producto.price}
              image={producto.image_url}
              category={producto.categories?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}