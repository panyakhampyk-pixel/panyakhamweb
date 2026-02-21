import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";

const Programs = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-indigo-900 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">ส่งมอบโอกาส</h1>
                <p className="text-indigo-200 mt-4 max-w-2xl mx-auto">โครงการและกิจกรรมต่างๆ ที่เรามุ่งเน้นเพื่อพัฒนาการศึกษาและคุณภาพชีวิต</p>
            </div>
            <ProjectsSection />
            <Footer />
        </div>
    );
};

export default Programs;
