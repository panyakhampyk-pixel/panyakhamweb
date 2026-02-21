import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import { Settings, Save, RefreshCcw, LayoutGrid, Hash, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface StatItem {
    number: string;
    label: string;
}

const AdminSettings = () => {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("id", "statistics")
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setStats(data.value);
            } else {
                // Fallback default
                setStats([
                    { number: "500+", label: "รับทุนการศึกษา" },
                    { number: "300+", label: "จบการศึกษา" },
                    { number: "250+", label: "ติดตามมีงานทำ" },
                    { number: "100+", label: "ครั้งที่ช่วยเหลือ" },
                ]);
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "โหลดข้อมูลไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStat = (index: number, field: keyof StatItem, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setStats(newStats);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from("site_settings")
                .upsert({ id: "statistics", value: stats });

            if (error) throw error;
            toast({ title: "บันทึกข้อมูลเรียบร้อย", description: "ข้อมูลสถิติบนหน้าเว็บถูกอัปเดตแล้ว" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "บันทึกไม่สำเร็จ", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground">ตั้งค่าเว็บไซต์</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">General Site Settings</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 gap-2 font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        บันทึกการตั้งค่า
                    </Button>
                </header>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-10">
                        {/* Stats Editor Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <LayoutGrid className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-black uppercase tracking-tight">การจัดการตัวเลขสถิติ (Stats Counter)</h2>
                            </div>

                            {loading ? (
                                <div className="p-20 text-center">
                                    <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-slate-300" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {stats.map((stat, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border">สถิติที่ {idx + 1}</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        value={stat.number}
                                                        onChange={(e) => handleUpdateStat(idx, 'number', e.target.value)}
                                                        placeholder="เช่น 500+"
                                                        className="pl-12 h-12 rounded-xl bg-slate-50/50 border-border focus:ring-slate-900 focus:border-slate-900 font-bold"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        value={stat.label}
                                                        onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                                                        placeholder="เช่น รับทุนการศึกษา"
                                                        className="pl-12 h-12 rounded-xl bg-white border-border focus:ring-slate-900 focus:border-slate-900 font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <Settings className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-900">คำแนะนำ</p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    ค่าตัวเลขที่คุณแก้ไขที่นี่ จะไปแสดงผลในหน้า "เกี่ยวกับ" (About Section) ของเว็บไซต์ทันที โดยไม่ต้องแก้ไขโค้ด สามารถใส่เครื่องหมาย + หรือตัวหนังสือต่อท้ายตัวเลขได้ตามต้องการ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
