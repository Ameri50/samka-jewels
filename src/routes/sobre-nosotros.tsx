import { createFileRoute } from "@tanstack/react-router";
import { Heart, Hammer, Leaf } from "lucide-react";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: "Nuestra historia — Samka" },
      { name: "description", content: "Conoce el origen de Samka y nuestros artesanos peruanos." },
      { property: "og:title", content: "Nuestra historia — Samka" },
      { property: "og:description", content: "Joyería artesanal con alma andina." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8">
          <p className="text-xs tracking-widest uppercase text-gold">Nuestra historia</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">
            Tradición que <span className="text-gradient-gold italic">brilla</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Samka nació en los Andes peruanos como un puente entre las manos artesanas y quienes
            buscan piezas con alma. Cada joya es un acto de paciencia, oficio y memoria.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl grid gap-8 px-4 py-20 md:grid-cols-3 md:px-8">
        {[
          { icon: Hammer, title: "Hecho a mano", text: "Cada pieza es trabajada por orfebres con décadas de oficio." },
          { icon: Leaf, title: "Materiales nobles", text: "Plata 925 y oro 18k de proveedores responsables." },
          { icon: Heart, title: "Con propósito", text: "Cada compra apoya directamente a familias artesanas." },
        ].map((b, i) => (
          <div key={b.title} className="reveal text-center" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-luxe">
              <b.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl">{b.title}</h3>
            <p className="mt-2 text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
          <p className="font-display text-3xl leading-snug">
            "Samka" significa <em className="text-gradient-gold">sueño</em> en quechua.
            Cada joya que creamos es un sueño que toma forma en metal.
          </p>
        </div>
      </section>
    </div>
  );
}
