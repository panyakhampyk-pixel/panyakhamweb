import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Heart, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const projects = [
  {
    icon: GraduationCap,
    category: "ทุนการศึกษา",
    title: "การมอบทุนการศึกษา",
    description: "มอบทุนการศึกษาให้กับนักเรียนนักศึกษา ทุนเรียนฟรี ที่พักฟรี สำหรับปีการศึกษา 2569",
    status: "รับสมัคร",
  },
  {
    icon: Building,
    category: "ความร่วมมือ",
    title: "ลงนาม MOU กับภาคเอกชน",
    description: "ร่วมกับบริษัท ทีเอ็นแอลเอ๊กซ์ จำกัด สาขาลำพูน ลงนามบันทึกข้อตกลงความร่วมมือด้านการจัดการศึกษาในระบบทวิภาคี",
    status: "ดำเนินการ",
  },
  {
    icon: Heart,
    category: "มอบโอกาส",
    title: "พัฒนาสังคมให้ยั่งยืน",
    description: "ช่วยเหลือและพัฒนาสังคมให้ยั่งยืน ส่งเสริมและพัฒนาศักยภาพนักเรียนให้พร้อมสู่ตลาดแรงงานอย่างมีคุณภาพ",
    status: "ดำเนินการ",
  },
  {
    icon: Briefcase,
    category: "อาชีวศึกษา",
    title: "วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย",
    description: "สนับสนุนการศึกษาสายอาชีพ อาหารฟรี 3 มื้อ ที่พัก อุปกรณ์การเรียน หนังสือเรียน ให้กับนักเรียนทุกคน",
    status: "ดำเนินการ",
  },
];

interface ProgramImage {
  id: string;
  image_url: string;
}

const ProjectsSection = () => {
  const [images, setImages] = useState<ProgramImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from("program_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-rose-50/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-rose-100">
            <Sparkles className="w-3 h-3" /> Giving Opportunities
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">โครงการและกิจกรรม</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            ร่วมเป็นส่วนหนึ่งของโครงการ มองโอกาสทางการศึกษา และพัฒนาคุณภาพชีวิตที่ดีขึ้นอย่างยั่งยืน
          </p>
        </div>

        {/* Continuous Scrolling Marquee */}
        {images.length > 0 && (
          <div className="mb-20 -mx-4 overflow-hidden relative group">
            <div className="flex gap-4 animate-marquee whitespace-nowrap">
              {/* Double the images for seamless loop */}
              {[...images, ...images, ...images].map((img, idx) => (
                <div
                  key={`${img.id}-${idx}`}
                  className="w-72 md:w-96 aspect-[16/10] shrink-0 rounded-3xl overflow-hidden border-4 border-white shadow-xl transform transition-transform group-hover:scale-105 duration-500"
                >
                  <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <project.icon className="w-8 h-8 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{project.category}</span>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 uppercase">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-12 py-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
            <a href="/programs">ดูโครงการทั้งหมด</a>
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default ProjectsSection;
