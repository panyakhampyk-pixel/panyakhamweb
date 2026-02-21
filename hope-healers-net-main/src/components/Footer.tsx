import { GraduationCap, LogIn, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  const navItems = [
    { label: "เกี่ยวกับ", href: "/about" },
    { label: "ร่วมบริจาค", href: "/donate" },
    { label: "ขอรับทุน", href: "/scholarship" },
    { label: "โครงการ", href: "/programs" },
    { label: "ข่าวสาร", href: "/news" },
    { label: "ติดต่อคง", href: "/contact" },
  ];

  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warm-gradient flex items-center justify-center transform rotate-3">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">มูลนิธิเพื่อการศึกษาปัญญาคำ</span>
            </div>
            <p className="text-primary-foreground/60 leading-relaxed max-w-md text-base font-medium">
              มอบโอกาสทางการศึกษา พัฒนาคุณภาพชีวิตที่ดีขึ้น สร้างสรรค์สังคม ชีวิตที่มีคุณภาพ และสร้างรากฐานที่มั่นคงให้เยาวชนไทยอย่างยั่งยืน
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">ลิงก์ด่วน</h4>
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-sm font-medium text-primary-foreground/60 hover:text-white transition-all hover:translate-x-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">ติดต่อมููลนิธิ</h4>
            <div className="space-y-4 text-sm font-medium text-primary-foreground/60">
              <p className="flex items-start gap-2">ที่อยู่: 199 ม.5 ต.เวียงยอง อ.เมืองลำพูน จ.ลำพูน 51000</p>
              <p>โทรศัพท์: 064-073-7959</p>
              <p>อีเมล: panyakham@gmail.com</p>
              <p>Website: www.panyakham.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-primary-foreground/30">
            © 2569 มูลนิธิเพื่อการศึกษาปัญญาคำ สงวนลิขสิทธิ์ทุกประการ
          </p>

          <div className="flex items-center gap-6">
            {user ? (
              <Link to="/admin" className="text-xs font-bold text-primary-foreground/40 hover:text-primary flex items-center gap-1.5 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" /> แผงควบคุมแอดมิน
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-bold text-primary-foreground/40 hover:text-white flex items-center gap-1.5 transition-colors">
                <LogIn className="w-3.5 h-3.5" /> เข้าสู่ระบบเจ้าหน้าที่
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
