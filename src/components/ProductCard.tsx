import { Link } from "@tanstack/react-router";
import { resolveImg } from "@/lib/img";
import { Eye } from "lucide-react";

type Props = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export function ProductCard({ slug, name, price, image, category }: Props) {
  const isValidImage = image && image.trim() !== "";
  // eslint-disable-next-line prettier/prettier
  const imgSrc = isValidImage ? resolveImg(image) : "https://placehold.co/800x800?text=Samka+Jewels";

  return (
    <Link to="/producto/$slug" params={{ slug }} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-cream aspect-square shadow-card">
        <img
          src={imgSrc}
          alt={name || "Producto Samka"}
          loading="lazy"
          width={800}
          height={800}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/800x800?text=Samka+Jewels";
          }}
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Botón Ver producto */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
            <Eye className="h-4 w-4" />
            Ver producto
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          {category && (
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">
              {category}
            </p>
          )}
          <h3 className="font-display text-lg mt-0.5 group-hover:text-gold transition-colors duration-200">
            {name}
          </h3>
        </div>
        <p className="font-medium whitespace-nowrap pt-1">S/ {Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}
