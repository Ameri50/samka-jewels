// Renders a Yape/Plin-style payment card displaying your official business QR image.

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
  phone = "933709275", // Tu número real de Samka Jewels
  operationCode,
  setOperationCode 
}: Props) {

  const isYape = method === "yape";
  const grad = isYape
    ? "linear-gradient(135deg, #6e2bd9 0%, #4f1bb1 100%)"
    : "linear-gradient(135deg, #00bfd9 0%, #0084c7 100%)";

  // Rutas lógicas directas para que Vite compile siempre en limpio
  const qrImageSrc = isYape 
    ? "/src/assets/qr-yape.jpeg" 
    : "/src/assets/qr-plin.png";

  return (
    <div className="space-y-6">
      {/* Tarjeta con el QR */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-luxe"
        style={{ background: grad }}
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase opacity-80">Pago seguro</p>
              <h3 className="font-display text-3xl mt-1">{isYape ? "Yape" : "Plin"}</h3>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
              S/ {amount.toFixed(2)}
            </div>
          </div>

          {/* Contenedor de la Imagen con detector de errores */}
          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-2xl min-w-60 min-h-60 flex items-center justify-center">
              <img 
                key={method} 
                src={qrImageSrc} 
                alt={`QR Oficial ${method}`} 
                className=" min-w-60 min-h-60 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center p-4 text-xs text-slate-500 max-w-55">
                        <p class="font-bold mb-1 text-amber-600">Falta el QR de ${method === 'yape' ? 'Yape' : 'Plin'}</p>
                        Guarda tu imagen en la carpeta con el nombre exacto: <code class="bg-slate-100 p-0.5 rounded text-[10px] block mt-1 text-slate-700">src/assets/qr-${method === 'yape' ? 'yape.jpeg' : 'plin.png'}</code>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-1 text-center">
            <p className="text-xs opacity-80 tracking-widest uppercase">Número</p>
            <p className="font-display text-2xl tracking-wide">+51 {phone}</p>
            <p className="mt-3 text-xs opacity-80">Referencia de compra</p>
            <p className="font-mono text-sm bg-black/20 py-1 px-3 rounded-full inline-block">{reference}</p>
          </div>

          <p className="mt-6 text-center text-xs opacity-90">
            Escanea el QR con tu app {isYape ? "Yape" : "Plin"} y completa el pago por <b>S/ {amount.toFixed(2)}</b>.
          </p>
        </div>
      </div>

      {/* Cuadro de texto integrado para ingresar el número de operación */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <label className="block text-xs tracking-widest uppercase text-muted-foreground font-medium">
          Número de operación (Yape / Plin)
        </label>
        <input
          type="text"
          placeholder="Ej: 652193"
          value={operationCode}
          onChange={(e) => setOperationCode(e.target.value)}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40 transition font-mono text-lg"
          maxLength={15}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Ingresa el código que aparece en tu constancia de pago para verificar tu pedido más rápido.
        </p>
      </div>
    </div>
  );
}