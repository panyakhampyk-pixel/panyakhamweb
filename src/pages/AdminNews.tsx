import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Newspaper, Menu, X, Bell,
    Upload, Trash2, Image as ImageIcon, CheckCircle,
    Loader2, Plus, Edit2, Save, Type, Calendar,
    AlertCircle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";

interface NewsItem {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    published_at: string;
    // จะดึงภาพจากตาราง news_images มาใส่ในอาเรย์นี้
    images?: string[];
}

const AdminNews = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<NewsItem>>({});

    // Multiple Images State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchNews = async () => {
        setLoading(true);
        // ดึงข่าวพร้อมรูปภาพแรกของแต่ละข่าวมาโชว์ในรายการหลัก
        const { data: newsData } = await supabase
            .from("news")
            .select(`
        *,
        news_images (image_url)
      `)
            .order("published_at", { ascending: false });

        const formattedNews = newsData?.map((item: any) => ({
            ...item,
            images: item.news_images.map((img: any) => img.image_url)
        })) || [];

        setNews(formattedNews);
        setLoading(false);
    };

    useEffect(() => { fetchNews(); }, []);

    const openEditor = (item?: NewsItem) => {
        if (item) {
            setCurrentItem(item);
            setExistingImages(item.images || []);
            setPreviews(item.images || []);
        } else {
            setCurrentItem({
                title: "",
                category: "ข่าวสาร",
                excerpt: "",
                content: "",
                published_at: new Date().toISOString().split('T')[0]
            });
            setExistingImages([]);
            setPreviews([]);
        }
        setImageFiles([]);
        setIsEditing(true);
    };

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePreview = (index: number) => {
        // ลบรูปภาพออกจากชุดที่จะอัปโหลด
        const totalExisting = existingImages.length;
        if (index < totalExisting) {
            // เป็นรูปเก่าที่มีอยู่เดิม
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // เป็นรูปใหม่ที่กำลังจะอัปโหลด
            const fileIndex = index - totalExisting;
            setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!currentItem.title) return setError("กรุณาใส่หัวข้อข่าว");
        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            // 1. บันทึกข้อมูลข่าวหลักก่อน
            const newsData = {
                title: currentItem.title,
                category: currentItem.category,
                excerpt: currentItem.excerpt,
                content: currentItem.content,
                published_at: currentItem.published_at,
            };

            let newsId = currentItem.id;
            if (newsId) {
                await supabase.from("news").update(newsData).eq("id", newsId);
            } else {
                const { data, error: insErr } = await supabase.from("news").insert(newsData).select().single();
                if (insErr) throw insErr;
                newsId = data.id;
            }

            // 2. จัดการรูปภาพในตาราง news_images
            // ลบรูปภาพเก่าที่ไม่ได้อยู่ในรายการที่เลือกไว้แล้วออก
            await supabase.from("news_images").delete().eq("news_id", newsId).not("image_url", "in", `(${existingImages.map(url => `'${url}'`).join(",") || "''"})`);

            // อัปโหลดรูปใหม่ (ถ้ามี)
            if (imageFiles.length > 0) {
                if (!newsId) throw new Error("ไม่พบ News ID สำหรับอัปโหลดรูปภาพ");

                for (const file of imageFiles) {
                    // ปรับชื่อไฟล์ให้เรียบง่ายขึ้น ลดสัญลักษณ์ที่อาจทำให้ Error
                    const ext = file.name.split(".").pop();
                    const timestamp = Date.now();
                    const randomStr = Math.random().toString(36).substring(2, 7);
                    const fileName = `${newsId}/${timestamp}_${randomStr}.${ext}`;

                    console.log("Uploading to bucket 'news' path:", fileName);

                    const { error: upErr } = await supabase.storage.from("news").upload(fileName, file);
                    if (upErr) {
                        console.error("Upload error detail:", upErr);
                        throw upErr;
                    }

                    const { data: { publicUrl } } = supabase.storage.from("news").getPublicUrl(fileName);
                    await supabase.from("news_images").insert({
                        news_id: newsId,
                        image_url: publicUrl
                    });
                }
            }

            setSuccess("บันทึกข่าวสารและรูปภาพเรียบร้อย!");
            fetchNews();
            setIsEditing(false);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError("เกิดข้อผิดพลาด: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("คุณต้องการลบข่าวสารนี้และรูปภาพทั้งหมดใช่หรือไม่?")) return;
        await supabase.from("news").delete().eq("id", id); // Cascade จะลบรูปใน DB ให้เอง
        fetchNews();
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30 font-sans">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-primary" /> จัดการข่าวสาร (เพิ่มได้หลายรูป)
                        </h1>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => openEditor()} variant="default" className="bg-primary text-white gap-2 font-bold shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" /> เพิ่มข่าวใหม่
                        </Button>
                    )}
                </header>

                <main className="p-6 bg-accent/5 flex-1 overflow-auto font-sans">
                    <div className="max-w-6xl mx-auto">
                        {isEditing ? (
                            <div className="bg-card border border-border rounded-3xl shadow-xl animate-in fade-in transition-all overflow-hidden">
                                <div className="p-6 border-b border-border bg-accent/10 flex items-center justify-between">
                                    <h2 className="font-bold text-xl">{currentItem.id ? "แก้ไขข่าวสาร" : "สร้างข่าวสารใหม่"}</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full"><X /></Button>
                                </div>

                                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Gallery Section */}
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="font-bold text-base mb-3 block">คลังรูปภาพ (Gallery)</Label>
                                            <div
                                                onClick={() => fileRef.current?.click()}
                                                className="aspect-video bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-all text-center p-4"
                                            >
                                                <Upload className="w-8 h-8 text-primary mb-2" />
                                                <p className="text-sm font-bold text-primary">คลิกเพื่อเพิ่มรูปภาพ</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">เลือกได้พร้อมกันหลายรูป หรือกดเพิ่มทีละรูปก็ได้</p>
                                            </div>
                                            <input ref={fileRef} type="file" hidden multiple onChange={handleFilesChange} accept="image/*" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {previews.map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border group shadow-sm bg-accent">
                                                    <img src={url} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removePreview(idx)}
                                                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-semibold">หมวดหมู่</Label>
                                                <Input placeholder="กิจกรรม, ประชาสัมพันธ์" value={currentItem.category || ""} onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">วันที่เผยแพร่</Label>
                                                <Input type="date" value={currentItem.published_at?.split('T')[0] || ""} onChange={(e) => setCurrentItem({ ...currentItem, published_at: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-bold text-lg">หัวข้อข่าวสาร</Label>
                                            <Input className="h-12 text-lg font-bold" value={currentItem.title || ""} onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold">คำบรรยายสั้น (Excerpt)</Label>
                                            <Textarea placeholder="จะแสดงผลในหน้าแรกใต้หัวข้อ..." value={currentItem.excerpt || ""} onChange={(e) => setCurrentItem({ ...currentItem, excerpt: e.target.value })} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold">เนื้อเรื่องละเอียด (Content)</Label>
                                            <Textarea className="min-h-[250px] leading-relaxed" placeholder="เนื้อหาข่าวแบบเต็ม..." value={currentItem.content || ""} onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })} />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                                            <Button onClick={handleSave} disabled={actionLoading} className="flex-[2] h-12 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                                บันทึกข่าวสารทั้งหมด
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {news.map((item) => (
                                    <div key={item.id} className="bg-card border border-border rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
                                        <div className="aspect-[16/10] relative overflow-hidden bg-accent">
                                            <img src={item.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold rounded-full shadow-sm">{item.category}</span>
                                                {item.images && item.images.length > 1 && (
                                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm">+{item.images.length - 1} รูป</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(item.published_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <h4 className="font-bold text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">{item.excerpt}</p>
                                            <div className="flex gap-2 pt-4">
                                                <Button variant="outline" className="flex-1 rounded-xl h-10 font-bold border-border hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => openEditor(item)}>
                                                    <Edit2 className="w-3.5 h-3.5 mr-2" /> แก้ไข
                                                </Button>
                                                <Button variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {news.length === 0 && (
                                    <div className="col-span-full py-32 text-center bg-card border-2 border-dashed rounded-[3rem]">
                                        <Newspaper className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-muted-foreground">ไม่พบข้อมูลข่าวสาร</h3>
                                        <p className="text-sm text-muted-foreground/60 mt-1">เริ่มต้นสร้างข่าวสารแรกของคุณได้เลย!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {success && (
                <div className="fixed bottom-10 right-10 z-50 bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl animate-in slide-in-from-right flex items-center gap-3 font-bold border border-emerald-500/50">
                    <div className="bg-emerald-500/30 p-1.5 rounded-full"><CheckCircle className="w-5 h-5" /></div>
                    {success}
                </div>
            )}
            {error && (
                <div className="fixed bottom-10 right-10 z-50 bg-rose-600 text-white px-8 py-5 rounded-2xl shadow-2xl animate-in slide-in-from-right flex items-center gap-3 font-bold border border-rose-500/50">
                    <div className="bg-rose-500/30 p-1.5 rounded-full"><XCircle className="w-5 h-5" /></div>
                    {error}
                </div>
            )}
        </div>
    );
};

export default AdminNews;
