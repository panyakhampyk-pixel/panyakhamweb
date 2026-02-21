import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const About = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-indigo-900 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">เกี่ยวกับเรา</h1>
                <p className="text-indigo-200 mt-4 max-w-2xl mx-auto">รู้จักมูลนิธิเพื่อการศึกษาปัญญาคำและพันธกิจในการสร้างอนาคตให้กับเด็กไทย</p>
            </div>
            <AboutSection />
            <Footer />
        </div>
    );
};

export default About;
