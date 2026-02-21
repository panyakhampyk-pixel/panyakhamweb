import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, ChevronRight, Home } from "lucide-react";

interface StaffMember {
    id: string;
    name: string;
    position: string;
    image_url: string;
    group_name: string;
    group_level: number;
}

const Staff = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            const { data, error } = await supabase
                .from("staff")
                .select("*")
                .order("group_level", { ascending: true })
                .order("sort_order", { ascending: true });

            if (!error && data) {
                setStaff(data);
            }
            setLoading(false);
        };
        fetchStaff();
    }, []);

    const groupedStaff = staff.reduce((acc, current) => {
        const level = current.group_level;
        if (!acc[level]) acc[level] = { name: current.group_name, members: [] };
        acc[level].members.push(current);
        return acc;
    }, {} as Record<number, { name: string; members: StaffMember[] }>);

    const getPublicUrl = (path: string) => {
        if (!path) return "/placeholder-staff.png";
        return supabase.storage.from('donations').getPublicUrl(path).data.publicUrl;
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-32 pb-20 bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                        <Users className="w-4 h-4" />
                        มูลนิธิเพื่อการศึกษาปัญญาคำ
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                        ทำเนียบ <span className="text-indigo-300 italic">บุคลากร</span>
                    </h1>
                    <p className="text-indigo-100/70 max-w-2xl mx-auto leading-relaxed text-lg font-medium">
                        บุคลากรและคณะกรรมการผู้ทรงคุณวุฒิที่ร่วมผลักดันและสนับสนุน
                        โอกาสทางการศึกษาให้กับเยาวชนในพื้นที่ห่างไกล
                    </p>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <a href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" /> หน้าหลัก
                    </a>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                    <span className="text-foreground font-bold">ทำเนียบบุคลากร</span>
                </div>
            </div>

            {/* Staff List */}
            <main className="py-24 container mx-auto px-4 min-h-[60vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-muted-foreground animate-pulse">กำลังโหลดข้อมูลบุคลากร...</p>
                    </div>
                ) : staff.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-border">
                        <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-muted-foreground">ไม่พบข้อมูลบุคลากร</h3>
                        <p className="text-sm text-muted-foreground/60 mt-2">โปรดจัดการข้อมูลที่หน้าแอดมิน</p>
                    </div>
                ) : (
                    <div className="space-y-32">
                        {Object.keys(groupedStaff).sort((a, b) => parseInt(a) - parseInt(b)).map((level) => {
                            const group = groupedStaff[parseInt(level)];
                            const isFirstLevel = level === "1";

                            return (
                                <div key={level} className="space-y-16">
                                    {/* Group Header */}
                                    <div className="relative text-center">
                                        <h2 className={`relative z-10 font-black uppercase tracking-[0.2em] inline-block px-10 py-3 rounded-full bg-white border border-border shadow-sm ${isFirstLevel ? 'text-2xl text-indigo-600' : 'text-lg text-slate-800'
                                            }`}>
                                            {group.name}
                                        </h2>
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -z-0"></div>
                                    </div>

                                    {/* Members Grid */}
                                    <div className={`flex flex-wrap justify-center gap-x-12 gap-y-20`}>
                                        {group.members.map((person) => (
                                            <div
                                                key={person.id}
                                                className={`flex flex-col items-center text-center group ${isFirstLevel ? 'max-w-[300px]' : 'max-w-[240px]'
                                                    }`}
                                            >
                                                {/* Circular Image Container */}
                                                <div className={`relative mb-8 transition-all duration-500 group-hover:scale-105 ${isFirstLevel ? 'w-56 h-56' : 'w-44 h-44'
                                                    }`}>
                                                    {/* Decorative Ring */}
                                                    <div className="absolute inset-0 rounded-full border-2 border-indigo-100 scale-110 group-hover:scale-115 transition-transform duration-500"></div>
                                                    <div className="absolute inset-0 rounded-full border border-indigo-500 scale-125 opacity-0 group-hover:opacity-20 group-hover:scale-135 transition-all duration-700"></div>

                                                    {/* The Image */}
                                                    <div className="w-full h-full rounded-full overflow-hidden border-[8px] border-white shadow-2xl relative z-10 bg-slate-100">
                                                        <img
                                                            src={getPublicUrl(person.image_url)}
                                                            alt={person.name}
                                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Text Info */}
                                                <div className="space-y-2 px-4">
                                                    <h4 className={`font-black text-slate-900 leading-tight ${isFirstLevel ? 'text-2xl' : 'text-xl'
                                                        }`}>
                                                        {person.name}
                                                    </h4>
                                                    <p className={`font-bold text-indigo-600 uppercase tracking-widest ${isFirstLevel ? 'text-sm' : 'text-xs'
                                                        }`}>
                                                        {person.position}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Staff;
