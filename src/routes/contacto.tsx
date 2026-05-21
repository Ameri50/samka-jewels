import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin, Send, Facebook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Samka" },
      { name: "description", content: "Escríbenos. Atención personalizada para cada cliente." },
      { property: "og:title", content: "Contacto — Samka" },
      { property: "og:description", content: "Hablemos de tu próxima pieza Samka." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(80),
  email: z.string().trim().email("Email inválido").max(160),
  message: z.string().trim().min(10, "Cuéntanos un poco más").max(800),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    toast.success("¡Mensaje enviado! Te responderemos pronto.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest uppercase text-gold">Contacto</p>
        <h1 className="mt-2 font-display text-5xl">Hablemos</h1>
        <div className="divider-gold mx-auto mt-4 w-24" />
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          {[
            { 
              icon: Facebook, 
              label: "Facebook", 
              value: "samka.sk", 
              href: "https://www.facebook.com/SamkaBrilla" // Cambia aquí tu enlace real si es diferente
            },
            { 
              icon: Instagram, 
              label: "Instagram", 
              value: "@samka.sk", 
              href: "https://www.instagram.com/samka.sk" 
            },
            { 
              icon: MapPin, 
              label: "Atelier", 
              value: "Trujillo, Perú"
            },
          ].map((c) => (
            <a 
              key={c.label} 
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-border p-5 hover-lift bg-card transition-all cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-medium text-foreground hover:text-gold transition-colors">{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-5">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
              maxLength={80}
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40"
              maxLength={160}
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground">Mensaje</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40 resize-none"
              maxLength={800}
            />
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-luxe hover:opacity-95">
            Enviar mensaje <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}