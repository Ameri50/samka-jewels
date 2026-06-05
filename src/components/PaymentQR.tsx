import { useState } from "react";

const qrYape = "/assets/qr-yape.jpeg";
const qrPlin = "/assets/qr-yape.jpeg";

type Props = {
  method: "yape" | "plin";
  amount: number;
  reference: string;
  phone?: string;
  operationCode: string;
  setOperationCode: (code: string) => void;
};

export function PaymentQR({
  method,
  amount,
  reference,
  phone = "933709275",
  operationCode,
  setOperationCode,
}: Props) {
  const [imgError, setImgError] = useState(false);

  const isYape = method === "yape";

  const gradient = isYape
    ? "linear-gradient(135deg, #6e2bd9 0%, #4f1bb1 100%)"
    : "linear-gradient(135deg, #00bfd9 0%, #0084c7 100%)";

  const qrSrc = isYape ? qrYape : qrPlin;
  const methodLabel = isYape ? "Yape" : "Plin";

  return (
    <div className="space-y-6">
      {/* Tarjeta con el QR */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl"
        style={{ background: gradient }}
      >
        {/* Decoración de fondo */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase opacity-80">Pago seguro</p>
              <h3 className="text-3xl font-bold mt-1">{methodLabel}</h3>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm border border-white/20">
              S/ {amount.toFixed(2)}
            </div>
          </div>

          {/* QR Image */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-2xl w-60 h-60 flex items-center justify-center">
              {imgError ? (
                <div className="text-center p-2 text-xs text-slate-500">
                  <p className="font-bold mb-1 text-amber-600">Falta el QR de {methodLabel}</p>
                  <p className="text-slate-400 mt-1">Archivo esperado:</p>
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] block mt-1 text-slate-700 break-all">
                    public/assets/qr-{isYape ? "yape.jpeg" : "plin.png"}
                  </code>
                </div>
              ) : (
                <img
                  key={method}
                  src={qrSrc}
                  alt={`QR Oficial ${methodLabel}`}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          {/* Datos */}
          <div className="mt-6 space-y-1 text-center">
            <p className="text-xs opacity-80 tracking-widest uppercase">Número</p>
            <p className="text-2xl font-bold tracking-wide">+51 {phone}</p>
            <p className="mt-3 text-xs opacity-80">Referencia de compra</p>
            <p className="font-mono text-sm bg-black/20 py-1 px-3 rounded-full inline-block">
              {reference}
            </p>
          </div>

          <p className="mt-6 text-center text-xs opacity-90">
            Escanea el QR con tu app {methodLabel} y completa el pago por{" "}
            <b>S/ {amount.toFixed(2)}</b>.
          </p>
        </div>
      </div>

      {/* Campo número de operación */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
        <label className="block text-xs tracking-widest uppercase text-gray-500 font-medium">
          Número de operación ({methodLabel})
        </label>
        <input
          type="text"
          placeholder="Ej: 652193"
          value={operationCode}
          onChange={(e) => setOperationCode(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300 transition font-mono text-lg"
          maxLength={15}
        />
        <p className="mt-2 text-xs text-gray-400">
          Ingresa el código que aparece en tu constancia de pago para verificar tu pedido más
          rápido.
        </p>
      </div>
    </div>
  );
}
