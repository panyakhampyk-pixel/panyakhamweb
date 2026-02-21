import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    Menu, X, Bell, Upload, Trash2, GripVertical, Image as ImageIcon, CheckCircle,
    Loader2, Plus, Edit2, Save, Sparkles, ArrowUp, ArrowDown, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminSidebar from "@/components/AdminSidebar";

interface ProgramImage {
    id: string;
    image_url: string;
    sort_order: number;
}

const AdminPrograms = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [images, setImages] = useState<ProgramImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const fileRef = useRef<HTMLInputElement>(null);

    const fetchImages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("program_images")
            .select("*")
            .order("sort_order", { ascending: true });

        if (data) setImages(data);
        setLoading(false);
    };

    useEffect(() => { fetchImages(); }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setActionLoading(true);
        setError("");

        const uploadPromises = files.map(async (file, idx) => {
            const ext = file.name.split(".").pop();
            const fileName = `program_${Date.now()}_${idx}.${ext}`;

            const { error: uploadErr } = await supabase.storage.from("slider").upload(fileName, file);
            if (uploadErr) return null;

            const { data: { publicUrl } } = supabase.storage.from("slider").getPublicUrl(fileName);
            return {
                image_url: publicUrl,
                sort_order: images.length + idx
            };
        });

        const uploadedImages = (await Promise.all(uploadPromises)).filter(img => img !== null);

        if (uploadedImages.length > 0) {
            const { error: dbError } = await supabase.from("program_images").insert(uploadedImages);
            if (dbError) setError(dbError.message);
            else setSuccess(`อัปโหลดรูปภาพ ${uploadedImages.length} รูปเรียบร้อย!`);
        }

        fetchImages();
        setActionLoading(false);
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("ลบรูปภาพนี้ใช่หรือไม่?")) return;
        setActionLoading(true);

        const fileName = url.split("/").pop();
        if (fileName && !url.includes("placeholder")) {
            await supabase.storage.from("slider").remove([fileName]);
        }

        await supabase.from("program_images").delete().eq("id", id);
        fetchImages();
        setActionLoading(false);
    };

    const move = async (idx: number, direction: 'up' | 'down') => {
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= images.length) return;

        const updated = [...images];
        [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
        setImages(updated);

        await Promise.all([
            supabase.from("program_images").update({ sort_order: direction === 'up' ? idx - 1 : idx + 1 }).eq("id", updated[newIdx].id),
            supabase.from("program_images").update({ sort_order: idx }).eq("id", updated[idx].id),
        ]);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <Briefcase className="w-5 h-5 text-primary" /> จัดการรูปภาพการเลื่อน (Program Gallery)
                        </h1>
                    </div>
                    <Button onClick={() => fileRef.current?.click()} disabled={actionLoading} className="bg-primary text-white gap-2 shadow-lg">
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        อัปโหลดภาพใหม่
                    </Button>
                    <input ref={fileRef} type="file" multiple hidden onChange={handleUpload} accept="image/*" />
                </header>

                <main className="p-6 bg-accent/5 flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex gap-3 text-amber-700">
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <p className="text-sm">รูปภาพที่เพิ่มที่นี่จะถูกนำไปแสดงเป็นแถวเลื่อนอัตโนมัติในส่วน "ส่งมอบโอกาส" ที่หน้าแรก</p>
                        </div>

                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground font-sans">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p>กำลังโหลดแกลเลอรี...</p>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="h-96 flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-3xl gap-4">
                                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                                <h3 className="text-xl font-bold">ยังไม่มีรูปภาพแกลเลอรี</h3>
                                <Button onClick={() => fileRef.current?.click()} variant="outline">อัปโหลดรูปภาพแรก</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div key={img.id} className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                                        <div className="aspect-square">
                                            <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => move(idx, 'up')} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => move(idx, 'down')} disabled={idx === images.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 gap-1"
                                                onClick={() => handleDelete(img.id, img.image_url)}
                                            >
                                                <Trash2 className="w-3 h-3" /> ลบ
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {success && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /> <span>{success}</span>
                </div>
            )}
        </div>
    );
};

export default AdminPrograms;
