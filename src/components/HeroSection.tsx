import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import heroImg from "@/assets/hero-charity.jpg";

interface Slide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  description?: string;
  button1_text?: string;
  button1_link?: string;
  button2_text?: string;
  button2_link?: string;
}

const HeroSection = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from("slider_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setSlides(data);
    };
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 8000);
      return () => clearInterval(timer);
    }
  }, [slides.length, nextSlide]);

  const currentSlide = (slides[current] || {}) as Slide;

  return (
    <section className="relative h-[500px] md:h-[800px] w-full overflow-hidden bg-background group">
      {/* Background Slides / Fallback */}
      <div className="absolute inset-0 w-full h-full">
        {slides.length > 0 ? (
          slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current ? "opacity-100 scale-105 z-0" : "opacity-0 scale-100 z-[-1]"
                }`}
            >
              <img
                src={slide.image_url}
                alt="สไลด์พื้นหลัง"
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <img
            src={heroImg}
            alt="นักเรียนทุนมูลนิธิเพื่อการศึกษาปัญญาคำ"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 z-20 flex gap-2 w-full justify-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1 transition-all duration-300 rounded-full ${idx === current ? "w-6 bg-amber-500" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
        {/* Title */}
        <h1 key={`t-${current}`} className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-2 animate-fade-in-up max-w-4xl tracking-tight leading-tight">
          {currentSlide.title || "มูลนิธิเพื่อการศึกษาปัญญาคำ"}
        </h1>

        {/* Subtitle */}
        <p key={`st-${current}`} className="text-lg md:text-3xl text-amber-400 mb-4 md:mb-6 animate-fade-in-up font-medium" style={{ animationDelay: "0.1s" }}>
          {currentSlide.subtitle || "มอบโอกาสทางการศึกษา พัฒนาคุณภาพชีวิตที่ดีขึ้น"}
        </p>

        {/* Description - Hiden on Mobile */}
        <p key={`d-${current}`} className="hidden md:block text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
          {currentSlide.description || "สร้างสรรค์สังคม ชีวิตที่มีคุณภาพ ผ่านโครงการทุนการศึกษาให้เด็กในพื้นที่ห่างไกล"}
        </p>

        {/* Centered Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Button size="lg" asChild className="bg-warm-gradient hover:scale-105 transition-transform text-white text-base md:text-lg px-8 md:px-10 py-5 md:py-7 rounded-full shadow-lg border-none min-w-[180px] md:min-w-[200px]">
            <a
              href={currentSlide.button1_link || "/donate"}
              target={currentSlide.button1_link?.startsWith('http') ? "_blank" : undefined}
              rel={currentSlide.button1_link?.startsWith('http') ? "noopener noreferrer" : undefined}
            >
              <Heart className="w-5 h-5 mr-2" />
              {currentSlide.button1_text || "ร่วมบริจาค"}
            </a>
          </Button>

          {(currentSlide.button2_text || !slides.length) && (
            <Button size="lg" variant="outline" asChild className="border-2 border-white/40 text-white hover:bg-white/10 hover:scale-105 transition-all text-base md:text-lg px-8 md:px-10 py-5 md:py-7 rounded-full backdrop-blur-sm min-w-[180px] md:min-w-[200px]">
              <a
                href={currentSlide.button2_link || "/scholarship"}
                target={currentSlide.button2_link?.startsWith('http') ? "_blank" : undefined}
                rel={currentSlide.button2_link?.startsWith('http') ? "noopener noreferrer" : undefined}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                {currentSlide.button2_text || "ขอรับทุนการศึกษา"}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
