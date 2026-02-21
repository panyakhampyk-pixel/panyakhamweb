import Navbar from "@/components/Navbar";
import ScholarshipSection from "@/components/ScholarshipSection";
import Footer from "@/components/Footer";

const ScholarshipPage = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-primary/5 py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-gradient opacity-10 filter blur-3xl -z-10 transform scale-150"></div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">ขอรับทุนการศึกษา</h1>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">ร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลง และสร้างโอกาสทางการศึกษาให้กับตนเอง</p>
            </div>
            <ScholarshipSection />
            <Footer />
        </div>
    );
};

export default ScholarshipPage;
