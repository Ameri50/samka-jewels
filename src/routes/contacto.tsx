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

const corners: React.CSSProperties[] = [
  {
    top: 0,
    left: 0,
    borderTop: "2px solid #c9a84c",
    borderLeft: "2px solid #c9a84c",
    borderRadius: "24px 0 0 0",
  },
  {
    top: 0,
    right: 0,
    borderTop: "2px solid #c9a84c",
    borderRight: "2px solid #c9a84c",
    borderRadius: "0 24px 0 0",
  },
  {
    bottom: 0,
    left: 0,
    borderBottom: "2px solid #c9a84c",
    borderLeft: "2px solid #c9a84c",
    borderRadius: "0 0 0 24px",
  },
  {
    bottom: 0,
    right: 0,
    borderBottom: "2px solid #c9a84c",
    borderRight: "2px solid #c9a84c",
    borderRadius: "0 0 24px 0",
  },
];

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
    await new Promise((res) => setTimeout(res, 800));
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
    }, 3000);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    border: focused === name ? "1.5px solid #c9a84c" : "1.5px solid rgba(201,168,76,0.2)",
    background: focused === name ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.6)",
    color: "var(--foreground)",
    fontSize: "0.92rem",
    outline: "none",
    transition: "all 0.25s ease",
    boxShadow: focused === name ? "0 0 0 3px rgba(201,168,76,0.12)" : "none",
    fontFamily: "inherit",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem clamp(1rem,4vw,3rem)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5rem",
          alignItems: "stretch",
        }}
      >
        {/* ── LEFT: Map + info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: "0.5rem",
              }}
            >
              Encuéntranos
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Atelier Samka
              <br />
              <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Trujillo, Perú</em>
            </h2>
          </div>

          {/* Map */}
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1.5px solid rgba(201,168,76,0.2)",
              flex: 1,
              minHeight: "320px",
            }}
          >
            <iframe
              title="Samka Atelier — Trujillo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31478.60!2d-79.0215!3d-8.1120!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d1be0de4ab5%3A0xa98daf9f1a9b3d72!2sTrujillo%2C%20La%20Libertad!5e0!3m2!1ses!2spe!4v1700000000000"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
                minHeight: "320px",
                filter: "saturate(0.85) contrast(1.05)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map overlay badge */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#c9a84c",
                  boxShadow: "0 0 8px rgba(201,168,76,0.8)",
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#1a1209",
                    lineHeight: 1.2,
                  }}
                >
                  Trujillo, La Libertad
                </p>
                <p style={{ fontSize: "0.62rem", color: "#888", lineHeight: 1.2 }}>
                  Visitas con cita previa
                </p>
              </div>
            </div>
          </div>

          {/* Info cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { icon: "🕐", label: "Horario", value: "Lun–Vie 9am–7pm", sub: "Sáb 10am–4pm" },
              {
                icon: "📱",
                label: "WhatsApp",
                value: "+51 999 999 999",
                sub: "Respuesta en < 24h",
              },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  padding: "1rem 1.1rem",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(201,168,76,0.15)",
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>{c.icon}</div>
                <p
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#c9a84c",
                    marginBottom: "0.2rem",
                  }}
                >
                  {c.label}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    lineHeight: 1.3,
                  }}
                >
                  {c.value}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: "0.5rem",
              }}
            >
              Escríbenos
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Tu historia de <em style={{ fontStyle: "italic", color: "#c9a84c" }}>nos inspira</em>
            </h2>
          </div>

          <div
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.6)",
              border: "1.5px solid rgba(201,168,76,0.18)",
              borderRadius: "24px",
              padding: "clamp(1.25rem,3vw,2rem)",
              backdropFilter: "blur(12px)",
              flex: 1,
            }}
          >
            {corners.map((corner, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "18px",
                  height: "18px",
                  opacity: 0.6,
                  ...corner,
                }}
              />
            ))}

            {sent ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "2px solid #25d366",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#25d366"
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
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    ¡Abriendo WhatsApp!
                  </p>
                  <p style={{ fontSize: "0.86rem", color: "var(--muted-foreground)" }}>
                    Tu mensaje está listo para enviar 💛
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submit}
                style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
              >
                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { id: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
                    { id: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label
                        htmlFor={f.id}
                        style={{
                          display: "block",
                          fontSize: "0.58rem",
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          color: focused === f.id ? "#c9a84c" : "var(--muted-foreground)",
                          marginBottom: "0.4rem",
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
                        style={inputStyle(f.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Subject chips */}
                <div>
                  <p
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    Asunto
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {SUBJECTS.map((s) => {
                      const active = form.subject === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm({ ...form, subject: s })}
                          style={{
                            padding: "0.38rem 0.85rem",
                            borderRadius: "50px",
                            fontSize: "0.74rem",
                            fontWeight: active ? 600 : 400,
                            border: active
                              ? "1.5px solid #c9a84c"
                              : "1.5px solid rgba(201,168,76,0.25)",
                            background: active ? "rgba(201,168,76,0.1)" : "transparent",
                            color: active ? "#c9a84c" : "var(--muted-foreground)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
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
                      alignItems: "baseline",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <label
                      htmlFor="message"
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: focused === "message" ? "#c9a84c" : "var(--muted-foreground)",
                        transition: "color 0.2s",
                      }}
                    >
                      Mensaje
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div
                        style={{
                          height: "3px",
                          width: "50px",
                          borderRadius: "2px",
                          background: "rgba(201,168,76,0.15)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(charCount / 800) * 100}%`,
                            background: charCount > 700 ? "#ef4444" : "#c9a84c",
                            transition: "width 0.2s",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: charCount > 700 ? "#ef4444" : "var(--muted-foreground)",
                        }}
                      >
                        {charCount}/800
                      </span>
                    </div>
                  </div>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      setCharCount(e.target.value.length);
                    }}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="Cuéntanos sobre tu idea, pieza o consulta..."
                    maxLength={800}
                    style={{ ...inputStyle("message"), resize: "none", lineHeight: 1.75 }}
                  />
                </div>

                {/* Notice */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(37,211,102,0.7)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted-foreground)" }}>
                    Al enviar, se abrirá WhatsApp con tu mensaje listo.
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "1rem 1.5rem",
                    borderRadius: "12px",
                    border: "none",
                    background: sending
                      ? "rgba(37,211,102,0.2)"
                      : "linear-gradient(135deg,#128c4a 0%,#25d366 50%,#60e898 100%)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: sending ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    transition: "all 0.3s ease",
                    boxShadow: sending ? "none" : "0 6px 24px rgba(37,211,102,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    if (!sending)
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 10px 32px rgba(37,211,102,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = sending
                      ? "none"
                      : "0 6px 24px rgba(37,211,102,0.35)";
                  }}
                >
                  {sending ? (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Abriendo WhatsApp...
                    </>
                  ) : (
                    <>
                      Enviar por WhatsApp
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
