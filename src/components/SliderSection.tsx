import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    sort_order: number;
}

const SliderSection = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from("slider_images")
                .select("*")
                .order("sort_order", { ascending: true });
            if (data && data.length > 0) setSlides(data);
            setLoading(false);
        };
        fetchSlides();
    }, []);

    const prev = useCallback(() => {
        setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
    }, [slides.length]);

    const next = useCallback(() => {
        setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
    }, [slides.length]);

    // Auto-play
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [slides.length, next]);

    if (loading) {
        return (
            <div className="w-full h-64 md:h-96 bg-muted animate-pulse rounded-xl" />
        );
    }

    if (slides.length === 0) return null;

    return (
        <section className="w-full overflow-hidden relative">
            {/* Slides */}
            <div className="relative w-full h-64 sm:h-80 md:h-[480px] lg:h-[560px]">
                {slides.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <img
                            src={slide.image_url}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* Caption */}
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-20">
                                {slide.title && (
                                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold drop-shadow mb-2">
                                        {slide.title}
                                    </h2>
                                )}
                                {slide.subtitle && (
                                    <p className="text-sm md:text-base text-white/80 drop-shadow max-w-xl">
                                        {slide.subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Arrows */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                            aria-label="ก่อนหน้า"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                            aria-label="ถัดไป"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`rounded-full transition-all duration-300 ${idx === current
                                        ? "w-6 h-2 bg-white"
                                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`สไลด์ ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SliderSection;
