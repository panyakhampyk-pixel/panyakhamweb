import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Contact = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-indigo-900 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">ติดต่อเรา</h1>
                <p className="text-indigo-200 mt-4 max-w-2xl mx-auto">สอบถามข้อมูลเพิ่มเติมหรือต้องการร่วมเป็นส่วนหนึ่งของการให้</p>
            </div>
            <ContactSection />
            <Footer />
        </div>
    );
};

export default Contact;
