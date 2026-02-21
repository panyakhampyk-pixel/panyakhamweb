import { MapPin, Phone, Mail, Clock, Send, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ContactSection = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "ส่งข้อความสำเร็จ",
        description: "เราได้รับข้อความของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด"
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่ภายหลัง"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-12 md:py-28 bg-section-gradient overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs md:text-sm font-medium text-secondary uppercase tracking-widest mb-2 md:mb-3">ติดต่อ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ติดต่อเรา</h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, label: "ที่อยู่", text: "199 ม.5 ต.เวียงยอง อ.เมืองลำพูน จ.ลำพูน 51000" },
              { icon: Phone, label: "โทรศัพท์", text: "064-073-7959" },
              { icon: Mail, label: "อีเมล", text: "panyakham@gmail.com" },
              { icon: Clock, label: "เวลาทำการ", text: "จันทร์ - ศุกร์ 08:30 - 17:00 น." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-accent flex items-center justify-center transition-colors hover:bg-indigo-100">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}

            <div className="w-full h-48 bg-muted rounded-2xl border border-border flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all">
              <p className="text-sm text-muted-foreground font-bold italic">Google Maps Integration</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-border rounded-[2rem] p-8 space-y-5 shadow-xl shadow-indigo-500/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground ml-2">ชื่อ-นามสกุล</label>
                <Input
                  placeholder="ชื่อของคุณ"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl h-12 bg-slate-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground ml-2">อีเมล</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl h-12 bg-slate-50/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-2">เรื่อง</label>
              <Input
                placeholder="หัวข้อที่ต้องการติดต่อ"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="rounded-xl h-12 bg-slate-50/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-2">ข้อความ</label>
              <Textarea
                placeholder="รายละเอียด..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="rounded-2xl bg-slate-50/50 resize-none"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl shadow-lg shadow-indigo-200 text-lg font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={sending}>
              {sending ? <RefreshCcw className="animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
              {sending ? "กำลังส่ง..." : "ส่งข้อความ"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
