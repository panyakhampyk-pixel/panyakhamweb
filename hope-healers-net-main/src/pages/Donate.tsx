import Navbar from "@/components/Navbar";
import DonateSection from "@/components/DonateSection";
import Footer from "@/components/Footer";

const Donate = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-primary/5 py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-gradient opacity-10 filter blur-3xl -z-10 transform scale-150"></div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">ร่วมบริจาค</h1>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">ทุกการแบ่งปันของคุณ คือการสร้างโอกาสที่ยิ่งใหญ่ให้กับเด็กๆ</p>
            </div>
            <DonateSection />
            <Footer />
        </div>
    );
};

export default Donate;
