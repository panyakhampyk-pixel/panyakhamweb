
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Users, Plus, Trash2, Camera, MoveUp, MoveDown,
    RefreshCcw, Save, Trash, UserPlus, Image as ImageIcon,
    Menu, Edit2, X, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
    id: string;
    name: string;
    email?: string;
    position: string;
    image_url: string;
    group_name: string;
    group_level: number;
    sort_order: number;
}

const AdminTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        position: "",
        group_name: "",
        group_level: 1,
        image: null as File | null,
        existing_image_url: ""
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("teachers")
                .select("*")
                .order("group_level", { ascending: true })
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setTeachers(data || []);
        } catch (error: any) {
            toast({ variant: "destructive", title: "โหลดข้อมูลไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `teachers/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('donations')
            .upload(filePath, file);

        if (uploadError) throw uploadError;
        return filePath;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            let image_url = formData.existing_image_url;

            if (formData.image) {
                image_url = await handleUpload(formData.image);
            }

            const teacherData = {
                name: formData.name,
                email: formData.email,
                position: formData.position,
                group_name: formData.group_name,
                group_level: formData.group_level,
                image_url: image_url
            };

            if (editingTeacherId) {
                const { error } = await supabase
                    .from("teachers")
                    .update(teacherData)
                    .eq("id", editingTeacherId);
                if (error) throw error;
                toast({ title: "อัปเดตสำเร็จ", description: "แก้ไขข้อมูลอาจารย์เรียบร้อยแล้ว" });
            } else {
                const { error } = await supabase
                    .from("teachers")
                    .insert([teacherData]);
                if (error) throw error;
                toast({ title: "เพิ่มสำเร็จ", description: "เพิ่มอาจารย์เรียบร้อยแล้ว" });
            }

            resetForm();
            fetchTeachers();
        } catch (error: any) {
            toast({ variant: "destructive", title: "ไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingTeacherId(null);
        setFormData({
            name: "",
            email: "",
            position: "",
            group_name: "",
            group_level: 1,
            image: null,
            existing_image_url: ""
        });
    };

    const editTeacher = (person: Teacher) => {
        setEditingTeacherId(person.id);
        setFormData({
            name: person.name,
            email: person.email || "",
            position: person.position,
            group_name: person.group_name,
            group_level: person.group_level,
            image: null,
            existing_image_url: person.image_url
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteTeacher = async (id: string) => {
        if (!confirm("ลบข้อมูลอาจารย์นี้?")) return;
        try {
            const { error } = await supabase.from("teachers").delete().eq("id", id);
            if (error) throw error;
            setTeachers(teachers.filter(s => s.id !== id));
            toast({ title: "ลบสำเร็จ" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ลบไม่สำเร็จ", description: error.message });
        }
    };

    const groupedTeachers = teachers.reduce((acc, current) => {
        const level = current.group_level;
        if (!acc[level]) acc[level] = { name: current.group_name, members: [] };
        acc[level].members.push(current);
        return acc;
    }, {} as Record<number, { name: string, members: Teacher[] }>);

    const getPublicUrl = (path: string) => {
        if (!path) return "/placeholder-staff.png";
        return supabase.storage.from('donations').getPublicUrl(path).data.publicUrl;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
                        <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground uppercase tracking-tight">รายชื่ออาจารย์ในระบบ</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Teacher Directory Management</p>
                        </div>
                    </div>
                    <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className={`rounded-full gap-2 ${isFormOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-amber-600 hover:bg-amber-700'}`}>
                        {isFormOpen ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        {isFormOpen ? "ยกเลิก" : "เพิ่มอาจารย์ใหม่"}
                    </Button>
                </header>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {isFormOpen && (
                        <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-white p-8 rounded-[2.5rem] border border-border shadow-xl mb-10 animate-in fade-in slide-in-from-top-4">
                            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                                {editingTeacherId ? <Edit2 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-amber-600" />}
                                {editingTeacherId ? "แก้ไขข้อมูลอาจารย์" : "เพิ่มข้อมูลอาจารย์ใหม่"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อ-นามสกุล</label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="เช่น อ.สมชาย ใจดี" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">อีเมล (ถ้ามี)</label>
                                    <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ตำแหน่ง/วิชาที่สอน</label>
                                    <Input required value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="เช่น อาจารย์ประจำสาขาคอมพิวเตอร์" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อคณะ/กลุ่มสาระ</label>
                                    <Input required value={formData.group_name} onChange={e => setFormData({ ...formData, group_name: e.target.value })} placeholder="เช่น คณะเทคโนโลยีสารสนเทศ" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ลำดับชั้นของกลุ่ม (1 คือบนสุด)</label>
                                    <Input required type="number" value={formData.group_level} onChange={e => setFormData({ ...formData, group_level: parseInt(e.target.value) })} className="rounded-xl h-12" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">รูปถ่าย</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-border flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                                            {formData.image ? (
                                                <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" />
                                            ) : formData.existing_image_url ? (
                                                <img src={getPublicUrl(formData.existing_image_url)} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })} className="rounded-xl h-12" />
                                            <p className="text-[10px] text-muted-foreground ml-2">* ปล่อยว่างไว้หากไม่ต้องการเปลี่ยนรูปเดิม</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full mt-8 rounded-2xl bg-amber-600 h-14 font-black uppercase tracking-widest hover:bg-amber-700 shadow-lg shadow-amber-200">
                                {loading ? <RefreshCcw className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                {editingTeacherId ? "บันทึกการแก้ไข" : "บันทึกข้อมูลอาจารย์"}
                            </Button>
                        </form>
                    )}

                    <div className="max-w-6xl mx-auto space-y-12">
                        {Object.keys(groupedTeachers).sort((a, b) => parseInt(a) - parseInt(b)).map(level => (
                            <div key={level} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-amber-50"></div>
                                    <h3 className="text-amber-600 font-black uppercase tracking-[0.2em] text-sm">
                                        ลำดับที่ {level}: {groupedTeachers[parseInt(level)].name}
                                    </h3>
                                    <div className="h-[2px] flex-1 bg-amber-50"></div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {groupedTeachers[parseInt(level)].members.map((person) => (
                                        <div key={person.id} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform bg-slate-50">
                                                <img src={getPublicUrl(person.image_url)} className="w-full h-full object-cover" />
                                            </div>
                                            <h4 className="font-black text-slate-800 leading-tight">{person.name}</h4>
                                            <p className="text-[10px] text-amber-600 font-bold uppercase mt-1 tracking-wider">{person.position}</p>

                                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="secondary" size="icon"
                                                    onClick={() => editTeacher(person)}
                                                    className="rounded-full w-8 h-8 bg-white border border-border hover:bg-amber-50 hover:text-amber-600 shadow-sm"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="destructive" size="icon"
                                                    onClick={() => deleteTeacher(person.id)}
                                                    className="rounded-full w-8 h-8 shadow-sm"
                                                >
                                                    <Trash className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminTeachers;
