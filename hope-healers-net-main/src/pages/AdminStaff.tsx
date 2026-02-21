import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Users, Plus, Trash2, Camera, MoveUp, MoveDown,
    RefreshCcw, Save, Trash, UserPlus, Image as ImageIcon,
    Menu, Edit2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Staff {
    id: string;
    name: string;
    position: string;
    image_url: string;
    group_name: string;
    group_level: number;
    sort_order: number;
}

const AdminStaff = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        group_name: "",
        group_level: 1,
        image: null as File | null,
        existing_image_url: ""
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("staff")
                .select("*")
                .order("group_level", { ascending: true })
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setStaff(data || []);
        } catch (error: any) {
            toast({ variant: "destructive", title: "โหลดข้อมูลไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `staff/${fileName}`;

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

            const staffData = {
                name: formData.name,
                position: formData.position,
                group_name: formData.group_name,
                group_level: formData.group_level,
                image_url: image_url
            };

            if (editingStaffId) {
                const { error } = await supabase
                    .from("staff")
                    .update(staffData)
                    .eq("id", editingStaffId);
                if (error) throw error;
                toast({ title: "อัปเดตสำเร็จ", description: "แก้ไขข้อมูลบุคลากรเรียบร้อยแล้ว" });
            } else {
                const { error } = await supabase
                    .from("staff")
                    .insert([staffData]);
                if (error) throw error;
                toast({ title: "เพิ่มสำเร็จ", description: "เพิ่มบุคลากรเรียบร้อยแล้ว" });
            }

            resetForm();
            fetchStaff();
        } catch (error: any) {
            toast({ variant: "destructive", title: "ไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingStaffId(null);
        setFormData({
            name: "",
            position: "",
            group_name: "",
            group_level: 1,
            image: null,
            existing_image_url: ""
        });
    };

    const editStaff = (person: Staff) => {
        setEditingStaffId(person.id);
        setFormData({
            name: person.name,
            position: person.position,
            group_name: person.group_name,
            group_level: person.group_level,
            image: null,
            existing_image_url: person.image_url
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteStaff = async (id: string) => {
        if (!confirm("ลบข้อมูลบุคลากรนี้?")) return;
        try {
            const { error } = await supabase.from("staff").delete().eq("id", id);
            if (error) throw error;
            setStaff(staff.filter(s => s.id !== id));
            toast({ title: "ลบสำเร็จ" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ลบไม่สำเร็จ", description: error.message });
        }
    };

    const groupedStaff = staff.reduce((acc, current) => {
        const level = current.group_level;
        if (!acc[level]) acc[level] = { name: current.group_name, members: [] };
        acc[level].members.push(current);
        return acc;
    }, {} as Record<number, { name: string, members: Staff[] }>);

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
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground uppercase tracking-tight">ทำเนียบบุคลากร</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Staff Directory Management</p>
                        </div>
                    </div>
                    <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className={`rounded-full gap-2 ${isFormOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {isFormOpen ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        {isFormOpen ? "ยกเลิก" : "เพิ่มบุคลากรใหม่"}
                    </Button>
                </header>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {isFormOpen && (
                        <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-white p-8 rounded-[2.5rem] border border-border shadow-xl mb-10 animate-in fade-in slide-in-from-top-4">
                            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                                {editingStaffId ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                                {editingStaffId ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มข้อมูลบุคลากรใหม่"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อ-นามสกุล</label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="ระบุนามแฝงหรือชื่อจริง" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ตำแหน่ง</label>
                                    <Input required value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="เช่น ประธานกรรมการมูลนิธิ" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อกลุ่มบุคลากร</label>
                                    <Input required value={formData.group_name} onChange={e => setFormData({ ...formData, group_name: e.target.value })} placeholder="เช่น คณะกรรมการบริหาร" className="rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">ลำดับชั้นของกลุ่ม (1 คือบนสุด)</label>
                                    <Input required type="number" value={formData.group_level} onChange={e => setFormData({ ...formData, group_level: parseInt(e.target.value) })} className="rounded-xl h-12" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">รูปถ่ายบุคลากร</label>
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
                            <Button type="submit" disabled={loading} className="w-full mt-8 rounded-2xl bg-indigo-600 h-14 font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                {loading ? <RefreshCcw className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                {editingStaffId ? "บันทึกการแก้ไข" : "บันทึกข้อมูลบุคลากร"}
                            </Button>
                        </form>
                    )}

                    <div className="max-w-6xl mx-auto space-y-12">
                        {Object.keys(groupedStaff).sort((a, b) => parseInt(a) - parseInt(b)).map(level => (
                            <div key={level} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-indigo-50"></div>
                                    <h3 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm">
                                        ลำดับที่ {level}: {groupedStaff[parseInt(level)].name}
                                    </h3>
                                    <div className="h-[2px] flex-1 bg-indigo-50"></div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {groupedStaff[parseInt(level)].members.map((person) => (
                                        <div key={person.id} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform bg-slate-50">
                                                <img src={getPublicUrl(person.image_url)} className="w-full h-full object-cover" />
                                            </div>
                                            <h4 className="font-black text-slate-800 leading-tight">{person.name}</h4>
                                            <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1 tracking-wider">{person.position}</p>

                                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="secondary" size="icon"
                                                    onClick={() => editStaff(person)}
                                                    className="rounded-full w-8 h-8 bg-white border border-border hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="destructive" size="icon"
                                                    onClick={() => deleteStaff(person.id)}
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

export default AdminStaff;
