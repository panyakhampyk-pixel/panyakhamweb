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
    <section className="py-12 md:py-28 bg-rose-50/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-rose-100">
            <Sparkles className="w-3 h-3" /> Giving Opportunities
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 md:mb-6 leading-tight">โครงการและกิจกรรม</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            ร่วมเป็นส่วนหนึ่งของโครงการ มองโอกาสทางการศึกษา และพัฒนาคุณภาพชีวิตที่ดีขึ้นอย่างยั่งยืน
          </p>
        </div>

        {/* Horizontally Scrollable Images */}
        {images.length > 0 && (
          <div className="mb-12 md:mb-20 -mx-6 overflow-hidden relative">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 md:pb-8 snap-x snap-mandatory scrollbar-hide px-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="w-[260px] md:w-[480px] aspect-[16/10] shrink-0 snap-center rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white shadow-xl md:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                >
                  <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <project.icon className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{project.category}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-xs md:text-base text-muted-foreground leading-relaxed font-medium line-clamp-2 md:line-clamp-none">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ProjectsSection;
