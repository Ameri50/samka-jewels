import { createFileRoute } from "@tanstack/react-router";
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
  subject: z.string().trim().min(2, "Selecciona un asunto").max(80),
  message: z.string().trim().min(10, "Cuéntanos un poco más").max(800),
});

const SUBJECTS = [
  "Pedido personalizado",
  "Consulta sobre producto",
  "Envíos y entregas",
  "Cuidado de joyas",
  "Colaboración / Prensa",
  "Otro",
];

const WHATSAPP_NUMBER = "51999999999";

const INFO_CARDS = [
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "+51 999 999 999",
    sub: "Respuesta en menos de 24h",
    link: `https://wa.me/${WHATSAPP_NUMBER}`,
    accent: "#25d366",
  },
  {
    icon: "mail",
    label: "Email",
    value: "hola@samka.pe",
    sub: "Para consultas formales",
    link: "mailto:hola@samka.pe",
    accent: "#c9a84c",
  },
  {
    icon: "clock",
    label: "Horario",
    value: "Lun–Vie 9am–7pm",
    sub: "Sáb 10am–4pm",
    link: null,
    accent: "#c9a84c",
  },
  {
    icon: "package",
    label: "Envíos",
    value: "Todo el Perú",
    sub: "Olva Courier y Shalom",
    link: null,
    accent: "#c9a84c",
  },
  {
    icon: "credit-card",
    label: "Pagos",
    value: "Yape / Plin",
    sub: "100% seguro",
    link: null,
    accent: "#c9a84c",
  },
];

const SOCIALS = [
  { label: "Instagram", icon: "brand-instagram", href: "https://www.instagram.com/samka.sk" },
  { label: "Facebook", icon: "brand-facebook", href: "https://www.facebook.com/SamkaBrilla" },
  { label: "TikTok", icon: "brand-tiktok", href: "https://www.tiktok.com/@samka" },
];

