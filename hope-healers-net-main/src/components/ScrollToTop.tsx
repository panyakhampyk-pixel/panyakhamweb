
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 overflow-hidden ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
            <Button
                onClick={scrollToTop}
                size="icon"
                className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-xl text-slate-800 border border-white/40 shadow-xl shadow-black/5 hover:bg-white/60 hover:shadow-black/10 hover:-translate-y-1 transition-all active:scale-90"
                aria-label="Scroll to top"
            >
                <ChevronUp className="w-6 h-6" />
            </Button>
        </div>
    );
};

export default ScrollToTop;
