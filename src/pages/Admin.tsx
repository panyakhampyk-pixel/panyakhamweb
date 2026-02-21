import { useState } from "react";
import {
    Heart,
    GraduationCap,
    BookOpen,
    Newspaper,
    Menu,
    Bell,
    TrendingUp,
    ArrowUpRight,
    Plus,
    CheckCircle2,
    Settings,
    Users,
    Inbox,
    Trophy,
    Briefcase,
    Search,
    Handshake
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";

const stats = [
    { label: "ผู้บริจาคทั้งหมด", value: "1,284", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950" },
    { label: "นักเรียนที่ได้รับทุน", value: "347", icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "อาจารย์ในระบบ", value: "4", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { label: "โครงการที่ดำเนินอยู่", value: "12", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "ข่าวสารที่เผยแพร่", value: "58", icon: Newspaper, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950" },
];

const recentActivities = [
    { text: "นายสมชาย ใจดี บริจาค ฿5,000", time: "5 นาทีที่แล้ว", type: "donate" },
    { text: "เพิ่มข่าวสาร: \"เปิดรับสมัครทุนการศึกษา 2568\"", time: "1 ชั่วโมงที่แล้ว", type: "news" },
    { text: "มีผู้ขอทุนใหม่ 3 รายการ", time: "3 ชั่วโมงที่แล้ว", type: "scholarship" },
];

const Admin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border flex items-center gap-4 px-6 sticky top-0 z-30">
                    <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-foreground">ภาพรวมระบบ</h1>
                        <p className="text-xs text-muted-foreground">ยินดีต้อนรับกลับมา, ผู้ดูแลระบบ</p>
                    </div>
                    <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-card"></span>
                    </button>
                </header>

                <main className="p-6 space-y-6 bg-accent/5 flex-1 overflow-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary Chart Placeholder */}
                        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-semibold text-foreground">สถิติการรับบริจาค</h3>
                                    <p className="text-xs text-muted-foreground">ย้อนหลัง 7 วันที่ผ่านมา</p>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <TrendingUp className="w-4 h-4" /> ดูรายงาน
                                </Button>
                            </div>
                            <div className="h-64 flex items-end gap-3 px-2">
                                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ฿{h * 100}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="font-semibold mb-4 text-foreground">กิจกรรมล่าสุด</h3>
                            <div className="space-y-4">
                                {recentActivities.map((action, i) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                        <div>
                                            <p className="text-foreground">{action.text}</p>
                                            <p className="text-xs text-muted-foreground">{action.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary/80 hover:bg-primary/5 text-xs">
                                ดูทั้งหมด
                            </Button>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-foreground">จัดการด่วน</h3>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="rounded-full bg-primary text-white"><a href="/admin/news"><Plus className="w-4 h-4 mr-2" /> เขียนข่าวใหม่</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/donations"><Heart className="w-4 h-4 mr-2" /> จัดการงานบริจาค</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/staff"><Users className="w-4 h-4 mr-2" /> จัดการบุคลากร</a></Button>
                            <Button asChild variant="outline" className="rounded-full bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white transition-all"><a href="/admin/teachers"><GraduationCap className="w-4 h-4 mr-2" /> รายชื่ออาจารย์ในระบบ</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/messages"><Inbox className="w-4 h-4 mr-2" /> ข้อความติดต่อ</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/settings"><Settings className="w-4 h-4 mr-2" /> ตั้งค่าเว็บไซต์</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/slider"><ArrowUpRight className="w-4 h-4 mr-2" /> เปลี่ยนรูปหน้าแรก</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/pride"><Trophy className="w-4 h-4 mr-2" /> ความภาคภูมิใจ</a></Button>
                            <Button asChild variant="outline" className="rounded-full"><a href="/admin/programs"><Briefcase className="w-4 h-4 mr-2" /> รูปภาพกิจกรรมเลื่อน</a></Button>
                            <Button asChild variant="outline" className="rounded-full bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500 hover:text-white transition-all"><a href="/admin/students"><GraduationCap className="w-4 h-4 mr-2" /> จัดการข้อมูลนักเรียน</a></Button>
                            <Button asChild variant="outline" className="rounded-full bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white transition-all"><a href="/check-application"><Search className="w-4 h-4 mr-2" /> ตรวจสอบรายชื่อ (รายคน)</a></Button>
                            <Button asChild variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white transition-all"><a href="/admin/partners"><Handshake className="w-4 h-4 mr-2" /> จัดการพันธมิตร & MOU</a></Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
