import { Link } from "@tanstack/react-router";
import { resolveImg } from "@/lib/img";

type Props = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export function ProductCard({ slug, name, price, image, category }: Props) {
  // Evaluamos si el string de la imagen es válido antes de pasarlo al src
  const isValidImage = image && image.trim() !== "";
  const imgSrc = isValidImage ? resolveImg(image) : "https://placehold.co/800x800?text=Samka+Jewels";

  return (
    <Link
      to="/producto/$slug"
      params={{ slug }}
      className="group block hover-lift"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-cream aspect-square shadow-card">
        <img
          src={imgSrc}
          alt={name || "Producto Samka"}
          loading="lazy"
          width={800}
          height={800}
          className="product-img absolute inset-0 h-full w-full object-cover bg-muted"
          onError={(e) => {
            // Si la URL existía pero el enlace está roto por red, evitamos el bucle con un placeholder
            (e.target as HTMLImageElement).src = "https://placehold.co/800x800?text=Samka+Jewels";
          }}
        />
        {/* Cambiado bg-gradient-to-t por bg-linear-to-t para cumplir con la nueva sintaxis de Tailwind */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-ink/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          {category && (
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">{category}</p>
          )}
          <h3 className="font-display text-lg mt-0.5">{name}</h3>
        </div>
        <p className="font-medium whitespace-nowrap pt-1">S/ {Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}