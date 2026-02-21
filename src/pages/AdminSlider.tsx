import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap, BookOpen, Heart, Newspaper, Menu, X, Bell,
    Upload, Trash2, GripVertical, Image as ImageIcon, CheckCircle,
    Loader2, Plus, Edit2, Save, Type, Pointer, ArrowRight,
    ArrowUp, ArrowDown, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";

interface Slide {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    description: string;
    button1_text: string;
    button1_link: string;
    button2_text: string;
    button2_link: string;
    sort_order: number;
}

const AdminSlider = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [currentSlide, setCurrentSlide] = useState<Partial<Slide>>({});
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchSlides = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("slider_images")
            .select("*")
            .order("sort_order", { ascending: true });
        setSlides(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchSlides(); }, []);

    const openEditor = (slide?: Slide) => {
        if (slide) {
            setCurrentSlide(slide);
            setPreviewUrl(slide.image_url);
            setIsEditing(true);
        } else {
            setCurrentSlide({
                title: "",
                subtitle: "",
                description: "",
                button1_text: "ร่วมบริจาค",
                button1_link: "#donate",
                button2_text: "ขอรับทุนการศึกษา",
                button2_link: "#scholarship",
            });
            setPreviewUrl(null);
            setIsEditing(true);
        }
        setSelectedFile(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setActionLoading(true);
        setError("");
        setSuccess("");

        let imageUrl = currentSlide.image_url;

        if (selectedFile) {
            const ext = selectedFile.name.split(".").pop();
            const fileName = `slide_${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from("slider")
                .upload(fileName, selectedFile);

            if (uploadError) {
                setError("อัปโหลดรูปภาพไม่สำเร็จ: " + uploadError.message);
                setActionLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from("slider").getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        const slideData = {
            title: currentSlide.title || "",
            subtitle: currentSlide.subtitle || "",
            description: currentSlide.description || "",
            button1_text: currentSlide.button1_text || "",
            button1_link: currentSlide.button1_link || "",
            button2_text: currentSlide.button2_text || "",
            button2_link: currentSlide.button2_link || "",
            image_url: imageUrl,
        };

        if (currentSlide.id) {
            const { error: dbError } = await supabase
                .from("slider_images")
                .update(slideData)
                .eq("id", currentSlide.id);
            if (dbError) setError(dbError.message);
            else setSuccess("อัปเดตสไลด์เรียบร้อย!");
        } else {
            const { error: dbError } = await supabase
                .from("slider_images")
                .insert({ ...slideData, sort_order: slides.length });
            if (dbError) setError(dbError.message);
            else setSuccess("เพิ่มสไลด์ใหม่สำเร็จ!");
        }

        if (!error) {
            fetchSlides();
            setIsEditing(false);
            setTimeout(() => setSuccess(""), 3000);
        }
        setActionLoading(false);
    };

    const handleDelete = async (slide: Slide) => {
        if (!confirm(`ลบสไลด์นี้ใช่หรือไม่?`)) return;
        setActionLoading(true);
        const fileName = slide.image_url.split("/").pop();
        if (fileName && !slide.image_url.includes("placeholder")) {
            await supabase.storage.from("slider").remove([fileName]);
        }
        await supabase.from("slider_images").delete().eq("id", slide.id);
        fetchSlides();
        setActionLoading(false);
    };

    const move = async (idx: number, direction: 'up' | 'down') => {
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= slides.length) return;

        const updated = [...slides];
        [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
        setSlides(updated);

        await Promise.all([
            supabase.from("slider_images").update({ sort_order: direction === 'up' ? idx - 1 : idx + 1 }).eq("id", updated[newIdx].id),
            supabase.from("slider_images").update({ sort_order: idx }).eq("id", updated[idx].id),
        ]);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 font-sans">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <ImageIcon className="w-5 h-5 text-primary" /> แก้ไขข้อมูลสไลด์ (Hero Slider)
                        </h1>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => openEditor()} variant="default" className="bg-primary text-white gap-2 shadow-lg hover:scale-105 transition-transform">
                            <Plus className="w-4 h-4" /> เพิ่มสไลด์ใหม่
                        </Button>
                    )}
                </header>

                <main className="p-6 bg-accent/5 flex-1 h-full overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {isEditing ? (
                            <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="p-6 border-b border-border bg-accent/10 flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {currentSlide.id ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                        {currentSlide.id ? "แก้ไขสไลด์" : "สร้างสไลด์ใหม่"}
                                    </h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full"><X /></Button>
                                </div>

                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-base font-semibold mb-3 block">รูปภาพประกอบ</Label>
                                            <div
                                                onClick={() => fileRef.current?.click()}
                                                className="group aspect-video bg-accent/20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative"
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img src={previewUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <p className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-5 h-5" /> เปลี่ยนรูปภาพ</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <span className="text-lg font-bold text-foreground">เลือกรูปภาพสไลด์</span>
                                                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">แนะนำขนาด 1920x1080px</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input ref={fileRef} type="file" hidden onChange={handleFileChange} accept="image/*" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2"><Type className="w-3.5 h-3.5" /> หัวข้อหลัก (Title)</Label>
                                                <Input className="text-lg font-bold h-12" value={currentSlide.title || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2 text-amber-600"><Edit2 className="w-3.5 h-3.5" /> ตัวเน้น (Subtitle)</Label>
                                                <Input className="text-amber-600 font-semibold" value={currentSlide.subtitle || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>คำบรรยายเพิ่มเติม</Label>
                                                <Textarea className="min-h-[100px]" value={currentSlide.description || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, description: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 border border-border rounded-xl space-y-3 bg-accent/5">
                                                <Label className="text-primary font-bold">ปุ่มที่ 1</Label>
                                                <Input placeholder="ข้อความ" value={currentSlide.button1_text || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, button1_text: e.target.value })} />
                                                <Input placeholder="ลิงก์" value={currentSlide.button1_link || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, button1_link: e.target.value })} />
                                            </div>
                                            <div className="p-4 border border-border rounded-xl space-y-3 bg-accent/5">
                                                <Label className="text-muted-foreground font-bold">ปุ่มที่ 2</Label>
                                                <Input placeholder="ข้อความ" value={currentSlide.button2_text || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, button2_text: e.target.value })} />
                                                <Input placeholder="ลิงก์" value={currentSlide.button2_link || ""} onChange={(e) => setCurrentSlide({ ...currentSlide, button2_link: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button variant="outline" className="flex-1 h-12" onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                                            <Button onClick={handleSave} disabled={actionLoading} className="flex-[2] h-12 bg-primary text-white">
                                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                                บันทึกข้อมูล
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground font-sans">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                        <p>กำลังโหลดข้อมูลสไลด์...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {slides.map((slide, idx) => (
                                            <div key={slide.id} className="group bg-card border border-border rounded-2xl p-4 flex items-center gap-6 hover:shadow-lg transition-all">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => move(idx, 'up')} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                                                    <GripVertical className="w-5 h-5 text-muted-foreground/30" />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => move(idx, 'down')} disabled={idx === slides.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                                                </div>

                                                <div className="relative w-40 aspect-video rounded-xl overflow-hidden border border-border shrink-0">
                                                    <img src={slide.image_url} className="w-full h-full object-cover" alt="" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-lg truncate">{slide.title || "Untitled Slide"}</h4>
                                                    <p className="text-sm text-primary font-medium truncate">{slide.subtitle || "-"}</p>
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-[10px] text-muted-foreground">ปุ่ม1: {slide.button1_text}</span>
                                                        <span className="text-[10px] text-muted-foreground">ปุ่ม2: {slide.button2_text}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button onClick={() => openEditor(slide)} variant="outline" className="gap-2">
                                                        <Edit2 className="w-4 h-4" /> แก้ไข
                                                    </Button>
                                                    <Button onClick={() => handleDelete(slide)} size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

export default AdminSlider;
