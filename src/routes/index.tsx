import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { resolveImg } from "@/lib/img";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samka — Joyería artesanal peruana premium" },
      {
        name: "description",
        content:
          "Descubre joyería peruana hecha a mano. Anillos, collares, aretes y pulseras únicos. Envíos a todo el Perú.",
      },
      { property: "og:title", content: "Samka — Joyería artesanal peruana premium" },
      {
        property: "og:description",
        content: "Piezas únicas inspiradas en la cultura andina, hechas a mano.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, image_url, categories(name)")
        .eq("featured", true)
        .eq("active", true)
        .limit(6);
      return data ?? [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      return data ?? [];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-6 md:px-8 md:py-24 lg:py-28">
          <div className="reveal order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-cream/60 px-4 py-1.5 text-xs tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Hecho a mano en Perú
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              Joyería que cuenta <br />
              <span className="text-gradient-gold italic">tu historia</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Piezas únicas hechas por orfebres peruanos. Materiales nobles, diseño contemporáneo,
              alma andina.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe hover:opacity-95 transition"
              >
                Ver colección
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sobre-nosotros"
                className="inline-flex items-center rounded-full border border-foreground/20 px-7 py-3.5 text-sm font-medium hover:bg-foreground hover:text-background transition"
              >
                Nuestra historia
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-gold" /> Envíos a todo el Perú</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Pago seguro Yape/Plin</div>
              <div className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-gold" /> 100% artesanal</div>
            </div>
          </div>

          <div className="reveal reveal-delay-1 order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-gold opacity-20 blur-2xl" />
              <img
                src={heroImg}
                alt="Joyería artesanal Samka"
                width={1600}
                height={1200}
                className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-luxe"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl glass p-4 shadow-card md:block">
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Desde</p>
                <p className="font-display text-2xl text-gradient-gold">S/ 129</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-widest uppercase text-gold">Colecciones</p>
            <h2 className="mt-2 font-display text-4xl">Explora por categoría</h2>
          </div>
          <Link to="/catalogo" className="hidden md:inline-flex items-center gap-1 text-sm hover:text-gold transition">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/catalogo"
              search={{ categoria: c.slug }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-card hover-lift reveal"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={resolveImg(c.image_url)}
                alt={c.name}
                loading="lazy"
                className="product-img absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 p-6 text-cream">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <p className="mt-1 text-xs tracking-widest uppercase opacity-90">Explorar →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-gold">Lo más amado</p>
          <h2 className="mt-2 font-display text-4xl">Piezas destacadas</h2>
          <div className="divider-gold mx-auto mt-4 w-24" />
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              price={Number(p.price)}
              image={p.image_url ?? ""}
              category={(p.categories as { name: string } | null)?.name}
            />
          ))}
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
          <p className="text-xs tracking-widest uppercase text-gold">Nuestro manifiesto</p>
          <p className="mt-6 font-display text-3xl leading-snug md:text-4xl">
            "Cada pieza Samka nace de manos que conocen <em className="text-gradient-gold">la tradición</em>,
            el oficio y el cariño de quien las hace. No producimos joyas en serie:
            creamos historias para ser usadas."
          </p>
          <p className="mt-6 text-sm tracking-widest uppercase text-muted-foreground">— Equipo Samka</p>
        </div>
      </section>
    </div>
  );
}
