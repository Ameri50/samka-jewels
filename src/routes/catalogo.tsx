import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// 🚀 CORREGIDO: Cambiado de "/catalogo/" a "/catalogo"
export const Route = createFileRoute("/catalogo")({
  component: CatalogPage,
});

function CatalogPage() {
  // Solución al error de hidratación
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🚀 CORREGIDO: Cambiado 'from' de "/catalogo/" a "/catalogo"
  const search = useSearch({ from: "/catalogo" }) as { orden?: string };
  const ordenActual = search.orden || "nuevo";

  // Consulta de datos con React Query y Supabase
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos", ordenActual],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

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

  // Renderizado seguro durante el proceso de SSR (Servidor)
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
        
        {/* Barra de Filtros / Ordenamiento */}
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

      {/* Grid de productos o estados alternos */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">
          Buscando piezas disponibles...
        </div>
      ) : productos.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No se encontraron productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto: any) => (
            <div
              key={producto.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background p-4 transition hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-accent group-hover:opacity-75 transition">
                <img
                  src={producto.image_url || "/placeholder.svg"}
                  alt={producto.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 flex flex-col justify-between grow">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{producto.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {producto.description}
                  </p>
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">
                  ${producto.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}