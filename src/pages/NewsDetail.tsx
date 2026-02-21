import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ChevronLeft, Tag as TagIcon, Facebook, Share2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
    id: string;
    title: string;
    category: string;
    content: string;
    published_at: string;
    news_images: { image_url: string }[];
}

const NewsDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState<string>("");

    useEffect(() => {
        const fetchNewsDetail = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("news")
                .select(`
          *,
          news_images (image_url)
        `)
                .eq("id", id)
                .single();

            if (data) {
                setItem(data);
                if (data.news_images?.length > 0) {
                    setActiveImg(data.news_images[0].image_url);
                }
            }
            setLoading(false);
        };

        if (id) fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">ไม่พบข่าวสารที่คุณต้องการ</h2>
                <Button asChild><Link to="/">กลับหน้าหลัก</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> กลับหน้าหลัก
                    </Link>

                    {/* Header */}
                    <header className="mb-10 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase letter-spacing-widest">
                                {item.category}
                            </span>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(item.published_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                            {item.title}
                        </h1>
                    </header>

                    {/* Gallery / Featured Image */}
                    <div className="space-y-4 mb-12">
                        <div className="aspect-[16/9] lg:aspect-[21/9] rounded-[2rem] overflow-hidden bg-accent shadow-2xl">
                            <img src={activeImg || "/placeholder.jpg"} className="w-full h-full object-cover" alt={item.title} />
                        </div>

                        {item.news_images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {item.news_images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(img.image_url)}
                                        className={`relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${activeImg === img.image_url ? 'border-primary scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img.image_url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-3">
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed">
                                {/* แสดงเนื้อหาข่าว (รองรับการขึ้นบรรทัดใหม่) */}
                                {item.content?.split('\n').map((line, i) => (
                                    <p key={i} className="mb-6 text-lg leading-loose text-foreground/80">
                                        {line}
                                    </p>
                                )) || <p className="italic text-muted-foreground">ไม่มีข้อมูลเนื้อหา</p>}
                            </div>
                        </div>

                        {/* Sidebar / Share */}
                        <aside className="lg:col-span-1 space-y-8">
                            <div className="bg-card border border-border rounded-3xl p-6 sticky top-24 shadow-sm">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-primary" /> แชร์ข่าวสารนี้
                                </h4>
                                <div className="flex flex-col gap-3">
                                    <Button variant="outline" className="w-full justify-start gap-3 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]">
                                        <Facebook className="w-4 h-4 fill-current" /> Facebook
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start gap-3">
                                        <ImageIcon className="w-4 h-4" /> บันทึกรูปภาพ
                                    </Button>
                                </div>
                                <hr className="my-6 border-border" />
                                <div className="text-xs text-muted-foreground leading-relaxed">
                                    มูลนิธิเพื่อการศึกษาปัญญาคำ <br />
                                    มอบโอกาสทางการศึกษา เพื่ออนาคตที่ดีกว่า
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetail;
