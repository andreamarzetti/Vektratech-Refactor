import { useState } from "react";
import { Search, Plus, Users, Pencil, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useListCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  getListCustomersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Customer } from "@workspace/api-client-react";

const EMPTY_FORM = { name: "", email: "", phone: "" };

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const qc = useQueryClient();

  const { data: customers, isLoading } = useListCustomers(search ? { search } : {});
  const { mutate: createCustomer, isPending: creating } = useCreateCustomer({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }); setDialogOpen(false); setForm(EMPTY_FORM); } },
  });
  const { mutate: updateCustomer, isPending: updating } = useUpdateCustomer({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }); setDialogOpen(false); setEditCustomer(null); } },
  });
  const { mutate: deleteCustomer } = useDeleteCustomer({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }) },
  });

  function openCreate() { setEditCustomer(null); setForm(EMPTY_FORM); setDialogOpen(true); }
  function openEdit(c: Customer) { setEditCustomer(c); setForm({ name: c.name, email: c.email ?? "", phone: c.phone ?? "" }); setDialogOpen(true); }
  function submit() {
    const data = { name: form.name, email: form.email || undefined, phone: form.phone || undefined };
    if (editCustomer) updateCustomer({ id: editCustomer.id, data });
    else createCustomer({ data });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Clientes</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{customers?.length ?? 0} clientes</p>
            </div>
            <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Agregar cliente
            </Button>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clientes..." className="pl-9" />
          </div>

          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : customers?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">Sin clientes</p>
              <p className="text-sm mb-4">Agregá tus clientes para hacer seguimiento.</p>
              <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground"><Plus className="h-4 w-4" /> Agregar cliente</Button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Cliente</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">Contacto</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Pedidos</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Total gastado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {customers?.map((c, i) => (
                    <tr key={c.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 1 ? "bg-muted/5" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                            {c.name[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-xs text-muted-foreground">
                          {c.email && <p>{c.email}</p>}
                          {c.phone && <p>{c.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">{c.totalOrders}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-primary">${Number(c.totalSpent).toLocaleString("es-AR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => deleteCustomer({ id: c.id })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader><DialogTitle>{editCustomer ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="cliente@email.com" /></div>
            <div className="space-y-1.5"><Label>Teléfono</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+54 11 0000-0000" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={!form.name || creating || updating} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {creating || updating ? "Guardando..." : editCustomer ? "Guardar" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
