import { useState, useEffect } from "react";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface NavItem {
  id: string;
  label: string;
  href: string;
  submenu?: NavItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchNav = async () => {
      const { data } = await supabase
        .from("navbar_items")
        .select("*")
        .order("sort_order", { ascending: true });

      let items: NavItem[] = [];
      if (data && data.length > 0) {
        items = data.map(item => ({
          ...item,
          href: item.href === '#home' ? '/' :
            item.href === '#about' ? '/about' :
              item.href === '#projects' ? '/programs' :
                item.href === '#scholarship' ? '/scholarship' :
                  item.href === '#news' ? '/news' :
                    item.href === '#donate' ? '/donate' :
                      item.href === '#contact' ? '/contact' :
                        item.href === '#register' ? '/students' :
                          item.href === '#check-application' ? '/check-application' :
                            item.href
        }));
      } else {
        items = [
          { id: '1', label: "หน้าหลัก", href: "/" },
          { id: '2', label: "เกี่ยวกับ", href: "/about" },
          { id: '3', label: "ส่งมอบโอกาส", href: "/programs" },
          { id: '4', label: "ข่าวสาร", href: "/news" },
          { id: '5', label: "ร่วมบริจาค", href: "/donate" },
          { id: '6', label: "ขอรับทุน", href: "/scholarship" },
          { id: '8', label: "สมัครเรียน", href: "/students" },
          { id: '7', label: "ติดต่อ", href: "/contact" },
        ];
      }

      // Ensure "สมัครเรียน" is always there if not in Supabase
      if (!items.find(i => i.href === '/students')) {
        items.push({ id: 'nav-students', label: "สมัครเรียน", href: "/students" });
      }

      // Group "Staff" under "About"
      const refinedItems: NavItem[] = [];
      let aboutItem: NavItem | null = null;

      const filtered = items.filter(item => {
        if (item.label.includes("เกี่ยวกับ")) {
          aboutItem = {
            ...item,
            submenu: [
              { id: 'staff-personnel', label: "บุคลากร", href: "/staff" },
              { id: 'staff-teachers', label: "รายชื่ออาจารย์", href: "/teachers" }
            ]
          };
          return false;
        }
        if (item.label.includes("ทำเนียบ") || item.label.includes("บุคลากร") || item.label.includes("อาจารย์")) return false;
        return true;
      });

      if (aboutItem) {
        // Insert about item at original position or 2nd position
        filtered.splice(1, 0, aboutItem);
      }
      setNavItems(filtered);
    };
    fetchNav();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isHomePage = location.pathname === "/";
  const showSolidNavbar = scrolled || !isHomePage;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showSolidNavbar ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 py-2 shadow-sm" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="inline-block hover:scale-105 transition-transform">
            <Logo size="sm" dark={showSolidNavbar} />
          </Link>
        </div>

        {/* Center: Navigation Menu */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 justify-center flex-grow">
          {navItems.map((item) => (
            <div key={item.href} className="relative group"
              onMouseEnter={() => item.submenu && setAboutOpen(true)}
              onMouseLeave={() => item.submenu && setAboutOpen(false)}>

              <Link
                to={item.href}
                className={`text-[13px] xl:text-sm font-bold tracking-tight transition-all duration-300 flex items-center gap-1 whitespace-nowrap
                  ${showSolidNavbar ? "text-slate-600 hover:text-primary" : "text-white drop-shadow-md hover:text-white/80"}`}
              >
                {item.label}
                {item.submenu && <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${!showSolidNavbar && "bg-white"}`}></span>
              </Link>

              {/* Dropdown Menu */}
              {item.submenu && (
                <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-50 overflow-hidden transition-all duration-300 origin-top
                  ${aboutOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.href}
                      to={sub.href}
                      className="block px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          <Button asChild variant="outline" className={`rounded-xl font-bold transition-all px-3 xl:px-5 py-2 border-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-xs xl:text-sm
            ${showSolidNavbar ? "border-primary text-primary hover:bg-primary/5" : "border-white text-white hover:bg-white/10"}`}>
            <Link to="/scholarship">ขอรับทุน</Link>
          </Button>

          <Button asChild className={`rounded-xl font-bold transition-all px-3 xl:px-5 py-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-xs xl:text-sm
            ${showSolidNavbar ? "bg-primary text-white" : "bg-white text-primary hover:bg-slate-50"}`}>
            <Link to="/donate">ร่วมบริจาค</Link>
          </Button>

          {user && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className={`rounded-xl font-bold border-2 ${!showSolidNavbar && "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                <Link to="/admin">แผงควบคุม</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className={`font-bold ${showSolidNavbar ? "text-slate-400 hover:text-destructive" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                ออก
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 rounded-xl transition-colors ${showSolidNavbar ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-8 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.href} className="flex flex-col">
                <Link
                  to={item.href}
                  className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 flex justify-between items-center"
                  onClick={() => !item.submenu && setIsOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="bg-slate-50 rounded-2xl mt-2 p-2">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        className="block px-4 py-3 text-base font-bold text-slate-600 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="lg" className="rounded-2xl font-black py-7 text-lg border-2 border-primary text-primary">
                  <Link to="/scholarship" onClick={() => setIsOpen(false)}>ขอรับทุน</Link>
                </Button>
                <Button asChild size="lg" className="rounded-2xl bg-primary text-white font-black py-7 text-lg shadow-xl shadow-primary/20">
                  <Link to="/donate" onClick={() => setIsOpen(false)}>ร่วมบริจาค</Link>
                </Button>
              </div>

              {user && (
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold py-6 border-2" onClick={() => setIsOpen(false)}>
                    <Link to="/admin">แผงควบคุม</Link>
                  </Button>
                  <Button variant="ghost" size="lg" onClick={handleSignOut} className="rounded-2xl font-bold py-6 text-destructive">
                    ออกกจากระบบ
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
