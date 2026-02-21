import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Award, Star } from "lucide-react";

interface PrideTopic {
    id: string;
    title: string;
    description: string;
    images: PrideImage[];
}

interface PrideImage {
    id: string;
    image_url: string;
    caption: string;
}

const PrideSection = () => {
    const [topics, setTopics] = useState<PrideTopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrideData = async () => {
            try {
                const { data: topicsData, error } = await supabase
                    .from("pride_topics")
                    .select("*, pride_images(*)")
                    .order("sort_order", { ascending: true });

                if (error) throw error;

                if (topicsData) {
                    const formatted = topicsData.map(topic => ({
                        ...topic,
                        images: (topic.pride_images || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                    }));
                    setTopics(formatted);
                }
            } catch (error) {
                console.error("Error fetching pride data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrideData();
    }, []);

    if (topics.length === 0 && !loading) return null;

    return (
        <section className="py-12 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-20 animate-in fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-amber-100">
                        <Trophy className="w-3 h-3 fill-current" /> Our Achievements
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 md:mb-6">
                        ความภาคภูมิใจ <span className="text-primary">ของพวกเรา</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        รวบรวมภาพความประทับใจและความสำเร็จที่พวกเราได้ร่วมแรงร่วมใจกันสร้างขึ้น
                        เพื่อสร้างโอกาสและอนาคตที่สดใสให้กับเยาวชน
                    </p>
                </div>

                <div className="space-y-24">
                    {topics.map((topic) => (
                        <div key={topic.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                            {/* Topic Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
                                <div className="max-w-2xl">
                                    <h3 className="text-3xl font-black text-foreground mb-3 flex items-center gap-3">
                                        <span className="w-10 h-1 bg-primary rounded-full"></span>
                                        {topic.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {topic.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    {topic.images.length} Proud Moments
                                </div>
                            </div>

                            {/* Image Grid for this Topic - 2 columns on mobile */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6">
                                {topic.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative group overflow-hidden rounded-xl md:rounded-[2.5rem] border-2 md:border-4 border-white shadow-md md:shadow-xl hover:shadow-2xl transition-all duration-500 aspect-square md:aspect-[4/3]"
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={topic.title}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Hover Overlay - hidden on extra small mobile for clarity if needed, or kept simple */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-2 md:p-8">
                                            <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <Award className="w-3 h-3 md:w-5 md:h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Call to Action Hint */}
                {topics.length > 0 && (
                    <div className="mt-32 text-center">
                        <div className="inline-flex items-center gap-3 p-2 bg-slate-50 rounded-full border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <p className="text-sm text-muted-foreground font-semibold pr-4">
                                "ทุกภาพบอกเล่าเรื่องราวความสำเร็จที่เราภาคภูมิใจ"
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PrideSection;
