import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">404</h1>
        <p className="text-lg font-semibold mb-2">Página no encontrada</p>
        <p className="text-sm text-muted-foreground mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
