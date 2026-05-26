import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { resolveImg } from "@/lib/img";
import heroImg from "@/assets/hero.jpg";
import catAnillos from "@/assets/cat-anillos.jpg";
import catAretes from "@/assets/cat-aretes.jpg";
import catCollares from "@/assets/cat-collares.jpg";
import catPulseras from "@/assets/cat-pulseras.jpg";

/** Fallback local por slug cuando Supabase no tiene image_url */
const LOCAL_CAT_IMGS: Record<string, string> = {
  anillos: catAnillos,
  aretes: catAretes,
  collares: catCollares,
  pulseras: catPulseras,
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  image_url: string | null;
  categories: { name: string } | { name: string }[] | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number | null;
}

// ─── Ruta ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samka — Joyería artesanal peruana premium" },
      {
        name: "description",
        content:
          "Descubre joyería peruana hecha a mano. Anillos, collares, aretes y pulseras únicos. Envíos a todo el Perú.",
      },
      {
        property: "og:title",
        content: "Samka — Joyería artesanal peruana premium",
      },
      {
        property: "og:description",
        content: "Piezas únicas inspiradas en la cultura andina, hechas a mano.",
      },
    ],
  }),
  component: HomePage,
});

/** Normaliza texto para comparar: "Anillos" → "anillos", "Arêtes" → "aretes" */
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function getCategoryName(categories: FeaturedProduct["categories"]): string | undefined {
  if (!categories) return undefined;
  const cat = Array.isArray(categories) ? categories[0] : categories;
  return cat?.name;
}

// ─── Carousel de categorías ───────────────────────────────────────────────────

const SLIDE_INTERVAL_MS = 3500;
const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 1;

function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detecta cuántas slides son visibles según breakpoint
  const [visible, setVisible] = useState(VISIBLE_DESKTOP);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setVisible(mq.matches ? VISIBLE_DESKTOP : window.innerWidth >= 640 ? 2 : VISIBLE_MOBILE);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, categories.length - visible);

  const next = useCallback(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), [maxIndex]);
  const prev = useCallback(() => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)), [maxIndex]);

  // Auto-avance; se reinicia cuando cambia maxIndex, visible o next
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, SLIDE_INTERVAL_MS);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [maxIndex, visible, resetTimer]);

  const handlePrev = () => {
    prev();
    resetTimer();
  };
  const handleNext = () => {
    next();
    resetTimer();
  };

  if (categories.length === 0) return null;

  // Ancho de cada tarjeta: reparte el espacio menos los gaps entre slides visibles
  const cardWidth = `calc(${100 / visible}% - ${((visible - 1) * 20) / visible}px)`;
  const trackOffset = `translateX(calc(-${current} * (100% / ${visible}) - ${current} * (20px / ${visible})))`;

  return (
    <div className="relative">
      {/* Track con overflow oculto */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex gap-5 transition-transform duration-700 ease-in-out"
          style={{ transform: trackOffset }}
        >
          {categories.map((c) => {
            const catImgSrc = c.image_url
              ? resolveImg(c.image_url)
              : (LOCAL_CAT_IMGS[c.slug] ?? LOCAL_CAT_IMGS[normalize(c.name)] ?? null);

            return (
              <Link
                key={c.id}
                to="/catalogo"
                search={{ categoria: c.slug }}
                className="group relative shrink-0 overflow-hidden rounded-2xl hover-lift"
                style={{ width: cardWidth }}
              >
                {/* Imagen: Supabase → fallback local por slug → fallback por nombre */}
                <div className="aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
                  {catImgSrc ? (
                    <img
                      src={catImgSrc}
                      alt={c.name}
                      width={600}
                      height={750}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-muted" />
                  )}
                </div>

                {/* Overlay y texto */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="font-display text-xl drop-shadow md:text-2xl">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs uppercase tracking-widest opacity-80 transition group-hover:opacity-100">
                    Explorar <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Flechas */}
      {categories.length > visible && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Anterior"
            className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente"
            className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => {
              setCurrent(i);
              resetTimer();
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-gold" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

function HomePage() {
  const { data: featured = [] } = useQuery<FeaturedProduct[]>({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, image_url, categories(name)")
        .eq("featured", true)
        .eq("active", true)
        .limit(6);
      return (data ?? []) as FeaturedProduct[];
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("display_order");
      return (data ?? []) as Category[];
    },
  });

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-6 md:px-8 md:py-24 lg:py-28">
          {/* Texto — sin reveal para que no empiece oculto en el hero */}
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-cream/60 px-4 py-1.5 text-xs uppercase tracking-widest">
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
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe transition hover:opacity-95"
              >
                Ver colección
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sobre-nosotros"
                className="inline-flex items-center rounded-full border border-foreground/20 px-7 py-3.5 text-sm font-medium transition hover:bg-foreground hover:text-background"
              >
                Nuestra historia
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold" /> Envíos a todo el Perú
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" /> Pago seguro Yape/Plin
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-gold" /> 100% artesanal
              </div>
            </div>
          </div>

          {/* Imagen hero */}
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-6 rounded-4xl bg-gradient-gold opacity-20 blur-2xl" />
              <img
                src={heroImg}
                alt="Joyería artesanal Samka"
                width={1600}
                height={1200}
                className="relative aspect-4/3 w-full rounded-4xl object-cover shadow-luxe"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl glass p-4 shadow-card md:block">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Desde</p>
                <p className="font-display text-2xl text-gradient-gold">S/ 129</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Colecciones</p>
            <h2 className="mt-2 font-display text-4xl">Explora por categoría</h2>
          </div>
          <Link
            to="/catalogo"
            className="hidden items-center gap-1 text-sm transition hover:text-gold md:inline-flex"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Pasarela automática */}
        <CategoriesCarousel categories={categories} />
      </section>

      {/* ── DESTACADOS ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-gold">Lo más amado</p>
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
              category={getCategoryName(p.categories)}
            />
          ))}
        </div>
      </section>

      {/* ── MANIFIESTO ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold">Nuestro manifiesto</p>
          <p className="mt-6 font-display text-3xl leading-snug md:text-4xl">
            "Cada pieza Samka nace de manos que conocen{" "}
            <em className="text-gradient-gold">la tradición</em>, el oficio y el cariño de quien las
            hace. No producimos joyas en serie: creamos historias para ser usadas."
          </p>
          <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
            — Equipo Samka
          </p>
        </div>
      </section>
    </div>
  );
}
