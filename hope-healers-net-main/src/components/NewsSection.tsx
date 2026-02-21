import { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  published_at: string;
  image_count: number;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select(`
          *,
          news_images (image_url)
        `)
        .order("published_at", { ascending: false })
        .limit(6);

      const formattedNews = data?.map((item: any) => ({
        ...item,
        image_url: item.news_images?.[0]?.image_url || "/placeholder.jpg",
        image_count: item.news_images?.length || 0
      })) || [];

      setNews(formattedNews);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-section-gradient overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-secondary font-bold tracking-widest uppercase text-sm mb-3">อัพเดทข่าวสาร</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">ข่าวสารและกิจกรรมล่าสุด</h2>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group">
            ดูข่าวสารทั้งหมด <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-hidden pb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-[2rem] h-[340px] w-[280px] md:w-[320px] shrink-0 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {news.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                className="w-[280px] md:w-[320px] shrink-0 snap-start bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-accent">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-primary font-bold text-[9px] uppercase shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3 font-medium">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 opacity-80">
                    {item.excerpt}
                  </p>
                </div>
              </article>
            ))}

            {news.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground italic">ขณะนี้ยังไม่มีข่าวสารใหม่ กรุณาติดตามเร็วๆ นี้</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
