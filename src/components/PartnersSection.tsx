
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Handshake } from "lucide-react";

interface Partner {
    id: string;
    name: string;
    logo_url: string;
    website_url?: string;
}

const PartnersSection = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const { data, error } = await supabase
                    .from("partners")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (error) throw error;
                setPartners(data || []);
            } catch (error) {
                console.error("Error fetching partners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    const getPublicUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return supabase.storage.from('donations').getPublicUrl(path).data.publicUrl;
    };

    if (partners.length === 0 && !loading) return null;

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        <Handshake className="w-4 h-4" />
                        ความร่วมมือทางวิชาการ
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                        พันธมิตร <span className="text-emerald-500 italic">MOU</span>
                    </h2>
                    <p className="text-slate-400 font-medium max-w-xl mx-auto uppercase text-xs tracking-widest">
                        เครือข่ายความร่วมมือกับสถานประกอบการชั้นนำเพื่อการฝึกงานและรับเข้าทำงาน
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale animate-pulse">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-40 h-20 bg-slate-100 rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-16 items-center justify-items-center transition-opacity duration-700">
                        {partners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.website_url || "#"}
                                target={partner.website_url ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className={`group relative flex flex-col items-center gap-4 transition-all duration-500 hover:scale-125 ${!partner.website_url && 'cursor-default'}`}
                            >
                                <div className="h-20 w-40 flex items-center justify-center transition-all duration-500">
                                    <img
                                        src={getPublicUrl(partner.logo_url)}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors text-center px-2">
                                    {partner.name}
                                </span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PartnersSection;
