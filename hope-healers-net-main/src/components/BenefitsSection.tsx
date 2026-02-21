
import { Home, Globe, Utensils, Shirt, Book, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
    {
        icon: Home,
        title: "หอพักฟรี",
        description: "รวมค่าน้ำ + ค่าไฟ",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Globe,
        title: "อินเทอร์เน็ตฟรี",
        description: "ใช้งานได้ตลอด 24 ชั่วโมง",
        color: "bg-sky-50 text-sky-600",
    },
    {
        icon: Utensils,
        title: "อาหารฟรี 3 มื้อ",
        description: "ดูแลเรื่องโภชนาการทุกวัน",
        color: "bg-amber-50 text-amber-600",
    },
    {
        icon: Shirt,
        title: "ชุดเครื่องแบบฟรี",
        description: "ชุดนักศึกษา, ชุดช็อป, ชุดพละ, เสื้อชมรม",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: Book,
        title: "อุปกรณ์การเรียนฟรี",
        description: "รวมหนังสือเรียนและอุปกรณ์ต่างๆ",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        icon: CreditCard,
        title: "บัตรนักศึกษา",
        description: "ออกบัตรประจำตัวนักศึกษาให้ฟรี",
        color: "bg-slate-50 text-slate-600",
    },
    {
        icon: ShieldCheck,
        title: "ประกันอุบัติเหตุฟรี",
        description: "ดูแลความปลอดภัยตลอดการศึกษา",
        color: "bg-rose-50 text-rose-600",
    },
];

const BenefitsSection = () => {
    return (
        <section className="py-16 md:py-28 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-emerald-100">
                        <Sparkles className="w-3 h-3" /> Welfare & Benefits
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        สวัสดิการสำหรับ <span className="text-emerald-500">นักเรียนทุน</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                        ดูแลครบวงจรเพื่อให้รเรียนสามารถโฟกัสกับการศึกษาได้อย่างเต็มที่ โดยไม่มีภาระค่าใช้จ่าย
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group p-6 md:p-8 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <benefit.icon className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}

                    {/* Support Badge Card */}
                    <div className="col-span-2 lg:col-span-1 bg-emerald-600 rounded-[2rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-emerald-200">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <p className="text-lg font-bold">ดูแลด้วยหัวใจ</p>
                        <p className="text-xs text-emerald-100 opacity-80 mt-2">เพื่อให้เยาวชนไทยมีอนาคตที่สดใส</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
