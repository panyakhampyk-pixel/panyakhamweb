import { GraduationCap, FileText, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "กรอกใบสมัคร",
    description: "กรอกข้อมูลใบสมัครขอรับทุนการศึกษาผ่านช่องทางออนไลน์หรือติดต่อมูลนิธิโดยตรง",
  },
  {
    icon: CheckCircle,
    step: "2",
    title: "พิจารณาคุณสมบัติ",
    description: "คณะกรรมการพิจารณาคุณสมบัติและความเหมาะสมของผู้สมัคร",
  },
  {
    icon: GraduationCap,
    step: "3",
    title: "รับทุนการศึกษา",
    description: "เข้าศึกษาที่วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย พร้อมสวัสดิการครบถ้วน",
  },
];

const ScholarshipSection = () => {
  return (
    <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Column: Scholarship Info */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
              Scholarship 2026
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
              รับสมัครนักเรียนทุน <br />
              <span className="text-primary">มูลนิธิปัญญาคำ ปี 2569</span>
            </h2>

            <p className="text-2xl font-bold text-amber-600 mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6" /> ทุนเรียนฟรี! ที่พักฟรี! สวัสดิการครบถ้วน
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-warm-gradient hover:opacity-90 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-amber-500/20">
                <Link to="/scholarship-apply">สมัครขอรับทุนออนไลน์</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-slate-200 px-10 py-7 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
                <Link to="/contact">สอบถามเพิ่มเติม</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] transform rotate-3 scale-105 -z-10 transition-transform group-hover:rotate-6"></div>

              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white">
                <img
                  src="/picture/ขอรับทุน.jpg"
                  alt="ภาพขอรับทุนการศึกษา"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Opportunity</p>
                      <p className="text-sm font-black text-foreground">เปิดรับสมัครแล้ววันนี้</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ScholarshipSection;
