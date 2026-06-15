import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, MapPin, CreditCard, User, ClipboardList, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CartItem = { product: { id: number; name: string; price: number }; quantity: number };
type StoreInfo = { name: string; sector: string; whatsappNumber: string | null; shippingCost: number | null; cashDiscount: number | null; bankAlias: string | null; bankHolder: string | null; hasMpEnabled: boolean };

type OrderResult = { id: number; customerName: string; total: number; ownerWhatsappUrl: string | null };

const STEPS = [
  { label: "Datos", icon: User },
  { label: "Entrega", icon: MapPin },
  { label: "Pago", icon: CreditCard },
  { label: "Resumen", icon: ClipboardList },
];

export default function Checkout({ cart, store, slug, onClose, onSuccess }: {
  cart: CartItem[];
  store: StoreInfo;
  slug: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);

  const [personalData, setPersonalData] = useState({ name: "", phone: "", email: "", notes: "" });
  const [deliveryType, setDeliveryType] = useState<"local" | "pickup" | "delivery">("pickup");
  const [address, setAddress] = useState({ street: "", number: "", floor: "", apt: "", city: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "mercadopago" | "debit" | "credit">("cash");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{ valid: boolean; message: string; discountAmount?: number; type?: string; value?: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ razonSocial: "", cuit: "", address: "" });

  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discount = couponResult?.valid ? (couponResult.discountAmount ?? 0) : 0;
  const cashDiscountAmount = paymentMethod === "cash" && store.cashDiscount ? Math.round(subtotal * store.cashDiscount / 100) : 0;
  const totalDiscount = discount + cashDiscountAmount;
  const shipping = deliveryType === "delivery" && store.shippingCost ? store.shippingCost : 0;
  const total = subtotal - totalDiscount + shipping;

  async function validateCoupon() {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const r = await fetch(`/api/store/${slug}/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await r.json();
      setCouponResult(data);
    } catch {
      setCouponResult({ valid: false, message: "Error al validar el cupón." });
    } finally {
      setValidatingCoupon(false);
    }
  }

  async function submitOrder() {
    setSubmitting(true);
    try {
      const r = await fetch(`/api/store/${slug}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: personalData.name,
          customerPhone: personalData.phone,
          customerEmail: personalData.email || undefined,
          items: cart.map((i) => ({ productId: i.product.id, productName: i.product.name, quantity: i.quantity, unitPrice: i.product.price })),
          deliveryType,
          deliveryAddress: deliveryType === "delivery" ? address : undefined,
          paymentMethod,
          couponCode: couponResult?.valid ? couponCode.toUpperCase() : undefined,
          discountAmount: totalDiscount > 0 ? totalDiscount : undefined,
          shippingAmount: shipping > 0 ? shipping : undefined,
          needsInvoice,
          invoiceData: needsInvoice ? invoiceData : undefined,
          notes: personalData.notes || undefined,
        }),
      });
      if (!r.ok) throw new Error("Error al crear pedido");
      const data: OrderResult = await r.json();
      setResult(data);
    } catch {
      alert("Hubo un error al confirmar el pedido. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function canAdvance(): boolean {
    if (step === 0) return !!personalData.name.trim() && !!personalData.phone.trim();
    if (step === 1) {
      if (deliveryType === "delivery") return !!address.street && !!address.number && !!address.city;
      return true;
    }
    return true;
  }

  if (result) {
    const customerWA = store.whatsappNumber
      ? `https://wa.me/${store.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola! Soy ${result.customerName} y acabo de hacer el pedido #${result.id} por $${result.total.toLocaleString("es-AR")}. ¿Me podés confirmar?`)}`
      : null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl w-full max-w-md p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pedido confirmado</h2>
          <p className="text-muted-foreground mb-1">Pedido #{result.id}</p>
          <p className="text-3xl font-bold text-primary mb-6">${result.total.toLocaleString("es-AR")}</p>

          {paymentMethod === "transfer" && store.bankAlias && (
            <div className="bg-muted/40 rounded-xl p-4 mb-5 text-left">
              <p className="text-xs text-muted-foreground mb-1">Datos para transferir</p>
              <p className="font-semibold">{store.bankAlias}</p>
              {store.bankHolder && <p className="text-sm text-muted-foreground">{store.bankHolder}</p>}
            </div>
          )}

          <div className="space-y-3">
            {customerWA && (
              <a href={customerWA} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            )}
            {result.ownerWhatsappUrl && (
              <a href={result.ownerWhatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                Notificar al negocio por WhatsApp
              </a>
            )}
            <Button variant="outline" className="w-full" onClick={onSuccess}>Volver a la tienda</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 className="font-bold text-lg">Finalizar pedido</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/20 text-primary border-2 border-primary" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label className="text-sm mb-1.5 block">Nombre y apellido *</Label>
                  <Input value={personalData.name} onChange={(e) => setPersonalData((p) => ({ ...p, name: e.target.value }))} placeholder="Juan Pérez" />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Teléfono *</Label>
                  <Input value={personalData.phone} onChange={(e) => setPersonalData((p) => ({ ...p, phone: e.target.value }))} placeholder="+54 11 1234-5678" type="tel" />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Email (opcional)</Label>
                  <Input value={personalData.email} onChange={(e) => setPersonalData((p) => ({ ...p, email: e.target.value }))} placeholder="correo@ejemplo.com" type="email" />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Observaciones</Label>
                  <Input value={personalData.notes} onChange={(e) => setPersonalData((p) => ({ ...p, notes: e.target.value }))} placeholder="Sin picante, sin cebolla..." />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "pickup", label: "Retiro en el local", desc: "Sin costo" },
                    { value: "local", label: "Consumo en el local", desc: "Para comer en el lugar" },
                    { value: "delivery", label: "Envío a domicilio", desc: store.shippingCost ? `+$${store.shippingCost.toLocaleString("es-AR")}` : "Consultar costo" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDeliveryType(opt.value as typeof deliveryType)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${deliveryType === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-border/60"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${deliveryType === opt.value ? "border-primary" : "border-muted-foreground"}`}>
                        {deliveryType === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {deliveryType === "delivery" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Label className="text-xs mb-1 block">Calle *</Label>
                        <Input value={address.street} onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))} placeholder="Av. Corrientes" />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Número *</Label>
                        <Input value={address.number} onChange={(e) => setAddress((a) => ({ ...a, number: e.target.value }))} placeholder="1234" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Piso</Label>
                        <Input value={address.floor} onChange={(e) => setAddress((a) => ({ ...a, floor: e.target.value }))} placeholder="3" />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Depto</Label>
                        <Input value={address.apt} onChange={(e) => setAddress((a) => ({ ...a, apt: e.target.value }))} placeholder="A" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Localidad *</Label>
                        <Input value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} placeholder="Buenos Aires" />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Código postal</Label>
                        <Input value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} placeholder="1414" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {([
                    { value: "cash", label: "Efectivo", desc: store.cashDiscount ? `${store.cashDiscount}% de descuento` : "Descuento disponible" },
                    { value: "transfer", label: "Transferencia bancaria", desc: store.bankAlias ?? "Te enviamos los datos" },
                    ...(store.hasMpEnabled ? [{ value: "mercadopago", label: "Mercado Pago", desc: "Pago online seguro" }] : []),
                    { value: "debit", label: "Tarjeta de débito", desc: "Visa, Mastercard, Maestro" },
                    { value: "credit", label: "Tarjeta de crédito", desc: "Hasta 12 cuotas" },
                  ] as { value: string; label: string; desc: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPaymentMethod(opt.value as typeof paymentMethod)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${paymentMethod === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-border/60"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${paymentMethod === opt.value ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <Label className="text-sm mb-1.5 block">Cupón de descuento</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                      placeholder="BIENVENIDO10"
                      className="uppercase"
                    />
                    <Button variant="outline" onClick={validateCoupon} disabled={validatingCoupon || !couponCode.trim()} className="shrink-0">
                      {validatingCoupon ? "..." : "Aplicar"}
                    </Button>
                  </div>
                  {couponResult && (
                    <p className={`text-xs mt-1.5 ${couponResult.valid ? "text-primary" : "text-destructive"}`}>
                      {couponResult.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="invoice" checked={needsInvoice} onChange={(e) => setNeedsInvoice(e.target.checked)} className="accent-primary" />
                  <label htmlFor="invoice" className="text-sm cursor-pointer">Necesito factura</label>
                </div>

                {needsInvoice && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Razón social</Label>
                      <Input value={invoiceData.razonSocial} onChange={(e) => setInvoiceData((d) => ({ ...d, razonSocial: e.target.value }))} placeholder="Mi Empresa S.A." />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">CUIT</Label>
                      <Input value={invoiceData.cuit} onChange={(e) => setInvoiceData((d) => ({ ...d, cuit: e.target.value }))} placeholder="20-12345678-9" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Dirección fiscal</Label>
                      <Input value={invoiceData.address} onChange={(e) => setInvoiceData((d) => ({ ...d, address: e.target.value }))} placeholder="Av. Corrientes 1234, CABA" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Productos</p>
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.quantity}x {item.product.name}</span>
                      <span className="font-medium">${(item.product.price * item.quantity).toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString("es-AR")}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Descuento</span>
                      <span>-${totalDiscount.toLocaleString("es-AR")}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>+${shipping.toLocaleString("es-AR")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-primary">${total.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente</span>
                    <span>{personalData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span>{personalData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega</span>
                    <span>{deliveryType === "delivery" ? "Envío a domicilio" : deliveryType === "local" ? "En el local" : "Retiro"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago</span>
                    <span>{{ cash: "Efectivo", transfer: "Transferencia", mercadopago: "Mercado Pago", debit: "Débito", credit: "Crédito" }[paymentMethod]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 p-5 border-t border-border shrink-0">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Atrás
            </Button>
          )}
          {step < 3 ? (
            <Button className="flex-1 bg-primary text-primary-foreground gap-1" onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
              Continuar <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="flex-1 bg-primary text-primary-foreground gap-1" onClick={submitOrder} disabled={submitting}>
              {submitting ? "Confirmando..." : "Confirmar pedido"}
              {!submitting && <Check className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
