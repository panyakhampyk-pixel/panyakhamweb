import { Target, Eye, BookOpen, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

const values = [
  {
    icon: Eye,
    title: "วิสัยทัศน์",
    description: "เสริมสร้างโอกาสทางการศึกษาเพื่อพัฒนาคุณภาพชีวิต ของนักเรียนในพื้นที่ภาคเหนือที่ขาดโอกาส",
  },
  {
    icon: Target,
    title: "วัตถุประสงค์",
    description: "สนับสนุนทุนการศึกษา อาหาร ที่พัก และอุปกรณ์การเรียนให้กับเด็กในพื้นที่สูงและห่างไกล",
  },
  {
    icon: BookOpen,
    title: "สถานศึกษา",
    description: "มอบทุนการศึกษาให้กับนักเรียนผ่าน \"วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย\"",
  },
  {
    icon: Home,
    title: "สวัสดิการ",
    description: "อาหารฟรี 3 มื้อ ที่พัก อุปกรณ์การเรียน หนังสือเรียน ให้กับนักเรียนทุนทุกคน",
  },
];

const AboutSection = () => {
  const [stats, setStats] = useState([
    { number: "500+", label: "รับทุนการศึกษา" },
    { number: "300+", label: "จบการศึกษา" },
    { number: "250+", label: "ติดตามมีงานทำ" },
    { number: "100+", label: "ครั้งที่ช่วยเหลือ" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("id", "statistics")
        .single();

      if (data && data.value) {
        setStats(data.value);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-12 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mb-12 md:mb-20">
          {/* Left Column: Text Content */}
          <div className="lg:w-7/12 order-2 lg:order-1">
            <div className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
              เกี่ยวกับ
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 md:mb-8 leading-tight">
              มูลนิธิเพื่อการศึกษา <span className="text-primary">ปัญญาคำ</span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                เสริมสร้างโอกาสทางการศึกษาเพื่อพัฒนาคุณภาพชีวิต ของนักเรียน โดยผู้ก่อตั้ง <span className="text-foreground font-semibold">รศ.ดร.สายพิณ ปัญญาคำ</span> โดยร่วมกับมูลนิธิเจ้าสมพงศ์ ณ เชียงใหม่ เพื่อสนับสนุนค่าเทอมได้ก่อตั้งมูลนิธิโดย รศ.ดร.สายพิณ ปัญญาคำ
              </p>
              <p>
                มีวัตถุประสงค์โดยได้เล็งเห็นปัญหา เด็กในพื้นที่ภาคเหนือส่วนใหญ่ ที่อาศัยพื้นที่สูง และห่างไกล ขาดโอกาสทางการศึกษา และขาดแคลนทุนทรัพย์ ดังนั้นมูลนิธิเพื่อการศึกษาปัญญาคำ ได้ทำการสนับสนุนทุนการศึกษา
              </p>
              <div className="p-6 bg-primary/5 border-l-4 border-primary rounded-r-2xl">
                <p className="font-medium text-foreground">
                  และสวัสดิการ อาหารฟรี 3 มื้อ ที่พัก อุปกรณ์การเรียน หนังสือเรียน ให้กับนักเรียนทุกคน โดยทุนการศึกษาทางมูลนิธิมอบให้แก่
                </p>
                <p className="text-2xl font-black text-primary mt-2">
                  "วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Logo Image (No Text, Massive Size) */}
          <div className="lg:w-5/12 order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-[180px] lg:max-w-[450px] aspect-square flex items-center justify-center">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-blue-gradient opacity-30 filter blur-3xl animate-pulse"></div>

              {/* Logo Image */}
              <div className="relative z-10 w-full h-full transform hover:scale-110 transition-transform duration-700 ease-out drop-shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                <img
                  src="/favicon.ico"
                  alt="Logo มูลนิธิเพื่อการศึกษาปัญญาคำ"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values and Stats - 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-20">
          {values.map((item) => (
            <div
              key={item.title}
              className="bg-card/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-8 border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-warm-gradient transition-colors">
                <item.icon className="w-5 h-5 md:w-7 md:h-7 text-secondary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-3">{item.title}</h3>
              <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tighter">
                {stat.number}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
