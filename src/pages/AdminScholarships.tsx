import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    GraduationCap, Menu, Search, Filter,
    Trash2, Eye, CheckCircle2, XCircle,
    MoreHorizontal, Download, Phone, Mail, MapPin,
    Loader2, ChevronRight, FileText, CheckCircle, Printer,
    School, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminSidebar from "@/components/AdminSidebar";

interface Application {
    id: string;
    full_name: string;
    nickname: string;
    phone: string;
    email: string;
    school_name: string;
    grade_level: string;
    status: string;
    created_at: string;
    address: string;
    gpa: string;
    family_income: string;
    reason: string;
    gender: string;
    birth_date: string;
}

const AdminScholarships = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const fetchApps = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("scholarship_applications")
            .select("*")
            .order("created_at", { ascending: false });
        setApps(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchApps(); }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from("scholarship_applications").update({ status: newStatus }).eq("id", id);
        if (selectedApp?.id === id) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }
        fetchApps();
    };

    const deleteApp = async (id: string) => {
        if (!confirm("ลบใบสมัครนี้ถาวรใช่หรือไม่?")) return;
        await supabase.from("scholarship_applications").delete().eq("id", id);
        setSelectedApp(null);
        fetchApps();
    };

    const filteredApps = apps.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.school_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Export Excel (CSV Mode) ---
    const exportToExcel = () => {
        if (apps.length === 0) return;

        // Header for CSV
        const headers = ["วันที่สมัคร", "ชื่อ-นามสกุล", "ชื่อเล่น", "เพศ", "เบอร์โทร", "อีเมล", "โรงเรียน", "เกรดเฉลี่ย", "รายได้", "สถานะ"];

        // Data rows
        const rows = apps.map(app => [
            new Date(app.created_at).toLocaleDateString('th-TH'),
            app.full_name,
            app.nickname,
            app.gender,
            app.phone,
            app.email || "-",
            app.school_name,
            app.gpa,
            app.family_income,
            app.status
        ]);

        // Construct CSV content (using \uFEFF for Excel Thai encoding)
        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `scholarship_applications_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Download as PDF (Print Mode) ---
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background flex font-sans">
            {/* CSS สำหรับงานพิมพ์ (จะทำงานเมื่อกด Print เท่านั้น) */}
            <style>
                {`
          @media print {
            @page { size: A4; margin: 20mm; }
            body { background: white !important; }
            aside, header, button, .print-hidden, [role="complementary"] {
              display: none !important;
            }
            .flex-1 { margin-left: 0 !important; padding: 0 !important; display: block !important; }
            .bg-accent\\/5 { background: transparent !important; }
            .grid { display: block !important; }
            .bg-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
            .print-document {
              display: block !important;
              width: 100% !important;
              position: static !important;
              visibility: visible !important;
            }
            .max-w-6xl { max-width: 100% !important; margin: 0 !important; }
          }
        `}
            </style>

            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 print:m-0 print:p-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30 print:hidden">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" /> จัดการนักเรียนทุน
                        </h1>
                    </div>
                </header>

                <main className="p-6 bg-accent/5 flex-1 overflow-auto print:bg-white print:p-0">
                    <div className="max-w-6xl mx-auto space-y-6 print:max-w-none">

                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center print:hidden">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="ค้นหาชื่อ หรือ โรงเรียน..."
                                    className="pl-10 h-11 rounded-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={exportToExcel} className="rounded-xl h-11 font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Download className="w-4 h-4 mr-2" /> ส่งออก Excel
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
                            {/* List of Applications (Hidden on print) */}
                            <div className="lg:col-span-1 space-y-3 bg-card border border-border rounded-3xl p-4 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar print:hidden">
                                <h3 className="font-bold px-2 py-2 text-sm text-muted-foreground uppercase tracking-wider">รายการใบสมัครใหม่</h3>
                                {loading ? (
                                    <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
                                ) : filteredApps.length === 0 ? (
                                    <div className="py-20 text-center text-muted-foreground text-sm">ไม่พบข้อมูล</div>
                                ) : filteredApps.map(app => (
                                    <div
                                        key={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${selectedApp?.id === app.id ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm">{app.full_name}</h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${app.status === 'รอดำเนินการ' ? 'bg-amber-100 text-amber-700' :
                                                app.status === 'อนุมัติ' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground truncate">{app.school_name}</p>
                                        <div className="flex justify-between items-center mt-3 text-[10px] text-muted-foreground">
                                            <span>{new Date(app.created_at).toLocaleDateString('th-TH')}</span>
                                            <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Details View / Print View */}
                            <div className="lg:col-span-2 print:w-full">
                                {selectedApp ? (
                                    <div className="print-document bg-card border border-border rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 print:shadow-none print:border-none print:rounded-none">
                                        {/* Header (App / Print) */}
                                        <div className="p-8 border-b border-border bg-accent/10 flex justify-between items-start print:bg-white print:border-b-2 print:border-black/20">
                                            <div className="flex items-center gap-6">
                                                <img src="/favicon.ico" className="w-16 h-16 print:w-24 print:h-24" alt="Foundation Logo" />
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h2 className="text-2xl font-black print:text-3xl">{selectedApp.full_name}</h2>
                                                        <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-bold print:hidden">เล่น {selectedApp.nickname}</span>
                                                    </div>
                                                    <p className="text-muted-foreground font-bold text-sm print:text-black">ใบสมัครนักเรียนทุน มูลนิธิเพื่อการศึกษาปัญญาคำ</p>
                                                    <p className="text-xs text-muted-foreground print:text-gray-500">วันที่ส่งเอกสาร: {new Date(selectedApp.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 print:hidden">
                                                <Button variant="outline" onClick={handlePrint} className="rounded-xl h-10 border-primary text-primary font-bold hover:bg-primary/10">
                                                    <Printer className="w-4 h-4 mr-2" /> พิมพ์ใบสมัคร (PDF)
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => deleteApp(selectedApp.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-5 h-5" /></Button>
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-10 print:p-4">
                                            {/* Basic Info Section - Horizontal Layout */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-accent/30 p-6 rounded-3xl border border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><School className="w-5 h-5 text-primary" /></div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">สถานศึกษา</p>
                                                        <p className="font-bold text-sm leading-tight">{selectedApp.school_name} ({selectedApp.grade_level})</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><FileText className="w-5 h-5 text-primary" /></div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">เกรดเฉลี่ย (GPA)</p>
                                                        <p className="font-bold text-lg text-primary">{selectedApp.gpa || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><Banknote className="w-5 h-5 text-primary" /></div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">รายได้ครอบครัว</p>
                                                        <p className="font-bold text-sm">{selectedApp.family_income || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bio Details - Horizontal Line */}
                                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 px-2 py-4 border-y border-dashed border-border/60">
                                                <div className="flex gap-2 text-sm italic">
                                                    <span className="text-muted-foreground font-bold">ชื่อเล่น:</span>
                                                    <span className="font-black text-foreground">{selectedApp.nickname}</span>
                                                </div>
                                                <div className="flex gap-2 text-sm">
                                                    <span className="text-muted-foreground font-bold">เพศ:</span>
                                                    <span className="font-bold">{selectedApp.gender}</span>
                                                </div>
                                                <div className="flex gap-2 text-sm">
                                                    <span className="text-muted-foreground font-bold">วันเกิด:</span>
                                                    <span className="font-bold">{selectedApp.birth_date ? new Date(selectedApp.birth_date).toLocaleDateString('th-TH') : '-'}</span>
                                                </div>
                                                <div className="flex gap-2 text-sm">
                                                    <span className="text-muted-foreground font-bold">เบอร์โทร:</span>
                                                    <span className="font-bold text-primary">{selectedApp.phone}</span>
                                                </div>
                                            </div>

                                            {/* Contact & Reason Sections */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <h4 className="font-black text-sm uppercase text-primary print:text-black flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" /> ที่อยู่อาศัย (ปัจจุบัน)
                                                    </h4>
                                                    <div className="bg-accent/20 p-5 rounded-2xl border border-border/50">
                                                        <div className="max-h-[100px] overflow-y-auto custom-scrollbar pr-2 print:max-h-none print:overflow-visible">
                                                            <span className="text-sm leading-relaxed font-medium whitespace-pre-line break-words block">
                                                                {selectedApp.address}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail className="w-4 h-4 text-primary" />
                                                        <span className="font-bold">อีเมล:</span> {selectedApp.email || 'ไม่ระบุ'}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="font-black text-sm uppercase text-primary print:text-black underline underline-offset-8">เหตุผลที่ขอรับทุน</h4>
                                                    <div className="bg-white border border-border p-6 rounded-3xl text-sm leading-loose shadow-sm italic print:border-gray-200">
                                                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2 print:max-h-none print:overflow-visible">
                                                            <p className="whitespace-pre-line break-words">
                                                                {selectedApp.reason || 'ไม่ได้ระบุเหตุผล'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer sign for print */}
                                            <div className="hidden print:grid grid-cols-2 gap-20 pt-16">
                                                <div className="text-center pt-8 border-t border-black/20">
                                                    <p className="text-sm font-bold">(ลงชื่อ)........................................................</p>
                                                    <p className="text-xs mt-2">ผู้สมัครขอรับทุน</p>
                                                </div>
                                                <div className="text-center pt-8 border-t border-black/20">
                                                    <p className="text-sm font-bold">(ลงชื่อ)........................................................</p>
                                                    <p className="text-xs mt-2">เจ้าหน้าที่มูลนิธิ / ผู้พิจารณา</p>
                                                </div>
                                            </div>

                                            {/* Status Management (Hidden on print) */}
                                            <div className="p-6 bg-accent border border-border rounded-3xl flex flex-wrap items-center justify-between gap-4 print:hidden">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold">สถานะปัจจุบัน:</span>
                                                    <span className="px-4 py-1.5 bg-white rounded-full text-xs font-black shadow-sm border border-border">{selectedApp.status}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => updateStatus(selectedApp.id, 'กำลังพิจารณา')} variant="outline" className="h-10 text-xs bg-white">กำลังพิจารณา</Button>
                                                    <Button onClick={() => updateStatus(selectedApp.id, 'อนุมัติ')} className="h-10 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-1" /> อนุมัติทุน</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-card border border-dashed border-border rounded-[2rem] print:hidden">
                                        <GraduationCap className="w-16 h-16 text-muted-foreground mb-4 opacity-10" />
                                        <h3 className="text-xl font-bold text-muted-foreground/50">กรุณาเลือกใบสมัครเพื่อดูรายละเอียด</h3>
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

export default AdminScholarships;
