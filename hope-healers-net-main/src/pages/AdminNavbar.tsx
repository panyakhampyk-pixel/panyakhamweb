import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard, Users, Newspaper, BookOpen,
    Heart, Settings, LogOut, Menu, X, Bell, ChevronRight,
    Navigation, Trash2, GripVertical, Plus, Loader2, CheckCircle,
    Link as LinkIcon, Type, GraduationCap, Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

interface NavItem {
    id: string;
    label: string;
    href: string;
    sort_order: number;
}

const menuItems = [
    { label: "ภาพรวม", icon: LayoutDashboard, href: "/admin" },
    { label: "จัดการ Slider", icon: Images, href: "/admin/slider" },
    { label: "จัดการ Navbar", icon: Navigation, href: "/admin/navbar" },
    { label: "จัดการผู้ใช้", icon: Users, href: "/admin/users" },
    { label: "จัดการข่าวสาร", icon: Newspaper, href: "/admin/news" },
    { label: "จัดการโครงการ", icon: BookOpen, href: "/admin/projects" },
    { label: "การบริจาค", icon: Heart, href: "/admin/donations" },
    { label: "ทุนการศึกษา", icon: GraduationCap, href: "/admin/scholarships" },
    { label: "ตั้งค่า", icon: Settings, href: "/admin/settings" },
];

const AdminNavbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [items, setItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [newLabel, setNewLabel] = useState("");
    const [newHref, setNewHref] = useState("");

    const fetchItems = async () => {
        const { data } = await supabase
            .from("navbar_items")
            .select("*")
            .order("sort_order", { ascending: true });
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleAddItem = async () => {
        if (!newLabel || !newHref) return;
        setSaving(true);
        setError("");

        const { error: dbError } = await supabase.from("navbar_items").insert({
            label: newLabel,
            href: newHref,
            sort_order: items.length + 1,
        });

        if (dbError) {
            setError("บันทึกไม่สำเร็จ: " + dbError.message);
        } else {
            setSuccess("เพิ่มเรียบร้อย!");
            setNewLabel("");
            setNewHref("");
            fetchItems();
            setTimeout(() => setSuccess(""), 3000);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ลบเมนูนี้ใช่ไหม?")) return;
        await supabase.from("navbar_items").delete().eq("id", id);
        fetchItems();
    };

    const handleMoveUp = async (idx: number) => {
        if (idx === 0) return;
        const updated = [...items];
        [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
        setItems(updated);
        await Promise.all([
            supabase.from("navbar_items").update({ sort_order: idx }).eq("id", updated[idx - 1].id),
            supabase.from("navbar_items").update({ sort_order: idx + 1 }).eq("id", updated[idx].id),
        ]);
    };

    const handleMoveDown = async (idx: number) => {
        if (idx === items.length - 1) return;
        const updated = [...items];
        [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
        setItems(updated);
        await Promise.all([
            supabase.from("navbar_items").update({ sort_order: idx + 1 }).eq("id", updated[idx].id),
            supabase.from("navbar_items").update({ sort_order: idx + 2 }).eq("id", updated[idx + 1].id),
        ]);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background flex">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <Logo size="sm" />
                    <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.href === "/admin/navbar" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
                            <item.icon className="w-4 h-4" />
                            <span className="flex-1">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive"><LogOut className="w-4 h-4 mr-2" /> ออกจากระบบ</Button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold flex items-center gap-2"><Navigation className="w-5 h-5 text-primary" /> จัดการเมนู (Navbar)</h1>
                    </div>
                </header>

                <main className="p-6 overflow-auto bg-accent/10 min-h-full">
                    <div className="max-w-4xl mx-auto space-y-6">

                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> เพิ่มเมนูใหม่</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label>ชื่อเมนู</Label>
                                    <Input placeholder="เช่น กิจกรรม" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>ลิงก์ (HREF)</Label>
                                    <Input placeholder="เช่น #events หรือ /activity" value={newHref} onChange={(e) => setNewHref(e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleAddItem} disabled={saving || !newLabel || !newHref} className="w-full bg-primary text-white">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                เพิ่มเข้า Navbar
                            </Button>
                            {success && <p className="mt-3 text-emerald-600 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</p>}
                            {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-sm">
                            <div className="p-5 border-b border-border font-semibold">รายการเมนูปัจจุบัน</div>
                            <div className="p-2">
                                {loading ? <div className="p-8 text-center text-muted-foreground">กำลังโหลด...</div> : (
                                    <div className="space-y-1">
                                        {items.map((item, idx) => (
                                            <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-accent/50 rounded-xl transition-all border border-transparent">
                                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm">{item.label}</div>
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
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminNavbar;
