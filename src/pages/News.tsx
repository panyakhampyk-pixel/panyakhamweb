import Navbar from "@/components/Navbar";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const News = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            <Navbar />
            <div className="bg-indigo-900 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">ข่าวสารและกิจกรรม</h1>
                <p className="text-indigo-200 mt-4 max-w-2xl mx-auto">ติดตามความเคลื่อนไหวและเรื่องราวความประทับใจจากพื้นที่ต่างๆ</p>
            </div>
            <NewsSection />
            <Footer />
        </div>
    );
};

export default News;
