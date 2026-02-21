import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { LogOut, X, ChevronRight } from "lucide-react";

interface SidebarItem {
    id: string;
    label: string;
    href: string;
    icon_name: string;
}

const AdminSidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) => {
    const [items, setItems] = useState<SidebarItem[]>([]);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchSidebar = async () => {
            const { data } = await supabase
                .from("admin_sidebar_items")
                .select("*")
                .order("sort_order", { ascending: true });
            if (data) setItems(data);
        };
        fetchSidebar();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 lg:static lg:flex ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <Logo size="sm" />
                    <button className="lg:hidden ml-auto text-muted-foreground" onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {items.map((item) => {
                        // ดึงไอคอนตามชื่อที่เก็บใน DB
                        const IconComponent = (LucideIcons as any)[item.icon_name] || LucideIcons.HelpCircle;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link key={item.id} to={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group
                  ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                                onClick={() => setIsOpen(false)}>
                                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
                                <span className="flex-1">{item.label}</span>
                                <ChevronRight className={`w-4 h-4 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/50 mb-2">
                        <div className="w-8 h-8 rounded-full bg-warm-gradient flex items-center justify-center text-white text-xs font-bold">
                            {user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{user?.email}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Administrator</p>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium">
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                    </button>
                </div>
            </aside>

            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
        </>
    );
};

export default AdminSidebar;
