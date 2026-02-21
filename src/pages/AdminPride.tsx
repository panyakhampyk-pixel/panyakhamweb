import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    Menu, X, Bell, Upload, Trash2, GripVertical, Image as ImageIcon, CheckCircle,
    Loader2, Plus, Edit2, Save, Type, Star, ArrowUp, ArrowDown, Trophy, LayoutGrid, Files
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";

interface PrideTopic {
    id: string;
    title: string;
    description: string;
    sort_order: number;
    images?: PrideImage[];
}

interface PrideImage {
    id: string;
    image_url: string;
    caption: string;
    topic_id: string;
    sort_order: number;
}

const AdminPride = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [topics, setTopics] = useState<PrideTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [currentTopic, setCurrentTopic] = useState<Partial<PrideTopic>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        // Fetch topics and their images
        const { data: topicsData } = await supabase
            .from("pride_topics")
            .select("*, pride_images(*)")
            .order("sort_order", { ascending: true });

        if (topicsData) {
            // Reorder images within each topic if needed
            const formatted = topicsData.map(topic => ({
                ...topic,
                images: topic.pride_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)
            }));
            setTopics(formatted);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openEditor = (topic?: PrideTopic) => {
        if (topic) {
            setCurrentTopic(topic);
            setIsEditing(true);
        } else {
            setCurrentTopic({ title: "", description: "" });
            setIsEditing(true);
        }
        setSelectedFiles([]);
        setPreviews([]);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePreview = (index: number) => {
        const updatedFiles = [...selectedFiles];
        const updatedPreviews = [...previews];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setSelectedFiles(updatedFiles);
        setPreviews(updatedPreviews);
    };

    const handleSave = async () => {
        if (!currentTopic.title) {
            setError("กรุณากรอกชื่อหัวข้อ");
            return;
        }

        setActionLoading(true);
        setError("");
        setSuccess("");

        let topicId = currentTopic.id;

        // 1. Save or Update Topic
        if (topicId) {
            await supabase
                .from("pride_topics")
                .update({ title: currentTopic.title, description: currentTopic.description })
                .eq("id", topicId);
        } else {
            const { data } = await supabase
                .from("pride_topics")
                .insert({ title: currentTopic.title, description: currentTopic.description, sort_order: topics.length })
                .select()
                .single();
            topicId = data?.id;
        }

        if (!topicId) {
            setError("ไม่สามารถสร้างหัวข้อได้");
            setActionLoading(false);
            return;
        }

        // 2. Upload Multiple Images
        if (selectedFiles.length > 0) {
            const uploadPromises = selectedFiles.map(async (file, idx) => {
                const ext = file.name.split(".").pop();
                const fileName = `pride_${Date.now()}_${idx}.${ext}`;

                const { error: uploadErr } = await supabase.storage.from("slider").upload(fileName, file);
                if (uploadErr) return null;

                const { data: { publicUrl } } = supabase.storage.from("slider").getPublicUrl(fileName);
                return {
                    image_url: publicUrl,
                    topic_id: topicId,
                    caption: "",
                    sort_order: (currentTopic.images?.length || 0) + idx
                };
            });

            const uploadedImages = (await Promise.all(uploadPromises)).filter(img => img !== null);

            if (uploadedImages.length > 0) {
                await supabase.from("pride_images").insert(uploadedImages);
            }
        }

        setSuccess("บันทึกข้อมูลเรียบร้อยแล้ว!");
        fetchData();
        setIsEditing(false);
        setActionLoading(false);
        setTimeout(() => setSuccess(""), 3000);
    };

    const deleteTopic = async (id: string) => {
        if (!confirm("ลบหัวข้อนี้พร้อมรูปภาพทั้งหมดใช่หรือไม่?")) return;
        setActionLoading(true);
        await supabase.from("pride_topics").delete().eq("id", id);
        fetchData();
        setActionLoading(false);
    };

    const deleteImage = async (imgId: string) => {
        if (!confirm("ลบรูปภาพนี้ใช่หรือไม่?")) return;
        await supabase.from("pride_images").delete().eq("id", imgId);
        fetchData();
    };

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-30">
                    <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" /> จัดการหัวข้อความภาคภูมิใจ
                        </h1>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => openEditor()} variant="default" className="bg-primary text-white gap-2 shadow-lg">
                            <Plus className="w-4 h-4" /> สร้างหัวข้อใหม่
                        </Button>
                    )}
                </header>

                <main className="p-6 bg-accent/5 flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {isEditing ? (
                            <div className="bg-card border border-border rounded-3xl shadow-xl p-8 space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <LayoutGrid className="w-5 h-5 text-primary" /> {currentTopic.id ? "แก้ไขหัวข้อ" : "สร้างหัวข้อใหม่"}
                                    </h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X /></Button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-base font-bold">ชื่อหัวข้อ (Topic Title)</Label>
                                            <Input className="h-12 text-lg" placeholder="เช่น กิจกรรมประจำปี 2568" value={currentTopic.title || ""} onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>คำอธิบายเพิ่มเติม</Label>
                                            <Textarea placeholder="รายละเอียดหัวข้อความภาคภูมิใจ..." value={currentTopic.description || ""} onChange={(e) => setCurrentTopic({ ...currentTopic, description: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <Label className="text-base font-bold flex items-center gap-2"><Files className="w-5 h-5" /> เพิ่มรูปภาพ (เลือกได้หลายรูป)</Label>
                                        <div
                                            onClick={() => fileRef.current?.click()}
                                            className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all text-center"
                                        >
                                            <Upload className="w-10 h-10 text-primary mb-4" />
                                            <p className="font-bold">คลิกเพื่อเลือกรูปภาพ</p>
                                            <p className="text-sm text-muted-foreground">คุณสามารถกด Ctrl/Shift ค้างเพื่อเลือกหลายๆ รูปพร้อมกัน</p>
                                        </div>
                                        <input ref={fileRef} type="file" multiple hidden onChange={handleFileChange} accept="image/*" />

                                        {previews.length > 0 && (
                                            <div className="grid grid-cols-4 gap-3 mt-4">
                                                {previews.map((src, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                                        <img src={src} className="w-full h-full object-cover" alt="" />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                                                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Button variant="outline" className="flex-1 h-12" onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                                    <Button onClick={handleSave} disabled={actionLoading} className="flex-[2] h-12 bg-primary text-white">
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                        บันทึกหัวข้อและอัปโหลดรูป
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {topics.length === 0 && !loading && (
                                    <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
                                        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">ยังไม่มีหัวข้อความภาคภูมิใจ</h3>
                                        <Button onClick={() => openEditor()} className="mt-4"><Plus className="w-4 h-4 mr-2" /> เริ่มสร้างหัวข้อแรก</Button>
                                    </div>
                                )}

                                {topics.map((topic) => (
                                    <div key={topic.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                                        <div className="p-6 bg-accent/5 border-b flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black">{topic.title}</h3>
                                                <p className="text-sm text-muted-foreground">{topic.description || "ไม่มีคำอธิบาย"}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditor(topic)}><Edit2 className="w-4 h-4 mr-2" /> แก้ไข/เพิ่มรูป</Button>
                                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTopic(topic.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {topic.images?.map((img) => (
                                                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                                                    <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                        <Button variant="ghost" size="icon" className="text-white hover:text-destructive" onClick={() => deleteImage(img.id)}><Trash2 className="w-5 h-5" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => openEditor(topic)}
                                                className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:bg-primary/5 transition-all aspect-square text-muted-foreground hover:text-primary"
                                            >
                                                <Plus className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] font-bold">เพิ่มรูป</span>
                                            </button>
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

export default AdminPride;
