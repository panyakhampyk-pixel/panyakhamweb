import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Menu, Navigation, Trash2, GripVertical, Plus, Loader2, CheckCircle,
    Type, Link as LinkIcon, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminSidebar from "@/components/AdminSidebar";

interface SidebarItem {
    id: string;
    label: string;
    href: string;
    icon_name: string;
    sort_order: number;
}

const AdminSidebarConfig = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [items, setItems] = useState<SidebarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");

    const [newLabel, setNewLabel] = useState("");
    const [newHref, setNewHref] = useState("");
    const [newIcon, setNewIcon] = useState("LayoutDashboard");

    const fetchItems = async () => {
        const { data } = await supabase
            .from("admin_sidebar_items")
            .select("*")
            .order("sort_order", { ascending: true });
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleAddItem = async () => {
        if (!newLabel || !newHref) return;
        setSaving(true);
        await supabase.from("admin_sidebar_items").insert({
            label: newLabel,
            href: newHref,
            icon_name: newIcon,
            sort_order: items.length + 1,
        });
        setSuccess("เพิ่มเมนูแล้ว!");
        setNewLabel("");
        setNewHref("");
        fetchItems();
        setSaving(false);
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ลบเมนูแอดมินนี้ใช่ไหม? (ระวัง: หากลบคุณจะไม่เห็นเมนูนี้ในแถบข้าง)")) return;
        await supabase.from("admin_sidebar_items").delete().eq("id", id);
        fetchItems();
    };

    const handleMoveUp = async (idx: number) => {
        if (idx === 0) return;
        const updated = [...items];
        [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
        setItems(updated);
        await Promise.all([
            supabase.from("admin_sidebar_items").update({ sort_order: idx }).eq("id", updated[idx - 1].id),
            supabase.from("admin_sidebar_items").update({ sort_order: idx + 1 }).eq("id", updated[idx].id),
        ]);
    };

    const handleMoveDown = async (idx: number) => {
        if (idx === items.length - 1) return;
        const updated = [...items];
        [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
        setItems(updated);
        await Promise.all([
            supabase.from("admin_sidebar_items").update({ sort_order: idx + 1 }).eq("id", updated[idx].id),
            supabase.from("admin_sidebar_items").update({ sort_order: idx + 2 }).eq("id", updated[idx + 1].id),
        ]);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                            <Star className="w-5 h-5 text-primary" /> จัดการแถบข้างแอดมิน (Admin Sidebar)
                        </h1>
                    </div>
                </header>

                <main className="p-6 overflow-auto bg-accent/10 min-h-full">
                    <div className="max-w-4xl mx-auto space-y-6">

                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> เพิ่มเมนูควบคุมใหม่</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label>ชื่อเมนู</Label>
                                    <Input placeholder="เช่น จัดการสินค้า" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>ลิงก์แอดมิน</Label>
                                    <Input placeholder="/admin/xxxx" value={newHref} onChange={(e) => setNewHref(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>ไอคอน (Lucide Name)</Label>
                                    <Input placeholder="เช่น Package, Settings" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleAddItem} disabled={saving || !newLabel || !newHref} className="w-full bg-primary text-white">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                เพิ่มเมนูแอดมิน
                            </Button>
                            {success && <p className="mt-3 text-emerald-600 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</p>}
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-sm">
                            <div className="p-5 border-b border-border font-semibold">รายการเมนูแอดมินปัจจุบัน</div>
                            <div className="p-2">
                                {loading ? <div className="p-8 text-center text-muted-foreground">กำลังโหลด...</div> : (
                                    <div className="space-y-1">
                                        {items.map((item, idx) => (
                                            <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-accent/50 rounded-xl transition-all border border-transparent">
                                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm flex items-center gap-2">
                                                        <span className="text-primary">{item.icon_name}</span> - {item.label}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {item.href}</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMoveUp(idx)} disabled={idx === 0}>▲</Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMoveDown(idx)} disabled={idx === items.length - 1}>▼</Button>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-amber-50 rounded-b-2xl border-t border-amber-100 italic text-[10px] text-amber-700">
                                * หมายเหตุ: ชื่อภาษาอังกฤษของไอคอน ดูได้จากเว็บ lucide.dev ครับ
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSidebarConfig;
