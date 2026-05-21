import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="font-display text-2xl text-gradient-gold">Samka</h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Joyería artesanal peruana. Cada pieza, una historia hecha a mano.
          </p>
          <div className="mt-5 flex gap-3">
            <a 
              aria-label="Instagram" 
              href="https://www.instagram.com/samka.sk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full border border-border/60 p-2 hover:bg-accent transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              aria-label="Facebook" 
              href="https://www.facebook.com/SamkaBrilla" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-full border border-border/60 p-2 hover:bg-accent transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Tienda</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/catalogo" className="hover:text-foreground">Catálogo</Link></li>
            <li><Link to="/catalogo" search={{ categoria: "anillos" }} className="hover:text-foreground">Anillos</Link></li>
            <li><Link to="/catalogo" search={{ categoria: "collares" }} className="hover:text-foreground">Collares</Link></li>
            <li><Link to="/catalogo" search={{ categoria: "aretes" }} className="hover:text-foreground">Aretes</Link></li>
            {/* Añadido: Categoría de pulseras para tus nuevos productos */}
            <li><Link to="/catalogo" search={{ categoria: "pulseras" }} className="hover:text-foreground">Pulseras</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Samka</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre-nosotros" className="hover:text-foreground">Nuestra historia</Link></li>
            <li><Link to="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Samka — Hecho con cariño en Perú
      </div>
    </footer>
  );
}