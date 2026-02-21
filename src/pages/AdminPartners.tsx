
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Handshake, Plus, Trash2, Camera, RefreshCcw, Save, Trash, Image as ImageIcon,
    Menu, Edit2, X, Globe, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Partner {
    id: string;
    name: string;
    logo_url: string;
    website_url?: string;
    sort_order: number;
    created_at: string;
}

const AdminPartners = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        website_url: "",
        image: null as File | null,
        existing_logo_url: ""
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("partners")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setPartners(data || []);
        } catch (error: any) {
            console.error("Fetch error:", error);
            // Table might not exist yet, we'll show a friendly message if handled or just ignore for now
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `partners/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('donations') // Use existing bucket
            .upload(filePath, file);

        if (uploadError) throw uploadError;
        return filePath;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            let logo_url = formData.existing_logo_url;

            if (formData.image) {
                logo_url = await handleUpload(formData.image);
            }

            const partnerData = {
                name: formData.name,
                website_url: formData.website_url,
                logo_url: logo_url,
                sort_order: partners.length + 1
            };

            if (editingPartnerId) {
                const { error } = await supabase
                    .from("partners")
                    .update(partnerData)
                    .eq("id", editingPartnerId);
                if (error) throw error;
                toast({ title: "อัปเดตสำเร็จ", description: "แก้ไขข้อมูลพันธมิตรเรียบร้อยแล้ว" });
            } else {
                const { error } = await supabase
                    .from("partners")
                    .insert([partnerData]);
                if (error) throw error;
                toast({ title: "เพิ่มสำเร็จ", description: "เพิ่มพันธมิตรเรียบร้อยแล้ว" });
            }

            resetForm();
            fetchPartners();
        } catch (error: any) {
            toast({ variant: "destructive", title: "ไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingPartnerId(null);
        setFormData({
            name: "",
            website_url: "",
            image: null,
            existing_logo_url: ""
        });
    };

    const editPartner = (partner: Partner) => {
        setEditingPartnerId(partner.id);
        setFormData({
            name: partner.name,
            website_url: partner.website_url || "",
            image: null,
            existing_logo_url: partner.logo_url
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deletePartner = async (id: string) => {
        if (!confirm("ลบทราบข้อมูลพันธมิตรนี้?")) return;
        try {
            const { error } = await supabase.from("partners").delete().eq("id", id);
            if (error) throw error;
            setPartners(partners.filter(p => p.id !== id));
            toast({ title: "ลบสำเร็จ" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ลบไม่สำเร็จ", description: error.message });
        }
    };

    const getPublicUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return supabase.storage.from('donations').getPublicUrl(path).data.publicUrl;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Handshake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground uppercase tracking-tight">พันธมิตรและ MOU</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Partner & MOU Management</p>
                        </div>
                    </div>
                    <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className={`rounded-full gap-2 ${isFormOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                        {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isFormOpen ? "ยกเลิก" : "เพิ่มพันธมิตรใหม่"}
                    </Button>
                </header>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {isFormOpen && (
                        <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-white p-8 rounded-[2.5rem] border border-border shadow-xl mb-10 animate-in fade-in slide-in-from-top-4">
                            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                                {editingPartnerId ? <Edit2 className="w-5 h-5 text-emerald-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                                {editingPartnerId ? "แก้ไขข้อมูลพันธมิตร" : "เพิ่มข้อมูลพันธมิตรใหม่"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อสถานประกอบการ / บริษัท</label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="ระบุชื่อบริษัทหรือหน่วยงาน" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ลิงก์เว็บไซต์ (ถ้ามี)</label>
                                    <Input value={formData.website_url} onChange={e => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://www.example.com" className="rounded-xl h-12" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">โลโก้หน่วยงาน</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-border flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                                            {formData.image ? (
                                                <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-contain p-2" />
                                            ) : formData.existing_logo_url ? (
                                                <img src={getPublicUrl(formData.existing_logo_url)} className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })} className="rounded-xl h-12" />
                                            <p className="text-[10px] text-muted-foreground ml-2">* ขนาดที่แนะนำ 400x200px (พื้นหลังโปร่งใสจะสวยที่สุด)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full mt-8 rounded-2xl bg-emerald-600 h-14 font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 text-white">
                                {loading ? <RefreshCcw className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                {editingPartnerId ? "บันทึกการแก้ไข" : "บันทึกข้อมูลพันธมิตร"}
                            </Button>
                        </form>
                    )}

                    <div className="max-w-6xl mx-auto">
                        {loading && partners.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                <RefreshCcw className="w-10 h-10 animate-spin" />
                                <p className="font-bold">กำลังโหลดข้อมูลพันธมิตร...</p>
                            </div>
                        ) : partners.length === 0 ? (
                            <div className="py-32 bg-white rounded-[3rem] border border-dashed border-border text-center">
                                <Handshake className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-400">ยังไม่มีข้อมูลพันธมิตร</h3>
                                <p className="text-slate-300">คลิก "เพิ่มพันธมิตรใหม่" เพื่อเริ่มสร้างข้อมูล</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {partners.map((partner) => (
                                    <div key={partner.id} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="w-full h-24 flex items-center justify-center mb-4 p-2">
                                            <img src={getPublicUrl(partner.logo_url)} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                                        </div>
                                        <h4 className="font-black text-slate-800 leading-tight text-sm mb-2">{partner.name}</h4>
                                        {partner.website_url && (
                                            <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 flex items-center gap-1 hover:underline">
                                                <Globe className="w-3 h-3" /> เว็บไซต์
                                            </a>
                                        )}

                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="secondary" size="icon"
                                                onClick={() => editPartner(partner)}
                                                className="rounded-full w-8 h-8 bg-white border border-border hover:bg-emerald-50 hover:text-emerald-600 shadow-sm"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="destructive" size="icon"
                                                onClick={() => deletePartner(partner.id)}
                                                className="rounded-full w-8 h-8 shadow-sm"
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPartners;
