import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Samka" },
      {
        name: "description",
        content: "Escríbenos. Atención personalizada para cada cliente.",
      },
      { property: "og:title", content: "Contacto — Samka" },
      {
        property: "og:description",
        content: "Hablemos de tu próxima pieza Samka.",
      },
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

// ── Reemplaza con el número real de Samka ──────────────────────────────────
const WHATSAPP_NUMBER = "51999999999";

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
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

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      setCharCount(0);
    }, 3000);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    border: focused === name ? "1.5px solid #c9a84c" : "1.5px solid rgba(255,255,255,0.08)",
    background: focused === name ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.03)",
    color: "var(--foreground)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    boxShadow:
      focused === name
        ? "0 0 0 4px rgba(201,168,76,0.1),inset 0 1px 0 rgba(201,168,76,0.1)"
        : "inset 0 1px 0 rgba(255,255,255,0.05)",
    fontFamily: "inherit",
  });

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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,2rem)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: "0.75rem",
            }}
          >
            Escríbenos
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem,5vw,3rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Tu historia <em style={{ fontStyle: "italic", color: "#c9a84c" }}>nos inspira</em>
          </h2>
        </div>

        {/* Form card */}
        <div
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.02)",
            border: "1.5px solid rgba(201,168,76,0.15)",
            borderRadius: "24px",
            padding: "clamp(1.75rem,4vw,2.75rem)",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
          }}
        >
          {corners.map((corner, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                opacity: 0.5,
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
                minHeight: "320px",
                gap: "1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "2px solid #25d366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <svg
                  width="28"
                  height="28"
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
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "0.4rem",
                  }}
                >
                  ¡Abriendo WhatsApp!
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Tu mensaje está listo para enviar 💛
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Name + Email */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    id: "name",
                    label: "Nombre",
                    type: "text",
                    placeholder: "Tu nombre",
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "tu@email.com",
                  },
                ].map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      style={{
                        display: "block",
                        fontSize: "0.6rem",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: focused === f.id ? "#c9a84c" : "var(--muted-foreground)",
                        marginBottom: "0.5rem",
                        transition: "color 0.25s",
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
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Asunto
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {SUBJECTS.map((s) => {
                    const active = form.subject === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, subject: s })}
                        style={{
                          padding: "0.45rem 0.95rem",
                          borderRadius: "50px",
                          fontSize: "0.76rem",
                          fontWeight: active ? 600 : 400,
                          border: active
                            ? "1.5px solid #c9a84c"
                            : "1.5px solid rgba(201,168,76,0.2)",
                          background: active ? "rgba(201,168,76,0.12)" : "transparent",
                          color: active ? "#c9a84c" : "var(--muted-foreground)",
                          cursor: "pointer",
                          transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                          transform: active ? "scale(1.03)" : "scale(1)",
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
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    htmlFor="message"
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: focused === "message" ? "#c9a84c" : "var(--muted-foreground)",
                      transition: "color 0.25s",
                    }}
                  >
                    Mensaje
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <div
                      style={{
                        height: "3px",
                        width: "60px",
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
                          transition: "width 0.2s,background 0.2s",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: charCount > 700 ? "#ef4444" : "var(--muted-foreground)",
                        transition: "color 0.2s",
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
                  style={{
                    ...inputStyle("message"),
                    resize: "none",
                    lineHeight: 1.8,
                  }}
                />
              </div>

              {/* WhatsApp notice */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(37,211,102,0.7)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--muted-foreground)",
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
                  padding: "1.1rem 1.5rem",
                  borderRadius: "14px",
                  border: "none",
                  background: sending
                    ? "rgba(37,211,102,0.2)"
                    : "linear-gradient(135deg,#128c4a 0%,#25d366 45%,#60e898 70%,#25d366 100%)",
                  backgroundSize: "200% auto",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: sending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.65rem",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: sending
                    ? "none"
                    : "0 8px 32px rgba(37,211,102,0.35),inset 0 1px 0 rgba(255,255,255,0.2)",
                  animation: sending ? "none" : "shimmer 3s linear infinite",
                }}
                onMouseDown={(e) => {
                  if (!sending) (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                {sending ? (
                  <>
                    <svg
                      width="16"
                      height="16"
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
                      width="16"
                      height="16"
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 480px) {
          .grid-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
