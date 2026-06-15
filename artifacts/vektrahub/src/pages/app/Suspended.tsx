import { AlertTriangle, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/react";

export default function Suspended() {
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Tu suscripción está vencida</h1>
        <p className="text-muted-foreground mb-8">
          El acceso a tu panel está temporalmente suspendido. Contactanos para reactivar tu cuenta.
        </p>
        <div className="space-y-3">
          <a
            href="https://wa.me/5491100000000?text=Hola%2C%20mi%20cuenta%20está%20suspendida%20y%20quiero%20reactivarla"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="h-4 w-4" />
              Contactar por WhatsApp
            </Button>
          </a>
          <a href="mailto:hola@vektratech.com?subject=Reactivar cuenta">
            <Button variant="outline" className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Enviar email
            </Button>
          </a>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
