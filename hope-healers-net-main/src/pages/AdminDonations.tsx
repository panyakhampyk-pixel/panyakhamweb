import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Heart, Search, Filter, Trash2, Eye,
    CheckCircle2, XCircle, Download, FileText,
    Printer, Calendar, Banknote, User, MapPin,
    Mail, Phone, CreditCard, Building, ExternalLink, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface Donation {
    id: string;
    full_name: string;
    citizen_id: string;
    tax_id: string;
    address: string;
    phone: string;
    email: string;
    donation_date: string;
    amount: string;
    payment_method: string;
    payment_method_other: string;
    receipt_url: string;
    delivery_type: string;
    shipping_address: string;
    created_at: string;
}

const AdminDonations = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const { data, error } = await supabase
                .from("donations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setDonations(data || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteDonation = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการบริจาคนี้?")) return;

        try {
            const { error } = await supabase.from("donations").delete().eq("id", id);
            if (error) throw error;
            setDonations(donations.filter((d) => d.id !== id));
            if (selectedDonation?.id === id) setSelectedDonation(null);
            toast({ title: "ลบสำเร็จ", description: "ลบข้อมูลการบริจาคเรียบร้อยแล้ว" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ไม่สามารถลบได้", description: error.message });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredDonations = donations.filter((d) =>
        d.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPublicUrl = (path: string) => {
        if (!path) return null;
        return supabase.storage.from('donations').getPublicUrl(path).data.publicUrl;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Styles for Printing Receipt */}
            <style>
                {`
          @media print {
            @page { size: A4; margin: 0; }
            body { background: white !important; -webkit-print-color-adjust: exact; }
            aside, nav, header, .admin-controls, .donations-list, button, .no-print {
              display: none !important;
            }
            .main-content { margin-left: 0 !important; padding: 0 !important; width: 100% !important; }
            .print-receipt {
              display: block !important;
              width: 210mm;
              min-height: 297mm;
              padding: 2.5cm;
              margin: 0 auto;
              background: white !important;
              font-family: 'Sarabun', sans-serif !important;
              color: black !important;
            }
            .receipt-border {
              border: 2px solid #e2e8f0;
              padding: 2rem;
              height: 100%;
              position: relative;
            }
          }
          .print-receipt { display: none; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}
            </style>

            <main className="flex-1 flex flex-col main-content relative overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-10 no-print">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground">จัดการข้อมูลการบริจาค</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Donation Management System</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-hidden flex flex-col lg:flex-row gap-8">
                    {/* List Section */}
                    <div className="lg:w-[400px] flex flex-col gap-6 donations-list no-print flex-shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-rose-500 transition-colors" />
                            <Input
                                placeholder="ค้นหาชื่อผู้บริจาค..."
                                className="pl-12 h-14 bg-white border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-rose-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {loading ? (
                                <div className="p-10 text-center space-y-3">
                                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-sm text-muted-foreground font-bold">กำลังโหลด...</p>
                                </div>
                            ) : filteredDonations.length === 0 ? (
                                <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-border mt-10">
                                    <Heart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground font-bold">ไม่พบข้อมูลการบริจาค</p>
                                </div>
                            ) : (
                                filteredDonations.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelectedDonation(d)}
                                        className={`w-full p-5 rounded-3xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${selectedDonation?.id === d.id
                                                ? "bg-rose-500 border-rose-500 shadow-xl shadow-rose-500/20 text-white"
                                                : "bg-white border-border hover:border-rose-200"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${selectedDonation?.id === d.id ? 'bg-white/20' : 'bg-rose-50 text-rose-500'}`}>
                                                {new Date(d.donation_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="font-black text-sm">{parseFloat(d.amount).toLocaleString()} ฿</span>
                                        </div>
                                        <h4 className="font-bold truncate">{d.full_name}</h4>
                                        <p className={`text-xs mt-1 truncate ${selectedDonation?.id === d.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                                            {d.payment_method}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 min-w-0 no-print">
                        {selectedDonation ? (
                            <div className="h-full flex flex-col bg-white border border-border rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <div className="p-8 border-b border-border bg-rose-50/30 flex justify-between items-center bg-gradient-to-r from-rose-50/50 to-transparent">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100">
                                            <Building className="w-7 h-7 text-rose-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-foreground">{selectedDonation.full_name}</h2>
                                            <p className="text-xs text-muted-foreground font-bold">ข้อมูลการบริจาคและ e-Donation</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handlePrint} variant="outline" className="rounded-xl gap-2 font-bold border-rose-200 hover:bg-rose-50">
                                            <Printer className="w-4 h-4" /> พิมพ์ใบอนุโมทนา
                                        </Button>
                                        <Button onClick={() => deleteDonation(selectedDonation.id)} variant="ghost" className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50 space-y-1">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">จำนวนเงิน</p>
                                            <p className="text-3xl font-black">{parseFloat(selectedDonation.amount).toLocaleString()} <span className="text-sm font-bold text-muted-foreground">THB</span></p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">วันที่บริจาค</p>
                                            <p className="text-lg font-bold">{new Date(selectedDonation.donation_date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ช่องทาง</p>
                                            <p className="text-lg font-bold truncate">{selectedDonation.payment_method}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                                    <User className="w-3 h-3" /> ข้อมูลผู้บริจาค
                                                </h4>
                                                <div className="space-y-3 bg-white p-6 rounded-3xl border border-border shadow-sm">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-bold text-muted-foreground shrink-0">เลขบัตร/Tax ID:</span>
                                                        <span className="font-black">{selectedDonation.citizen_id || selectedDonation.tax_id || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-bold text-muted-foreground shrink-0">เบอร์โทรศัพท์:</span>
                                                        <span className="font-black">{selectedDonation.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-bold text-muted-foreground shrink-0">อีเมล:</span>
                                                        <span className="font-black">{selectedDonation.email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm pt-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                                        <div className="flex-1">
                                                            <span className="font-bold text-muted-foreground block mb-1">ที่อยู่ผู้บริจาค:</span>
                                                            <p className="text-xs leading-relaxed">{selectedDonation.address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" /> การส่งเอกสาร
                                                </h4>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-border">
                                                    <Badge className="mb-3 bg-rose-500">{selectedDonation.delivery_type}</Badge>
                                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                                        {selectedDonation.delivery_type === 'CurrentAddress'
                                                            ? selectedDonation.shipping_address
                                                            : 'ส่งตามอีเมลหรือที่อยู่ที่ระบุไว้ข้างต้น'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> หลักฐานการโอน
                                                </h4>
                                                {selectedDonation.receipt_url ? (
                                                    <div className="relative group rounded-[2rem] overflow-hidden border border-border shadow-md aspect-[3/4] max-w-[300px]">
                                                        <img
                                                            src={getPublicUrl(selectedDonation.receipt_url) || ''}
                                                            alt="Donation Receipt"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <a
                                                            href={getPublicUrl(selectedDonation.receipt_url) || ''}
                                                            target="_blank"
                                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <Button variant="secondary" className="rounded-full gap-2">
                                                                <ExternalLink className="w-4 h-4" /> ดูรูปขนาดเต็ม
                                                            </Button>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="aspect-[3/4] max-w-[300px] border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground/30">
                                                        <XCircle className="w-12 h-12 mb-2" />
                                                        <p className="text-xs font-bold">ไม่มีรูปหลักฐาน</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-white border border-dashed border-border rounded-[2.5rem]">
                                <div className="w-20 h-20 bg-rose-50 text-rose-200 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-black text-muted-foreground/50 uppercase tracking-widest">เลือกข้อมูลเพื่อดูรายละเอียด</h3>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hidden Print Template (A4) */}
                {selectedDonation && (
                    <div className="print-receipt">
                        <div className="receipt-border relative overflow-hidden">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50/50 rounded-full -mr-20 -mt-20 -z-10"></div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-16">
                                <div className="flex gap-4 items-center">
                                    <Logo size="sm" />
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground">มูลนิธิเพื่อการศึกษาปัญญาคำ</h3>
                                        <p className="text-xs text-muted-foreground font-bold">Panyakhum Foundation for Education</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h1 className="text-4xl font-black text-rose-500 mb-2">ใบอนุโมทนาบัตร</h1>
                                    <p className="text-sm font-bold">เลขที่ใบเสร็จ: REC-{selectedDonation.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-12 mb-20 text-lg leading-loose">
                                <p className="text-center font-bold text-2xl mb-10">ขออนุโมทนาบุญแก่</p>

                                <div className="border-b-2 border-black/10 pb-2 mb-8">
                                    <span className="text-muted-foreground mr-4">นามผู้บริจาค:</span>
                                    <span className="text-2xl font-black underline decoration-rose-500/30 underline-offset-8 decoration-4">{selectedDonation.full_name}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="border-b-2 border-black/10 pb-2">
                                        <span className="text-muted-foreground mr-4">จำนวนเงิน:</span>
                                        <span className="font-black">{parseFloat(selectedDonation.amount).toLocaleString()} บาท</span>
                                    </div>
                                    <div className="border-b-2 border-black/10 pb-2">
                                        <span className="text-muted-foreground mr-4">วันที่:</span>
                                        <span className="font-black">{new Date(selectedDonation.donation_date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
                                    </div>
                                </div>

                                <div className="border-b-2 border-black/10 pb-2">
                                    <span className="text-muted-foreground mr-4">วัตถุประสงค์เพื่อ:</span>
                                    <span className="font-bold italic">สนับสนุนการศึกษาและสวัสดิการของนักเรียนในมูลนิธิฯ</span>
                                </div>
                            </div>

                            <div className="bg-rose-50/30 p-10 rounded-[3rem] text-center mb-20 border border-rose-100">
                                <p className="text-lg font-bold text-rose-600 leading-relaxed italic">
                                    "ขออำนาจคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลายในสากลโลก <br />
                                    จงดลบันดาลให้ท่านและครอบครัว ประสบแต่ความสุขสวัสดิ์ พิพัฒนมงคล สมบูรณ์พูนผลในทุกประการเทอญ"
                                </p>
                            </div>

                            {/* Footer / Signature */}
                            <div className="flex justify-between items-end mt-20">
                                <div className="text-center w-[200px] space-y-2">
                                    <div className="w-full border-b border-black"></div>
                                    <p className="text-sm font-bold">ตราประทับมูลนิธิ</p>
                                </div>
                                <div className="text-center w-[250px] space-y-4">
                                    <div className="h-10"></div>
                                    <div className="w-full border-b border-black"></div>
                                    <p className="text-sm font-bold uppercase tracking-widest">( ผู้รับมอบอำนาจมูลนิธิ )</p>
                                    <p className="text-xs text-muted-foreground font-bold italic">ออกให้ ณ วันที่ {new Date().toLocaleDateString('th-TH')}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-10 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] border-l-4 border-rose-500 pl-4">
                                Panyakhum Foundation e-Donation System <br />
                                Verified Digital Document
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDonations;
