import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@workspace/api-client-react";

const EMPTY_FORM = { name: "", description: "", price: "", category: "", stock: "", imageUrl: "", active: true };

export default function Productos() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const qc = useQueryClient();

  const { data: products, isLoading } = useListProducts(search ? { search } : {});
  const { mutate: createProduct, isPending: creating } = useCreateProduct({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListProductsQueryKey() }); setDialogOpen(false); setForm(EMPTY_FORM); } },
  });
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListProductsQueryKey() }); setDialogOpen(false); setEditProduct(null); } },
  });
  const { mutate: deleteProduct } = useDeleteProduct({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() }) },
  });

  function openCreate() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description ?? "", price: String(p.price), category: p.category ?? "", stock: p.stock != null ? String(p.stock) : "", imageUrl: p.imageUrl ?? "", active: p.active });
    setDialogOpen(true);
  }

  function submit() {
    const data = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      category: form.category || undefined,
      stock: form.stock ? parseInt(form.stock) : undefined,
      imageUrl: form.imageUrl || undefined,
      active: form.active,
    };
    if (editProduct) {
      updateProduct({ id: editProduct.id, data });
    } else {
      createProduct({ data });
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Catálogo de productos</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{products?.length ?? 0} productos</p>
            </div>
            <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Agregar producto
            </Button>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">Sin productos</p>
              <p className="text-sm mb-4">Agregá tu primer producto para empezar.</p>
              <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground">
                <Plus className="h-4 w-4" /> Agregar producto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-card border rounded-xl p-4 ${p.active ? "border-border" : "border-border opacity-60"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      {p.category && <Badge variant="secondary" className="text-xs mt-1">{p.category}</Badge>}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteProduct({ id: p.id })} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {p.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${Number(p.price).toLocaleString("es-AR")}</span>
                    <div className="flex items-center gap-2">
                      {p.stock != null && <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>}
                      <span className={`text-xs ${p.active ? "text-green-400" : "text-muted-foreground"}`}>
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editProduct ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Milanesa napolitana" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Precio *</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="—" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Ej: Platos principales" />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción del producto..." rows={2} />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))} className="text-muted-foreground hover:text-foreground">
                {form.active ? <ToggleRight className="h-6 w-6 text-primary" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
              <span className="text-sm">{form.active ? "Activo" : "Inactivo"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={submit}
              disabled={!form.name || !form.price || creating || updating}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {creating || updating ? "Guardando..." : editProduct ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
