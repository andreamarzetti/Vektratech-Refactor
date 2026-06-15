import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendChatMessage, useGetMe } from "@workspace/api-client-react";

const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  restaurante: ["¿Cuál es el plato más vendido?", "¿Qué opciones vegetarianas tienen?", "¿Hacen delivery?", "¿Cuánto cuesta el menú del día?"],
  kiosco: ["¿Cuál es el producto más económico?", "¿Tienen bebidas sin azúcar?", "¿Aceptan tarjeta?", "¿Cuál es el snack más vendido?"],
  dietetica: ["Tengo $15.000, ¿qué me recomendás?", "¿Cuál tiene más proteína?", "¿Tienen productos veganos?", "¿Qué me recomendás para bajar de peso?"],
  ferreteria: ["¿Qué necesito para pintar una habitación?", "¿Tienen caños de PVC?", "¿Cuál es el taladro más vendido?", "¿Hacen envío?"],
  ropa: ["¿Qué talles tienen?", "¿Tienen descuentos?", "¿Cuáles son las novedades?", "¿Aceptan cambios?"],
  distribuidora: ["¿Cuál es el precio por mayor?", "¿Cuánto es el mínimo?", "¿Hacen factura?", "¿Hacen delivery?"],
  otro: ["¿Cuál es el producto más vendido?", "¿Cuál me recomendás?", "¿Cuáles son los precios?", "¿Hacen envío?"],
};

interface Message { role: "user" | "assistant"; content: string; }

export default function AsistenteIA() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetMe();
  const { mutate: sendMessage, isPending } = useSendChatMessage();

  const sector = me?.business?.sector ?? "otro";
  const sectorSuggestions = SECTOR_SUGGESTIONS[sector] ?? SECTOR_SUGGESTIONS.otro;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || isPending) return;
    const userMsg: Message = { role: "user", content: msg };
    const history = messages.slice(-10);
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSuggestions([]);

    sendMessage(
      { data: { message: msg, history } },
      {
        onSuccess: (data) => {
          setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
          if (data.suggestions) setSuggestions(data.suggestions);
        },
        onError: () => {
          setMessages(prev => [...prev, { role: "assistant", content: "Hubo un error. Intentá de nuevo." }]);
        },
      }
    );
  }

  const showSuggestions = messages.length === 0 || suggestions.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-b border-border shrink-0">
          <h1 className="text-2xl font-bold">Asistente IA</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Consultá sobre tu catálogo, recomendaciones y más
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Tu asistente de {me?.business?.name ?? "negocio"}</h2>
              <p className="text-muted-foreground text-sm max-w-sm mb-8">
                Haceme cualquier pregunta sobre tus productos, recomendaciones para clientes o consultas del negocio.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {sectorSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {suggestions.length > 0 && messages.length > 0 && (
            <div className="max-w-2xl mx-auto mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 bg-card border border-border rounded-full text-xs hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-background shrink-0">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Hacé tu consulta..."
              className="text-sm"
              disabled={isPending}
            />
            <Button onClick={() => send()} disabled={!input.trim() || isPending} className="bg-primary text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
