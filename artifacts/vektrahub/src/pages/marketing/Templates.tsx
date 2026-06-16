import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Check, Star, ShoppingCart, Bot, BarChart3, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const TEMPLATES = [
  {
    id: "restaurante",
    name: "Restaurante Premium",
    sector: "Restaurantes y hamburgueserías",
    icon: "🍔",
    color: "from-orange-400 to-red-500",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    tagColor: "bg-orange-100 text-orange-700",
    bannerImg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&auto=format",
    features: ["Menú por categorías", "Combos y promos", "Pedidos por WhatsApp", "IA que recomienda platos"],
    rating: 4.9,
    reviews: 234,
    desc: "Perfecta para hamburgueserías, pizzerías, sushi y cualquier delivery. Con categorías de menú y combos.",
  },
  {
    id: "dietetica",
    name: "Dietética Premium",
    sector: "Dietéticas y nutrición",
    icon: "🥗",
    color: "from-emerald-400 to-green-600",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    tagColor: "bg-emerald-100 text-emerald-700",
    bannerImg: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop&auto=format",
    features: ["Filtros nutricionales", "Suplementos y orgánicos", "IA experta en nutrición", "Recomendaciones de dieta"],
    rating: 4.8,
    reviews: 187,
    desc: "Ideal para dietéticas, suplementos deportivos y productos orgánicos. Con filtros por categoría y nutrientes.",
  },
  {
    id: "ferreteria",
    name: "Ferretería Pro",
    sector: "Ferreterías y construcción",
    icon: "🔧",
    color: "from-slate-500 to-zinc-700",
    bgLight: "bg-slate-50",
    borderColor: "border-slate-200",
    tagColor: "bg-slate-100 text-slate-700",
    bannerImg: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=800&h=400&fit=crop&auto=format",
    features: ["Catálogo técnico", "Pedidos por mayor", "Stock en tiempo real", "IA para consultas técnicas"],
    rating: 4.7,
    reviews: 143,
    desc: "Para ferreterías, materiales de construcción y herramientas. Catálogo técnico con stock visible.",
  },
  {
    id: "ropa",
    name: "Tienda de Ropa",
    sector: "Indumentaria y moda",
    icon: "👕",
    color: "from-violet-500 to-purple-700",
    bgLight: "bg-violet-50",
    borderColor: "border-violet-200",
    tagColor: "bg-violet-100 text-violet-700",
    bannerImg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop&auto=format",
    features: ["Fotos de producto premium", "Filtros por talle y color", "Lookbook y novedades", "IA de asesoría de moda"],
    rating: 4.9,
    reviews: 312,
    desc: "Diseño minimalista para tiendas de ropa, calzado y accesorios. Con galería de fotos y filtros por talle.",
  },
  {
    id: "kiosco",
    name: "Kiosco Digital",
    sector: "Kioscos y almacenes",
    icon: "🍭",
    color: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
    bannerImg: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format",
    features: ["Pedidos rápidos", "Precios por unidad y pack", "Promos y combos", "Entrega express"],
    rating: 4.6,
    reviews: 98,
    desc: "Para kioscos, almacenes y negocios de rápida rotación. Enfocada en velocidad y pedidos express.",
  },
  {
    id: "distribuidora",
    name: "Distribuidora B2B",
    sector: "Distribuidoras y mayoristas",
    icon: "📦",
    color: "from-blue-500 to-indigo-700",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    tagColor: "bg-blue-100 text-blue-700",
    bannerImg: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&h=400&fit=crop&auto=format",
    features: ["Precios mayoristas", "Pedidos mínimos", "Facturación automática", "IA para cotizaciones"],
    rating: 4.8,
    reviews: 76,
    desc: "Para distribuidoras y mayoristas. Con precios por volumen, pedidos mínimos y facturación integrada.",
  },
];

const PLATFORM_FEATURES = [
  { icon: ShoppingCart, label: "Carrito y checkout completo" },
  { icon: Bot, label: "IA Vendedora incluida" },
  { icon: MessageCircle, label: "Notificaciones WhatsApp" },
  { icon: BarChart3, label: "Analytics en tiempo real" },
];

export default function Templates() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HEADER */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Plantillas</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
              Tu tienda lista desde el día uno
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Elegí la plantilla de tu rubro y empezá con productos, categorías y diseño optimizados
              para tu industria. Sin conocimientos técnicos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              {PLATFORM_FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
                  <f.icon className="h-3.5 w-3.5 text-blue-600" />
                  {f.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEMPLATES GRID */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.07 }}
                className={`bg-white border-2 ${t.borderColor} rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Preview image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={t.bannerImg}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-60`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl drop-shadow-xl">{t.icon}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.tagColor}`}>
                      {t.sector}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">{t.name}</h3>
                    <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700">{t.rating}</span>
                      <span className="text-slate-400">({t.reviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{t.desc}</p>

                  <div className="space-y-1.5 mb-5">
                    {t.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/demos/${t.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                        Ver demo
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="flex-1">
                      <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold gap-1">
                        Usar esta
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-16 text-center bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-12"
          >
            <h2 className="text-2xl font-extrabold text-white mb-3">
              ¿No encontrás tu rubro?
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto">
              Podés crear tu tienda desde cero y personalizar todo a tu medida. O escribinos y lo armamos juntos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-7">
                  Crear tienda personalizada
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="border-blue-400 text-white hover:bg-blue-500 hover:text-white">
                  Hablar con un asesor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
