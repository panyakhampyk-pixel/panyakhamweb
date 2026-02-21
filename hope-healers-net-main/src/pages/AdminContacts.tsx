import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import {
    Mail, Search, Trash2, Eye,
    CheckCircle2, Clock, Inbox,
    User, Calendar, MessageSquare, Menu,
    X, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

const AdminContacts = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            toast({ variant: "destructive", title: "โหลดข้อมูลไม่สำเร็จ", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("contact_messages")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
            if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, status: newStatus });

            toast({ title: "อัปเดตสถานะแล้ว" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ไม่สำเร็จ", description: error.message });
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("ต้องการลบข้อความนี้ใช่หรือไม่?")) return;
        try {
            const { error } = await supabase.from("contact_messages").delete().eq("id", id);
            if (error) throw error;
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMsg?.id === id) setSelectedMsg(null);
            toast({ title: "ลบข้อความเรียบร้อย" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "ลบไม่สำเร็จ", description: error.message });
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-10 transition-all">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Inbox className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground uppercase tracking-tight">ข้อความติดต่อ</h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Inbound Contact Messages</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-hidden flex flex-col lg:flex-row gap-8">
                    {/* List Section */}
                    <div className="lg:w-[400px] flex flex-col gap-6 flex-shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="ค้นหาชื่อหรือหัวข้อ..."
                                className="pl-12 h-14 bg-white border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {loading ? (
                                <div className="p-10 text-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-border mt-10">
                                    <Mail className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-50">ไม่มีข้อความ</p>
                                </div>
                            ) : (
                                filteredMessages.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMsg(m)}
                                        className={`w-full p-5 rounded-3xl border text-left transition-all ${selectedMsg?.id === m.id
                                                ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20 text-white"
                                                : "bg-white border-border hover:border-blue-200"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${selectedMsg?.id === m.id ? 'bg-white/20' :
                                                    m.status === 'unread' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {m.status === 'unread' ? 'ยังไม่ได้อ่าน' : 'อ่านแล้ว'}
                                            </span>
                                            <span className={`text-[10px] font-bold ${selectedMsg?.id === m.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                {new Date(m.created_at).toLocaleDateString('th-TH')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold truncate">{m.name}</h4>
                                        <p className={`text-xs mt-1 truncate ${selectedMsg?.id === m.id ? 'text-white/70' : 'text-muted-foreground font-medium'}`}>
                                            {m.subject}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 min-w-0">
                        {selectedMsg ? (
                            <div className="h-full flex flex-col bg-white border border-border rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <div className="p-8 border-b border-border flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-transparent">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
                                            <User className="w-7 h-7 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-foreground">{selectedMsg.name}</h2>
                                            <a href={`mailto:${selectedMsg.email}`} className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                                                <Mail className="w-3 h-3" /> {selectedMsg.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedMsg.status === 'unread' && (
                                            <Button onClick={() => updateStatus(selectedMsg.id, 'read')} variant="outline" className="rounded-xl gap-2 font-bold border-blue-200 hover:bg-blue-50">
                                                <CheckCircle2 className="w-4 h-4" /> ทำเครื่องหมายว่าอ่านแล้ว
                                            </Button>
                                        )}
                                        <Button onClick={() => deleteMessage(selectedMsg.id)} variant="ghost" className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 block">หัวข้อติดต่อ (Subject)</span>
                                        <h3 className="text-2xl font-black text-slate-800 leading-tight bg-slate-50 p-6 rounded-[2rem] border border-blue-50">
                                            {selectedMsg.subject}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> เนื้อหาข้อความ (Message Content)
                                        </span>
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-inner-sm min-h-[200px] text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                                            {selectedMsg.message}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full border border-border">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-bold text-slate-600">ส่งเมื่อ: {new Date(selectedMsg.created_at).toLocaleString('th-TH')}</span>
                                        </div>
                                        <a href={`mailto:${selectedMsg.email}?subject=ตอบกลับเรื่อง: ${selectedMsg.subject}`} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                                            <ExternalLink className="w-4 h-4" />
                                            <span className="text-sm font-black uppercase tracking-wider">ตอบกลับทางอีเมล</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-white border border-dashed border-border rounded-[2.5rem]">
                                <div className="w-20 h-20 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-black text-muted-foreground/50 uppercase tracking-widest">เลือกข้อความเพื่อดูรายละเอียด</h3>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminContacts;