// ─── tiny icon helper (Tabler outline) ───────────────────────────────────────
function Icon({ name, size = 16, color }: { name: string; size?: number; color?: string }) {
  return (
    <i
      className={`ti ti-${name}`}
      aria-hidden="true"
      style={{ fontSize: size, color, lineHeight: 1, display: "inline-flex", alignItems: "center" }}
    />
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setSending(true);
    await new Promise((res) => setTimeout(res, 700));
    setSending(false);
    setSent(true);
    toast.success("¡Abriendo WhatsApp! 💛");
    const text = [
      `*Nombre:* ${form.name}`,
      `*Email:* ${form.email}`,
      `*Asunto:* ${form.subject}`,
      `*Mensaje:* ${form.message}`,
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      setCharCount(0);
    }, 3500);
  };

  // ─── shared style helpers ─────────────────────────────────────────────────
  const gold = "#c9a84c";
  const goldBorder = "rgba(201,168,76,0.22)";
  const goldLight = "rgba(201,168,76,0.10)";
  const wa = "#25d366";

  const eyebrow: React.CSSProperties = {
    display: "block",
    fontSize: "0.56rem",
    letterSpacing: "0.45em",
    textTransform: "uppercase",
    color: gold,
    fontWeight: 500,
    marginBottom: "0.6rem",
  };

  const inputBase = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "0.75rem 0.9rem",
    borderRadius: 10,
    border: focused === name ? `1px solid ${gold}` : `0.5px solid ${goldBorder}`,
    background: focused === name ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
    color: "var(--foreground)",
    fontSize: "0.88rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: focused === name ? `0 0 0 3px rgba(201,168,76,0.1)` : "none",
  });

  return (
    <>
      {/* font import */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap"
      />

      <div
        style={{
          minHeight: "100vh",
          padding: "3.5rem clamp(1rem,4vw,2.5rem) 5rem",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* ── Hero ── */}
          <div style={{ marginBottom: "2.8rem" }}>
            <span style={eyebrow}>Estamos aquí para ti</span>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.2rem,5vw,3.4rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "var(--foreground)",
                margin: "0 0 0.85rem",
              }}
            >
              Hablemos de tu próxima{" "}
              <em style={{ fontStyle: "italic", color: gold }}>pieza Samka</em>
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.65,
                maxWidth: 400,
                fontWeight: 300,
              }}
            >
              Cada joya tiene una historia. Cuéntanos la tuya y la haremos realidad.
            </p>
          </div>

          {/* ── Info cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.6rem",
              marginBottom: "1.1rem",
            }}
          >
            {INFO_CARDS.map((c) => (
              <div
                key={c.label}
                onClick={() => c.link && window.open(c.link, "_blank", "noopener,noreferrer")}
                style={{
                  padding: "1.05rem 0.95rem",
                  borderRadius: 14,
                  border: `0.5px solid ${goldBorder}`,
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  cursor: c.link ? "pointer" : "default",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (c.link) {
                    (e.currentTarget as HTMLElement).style.borderColor = gold;
                    (e.currentTarget as HTMLElement).style.background = goldLight;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = goldBorder;
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.55)";
                }}
              >
                <div style={{ marginBottom: "0.55rem" }}>
                  <Icon name={`ti-${c.icon}`} size={18} color={c.accent} />
                </div>
                <p
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: gold,
                    fontWeight: 500,
                    marginBottom: "0.2rem",
                  }}
                >
                  {c.label}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    lineHeight: 1.3,
                    marginBottom: "0.1rem",
                  }}
                >
                  {c.value}
                </p>
                <p
                  style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", fontWeight: 300 }}
                >
                  {c.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── Socials ── */}
          <div
            style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.4rem" }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.48rem 1rem",
                  borderRadius: 50,
                  border: `0.5px solid ${goldBorder}`,
                  background: "rgba(255,255,255,0.5)",
                  color: "var(--muted-foreground)",
                  fontSize: "0.78rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = gold;
                  el.style.color = gold;
                  el.style.background = goldLight;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = goldBorder;
                  el.style.color = "var(--muted-foreground)";
                  el.style.background = "rgba(255,255,255,0.5)";
                }}
              >
                <Icon name={`ti-${s.icon}`} size={14} />
                {s.label}
              </a>
            ))}
          </div>

          {/* ── Divider ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2.4rem 0" }}>
            <div style={{ flex: 1, height: "0.5px", background: goldBorder }} />
            <div
              style={{
                width: 6,
                height: 6,
                background: gold,
                transform: "rotate(45deg)",
                opacity: 0.55,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, height: "0.5px", background: goldBorder }} />
          </div>

          {/* ── Form section ── */}
          <div>
            <div style={{ marginBottom: "1.4rem" }}>
              <span style={eyebrow}>Escríbenos</span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.5rem,2.8vw,2rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Tu historia, <em style={{ fontStyle: "italic", color: gold }}>nos inspira</em>
              </h2>
            </div>

            {/* card wrapper with corner accents */}
            <div
              style={{
                position: "relative",
                border: `0.5px solid ${goldBorder}`,
                borderRadius: 20,
                padding: "clamp(1.4rem,3vw,2rem)",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* corner accents */}
              {[
                {
                  top: -0.5,
                  left: -0.5,
                  borderTop: `1.5px solid ${gold}`,
                  borderLeft: `1.5px solid ${gold}`,
                  borderRadius: "20px 0 0 0",
                },
                {
                  top: -0.5,
                  right: -0.5,
                  borderTop: `1.5px solid ${gold}`,
                  borderRight: `1.5px solid ${gold}`,
                  borderRadius: "0 20px 0 0",
                },
                {
                  bottom: -0.5,
                  left: -0.5,
                  borderBottom: `1.5px solid ${gold}`,
                  borderLeft: `1.5px solid ${gold}`,
                  borderRadius: "0 0 0 20px",
                },
                {
                  bottom: -0.5,
                  right: -0.5,
                  borderBottom: `1.5px solid ${gold}`,
                  borderRight: `1.5px solid ${gold}`,
                  borderRadius: "0 0 20px 0",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{ position: "absolute", width: 16, height: 16, opacity: 0.45, ...s }}
                />
              ))}

              {sent ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 260,
                    gap: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: `1.5px solid ${wa}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={wa}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        color: "var(--foreground)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      ¡Abriendo WhatsApp!
                    </p>
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "var(--muted-foreground)",
                        fontWeight: 300,
                      }}
                    >
                      Tu mensaje está listo para enviar 💛
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
                >
                  {/* Name + Email row */}
                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}
                    className="form-two-col"
                  >
                    {[
                      { id: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
                      { id: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
                    ].map((f) => (
                      <div key={f.id}>
                        <label
                          htmlFor={f.id}
                          style={{
                            display: "block",
                            fontSize: "0.53rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: focused === f.id ? gold : "var(--muted-foreground)",
                            fontWeight: 500,
                            marginBottom: "0.35rem",
                            transition: "color 0.2s",
                          }}
                        >
                          {f.label}
                        </label>
                        <input
                          id={f.id}
                          type={f.type}
                          value={form[f.id as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                          onFocus={() => setFocused(f.id)}
                          onBlur={() => setFocused(null)}
                          placeholder={f.placeholder}
                          maxLength={f.id === "email" ? 160 : 80}
                          style={inputBase(f.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Subject pills */}
                  <div>
                    <p
                      style={{
                        fontSize: "0.53rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground)",
                        fontWeight: 500,
                        marginBottom: "0.55rem",
                      }}
                    >
                      Asunto
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {SUBJECTS.map((s) => {
                        const active = form.subject === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, subject: s })}
                            style={{
                              padding: "0.32rem 0.82rem",
                              borderRadius: 50,
                              fontSize: "0.73rem",
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: active ? 500 : 400,
                              border: active ? `1px solid ${gold}` : `0.5px solid ${goldBorder}`,
                              background: active ? goldLight : "transparent",
                              color: active ? gold : "var(--muted-foreground)",
                              cursor: "pointer",
                              transition: "all 0.18s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!active) {
                                (e.currentTarget as HTMLElement).style.borderColor = gold;
                                (e.currentTarget as HTMLElement).style.color = gold;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!active) {
                                (e.currentTarget as HTMLElement).style.borderColor = goldBorder;
                                (e.currentTarget as HTMLElement).style.color =
                                  "var(--muted-foreground)";
                              }
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <label
                        htmlFor="message"
                        style={{
                          fontSize: "0.53rem",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: focused === "message" ? gold : "var(--muted-foreground)",
                          fontWeight: 500,
                          transition: "color 0.2s",
                        }}
                      >
                        Mensaje
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                        <div
                          style={{
                            height: "2.5px",
                            width: 44,
                            borderRadius: 2,
                            background: goldBorder,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${(charCount / 800) * 100}%`,
                              background: charCount > 700 ? "#ef4444" : gold,
                              transition: "width 0.15s",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "0.62rem",
                            color: charCount > 700 ? "#ef4444" : "var(--muted-foreground)",
                          }}
                        >
                          {charCount}/800
                        </span>
                      </div>
                    </div>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        setCharCount(e.target.value.length);
                      }}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder="Cuéntanos sobre tu idea, pieza o consulta..."
                      maxLength={800}
                      style={{ ...inputBase("message"), resize: "none", lineHeight: 1.75 }}
                    />
                  </div>

                  {/* WA hint */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <Icon name="ti-brand-whatsapp" size={14} color="rgba(37,211,102,0.75)" />
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--muted-foreground)",
                        fontWeight: 300,
                      }}
                    >
                      Al enviar, se abrirá WhatsApp con tu mensaje listo.
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: "100%",
                      padding: "0.95rem 1.5rem",
                      borderRadius: 12,
                      border: "none",
                      background: sending
                        ? "rgba(37,211,102,0.18)"
                        : "linear-gradient(135deg,#0f7a3e 0%,#25d366 55%,#5de68d 100%)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      cursor: sending ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "opacity 0.2s, transform 0.15s",
                      boxShadow: sending ? "none" : "0 8px 28px rgba(37,211,102,0.28)",
                    }}
                    onMouseEnter={(e) => {
                      if (!sending) {
                        (e.currentTarget as HTMLElement).style.opacity = "0.9";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = "1";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    <Icon name="ti-brand-whatsapp" size={16} color="#fff" />
                    {sending ? "Abriendo WhatsApp..." : "Enviar por WhatsApp"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
