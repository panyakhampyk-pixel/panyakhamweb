import { Play } from "lucide-react";

const InterviewSection = () => {
    return (
        <section className="py-12 md:py-32 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20 -z-0" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                    {/* Left Column: YouTube Video */}
                    <div className="w-full lg:w-7/12 order-2 lg:order-1">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/enRq4IRzgJI"
                                title="บทสัมภาษณ์นักศึกษาทุนมูลนิธิเพื่อการศึกษาปัญญาคำ"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="w-full lg:w-5/12 order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                            <Play className="w-3 h-3 fill-current" /> บทสัมภาษณ์
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 md:mb-8 leading-tight">
                            เสียงสะท้อนจาก <span className="text-primary underline decoration-amber-500 underline-offset-8">อนาคต</span>
                        </h2>

                        <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed mb-6">
                            บทสัมภาษณ์นักศึกษาทุนมูลนิธิเพื่อการศึกษาปัญญาคำ และผู้จัดการฝ่ายทรัพยากรบุคคล
                        </p>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                บริษัท <span className="text-foreground font-black">เอ็ม เอส พี อินเตอร์ฟู้ดส์ จำกัด</span> ร่วมแบ่งปันความประทับใจและโอกาสในการพัฒนาอาชีพของนักเรียนทุนมูลนิธิฯ
                            </p>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <div className="w-12 h-1 bg-amber-500 rounded-full" />
                            <div className="w-24 h-1 bg-primary rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InterviewSection;
