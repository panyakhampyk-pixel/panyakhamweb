import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    GraduationCap, Send, CheckCircle, ArrowLeft,
    User, Smartphone, BookOpen, Heart, Info,
    Sparkles, Calendar, MapPin, School, Banknote
} from "lucide-react";
import { Link } from "react-router-dom";

const ScholarshipApply = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        nickname: "",
        gender: "ชาย",
        birth_date: "",
        phone: "",
        email: "",
        address: "",
        school_name: "",
        grade_level: "",
        gpa: "",
        family_income: "",
        reason: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("scholarship_applications")
            .insert(formData);

        if (error) {
            alert("เกิดข้อผิดพลาด: " + error.message);
        } else {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
                <Navbar />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]"></div>
                </div>

                <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="max-w-lg w-full text-center bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                        <div className="relative inline-block mb-8">
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto rotate-12 shadow-xl shadow-emerald-500/20">
                                <CheckCircle className="w-12 h-12 -rotate-12" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black mb-4 text-foreground">ได้รับข้อมูลแล้ว!</h2>
                        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                            ขอบคุณที่ร่วมเป็นส่วนหนึ่งกับเรา <br />
                            คณะกรรมการจะใช้เวลาพิจารณา <span className="text-primary font-bold">7-14 วันทำการ</span> <br />
                            และจะติดต่อกลับผ่านเบอร์โทรศัพท์ที่คุณระบุไว้
                        </p>
                        <Button asChild className="w-full h-15 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-95 py-6">
                            <Link to="/">กลับสู่หน้าหลัก</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans">
            <Navbar />

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[150px] opacity-50"></div>
            </div>

            <main className="pt-32 pb-24 relative z-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header Section */}
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-10 transition-all group">
                            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            ย้อนกลับไปหน้าหลัก
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Sparkles className="w-3 h-3" /> Scholarship Program 2026
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
                                    สมัครขอรับ <span className="text-primary">ทุนการศึกษา</span>
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-xl">
                                    ร่วมสร้างโอกาสทางการศึกษาให้กับตนเองเพื่ออนาคตที่ยั่งยืน
                                    เราพร้อมสนับสนุนเยาวชนที่มีความตั้งใจแต่ขาดแคลนทุนทรัพย์
                                </p>
                            </div>
                            <div className="hidden lg:block">
                                <div className="w-32 h-32 bg-white rounded-[2.5rem] border border-border shadow-2xl flex items-center justify-center -rotate-6">
                                    <GraduationCap className="w-16 h-16 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative">
                        {/* Section List */}

                        {/* 1. ข้อมูลส่วนตัว */}
                        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 transition-all hover:shadow-primary/10 group">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
                                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <User className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground">ข้อมูลส่วนตัว</h3>
                                    <p className="text-xs text-muted-foreground">ระบุตัวตนและข้อมูลเบื้องต้นของคุณ</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                <div className="space-y-2.5">
                                    <Label className="font-bold text-foreground/80 flex items-center gap-2 px-1">
                                        <Info className="w-3.5 h-3.5 text-primary" /> ชื่อ-นามสกุล (ไม่ต้องมีคำนำหน้า)
                                    </Label>
                                    <Input
                                        required
                                        placeholder="เช่น สมชาย ใจดี"
                                        className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="font-bold text-foreground/80 px-1">ชื่อเล่น</Label>
                                    <Input
                                        placeholder="เช่น เก่ง, ส้ม"
                                        className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="font-bold text-foreground/80 px-1">เพศ</Label>
                                    <div className="grid grid-cols-2 gap-3 h-14 bg-accent/20 rounded-2xl p-1.5 border border-border">
                                        {['ชาย', 'หญิง'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gender: g })}
                                                className={`rounded-xl text-sm font-bold transition-all ${formData.gender === g ? 'bg-white shadow-sm text-primary border border-primary/10' : 'text-muted-foreground hover:bg-white/50'}`}
                                            >
                                                {g === 'ชาย' ? '♂️ ผู้ชาย' : '♀️ ผู้หญิง'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="font-bold text-foreground/80 flex items-center gap-2 px-1">
                                        <Calendar className="w-3.5 h-3.5 text-primary" /> วัน/เดือน/ปี เกิด
                                    </Label>
                                    <Input
                                        required
                                        type="date"
                                        className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                        value={formData.birth_date}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. ข้อมูลการติดต่อ */}
                        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 transition-all hover:shadow-primary/10">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
                                <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Smartphone className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground">ช่องทางการติดต่อ</h3>
                                    <p className="text-xs text-muted-foreground">เพื่อให้เราติดต่อกลับได้สะดวก</p>
                                </div>
                            </div>

                            <div className="space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 px-1">เบอร์โทรศัพท์ที่ติดต่อได้</Label>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="0xx-xxx-xxxx"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 px-1">อีเมล (ถ้ามี)</Label>
                                        <Input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="font-bold text-foreground/80 flex items-center gap-2 px-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary" /> ที่อยู่ปัจจุบันอย่างละเอียด
                                    </Label>
                                    <Textarea
                                        required
                                        placeholder="บ้านเลขที่, ตำบล, อำเภอ, จังหวัด..."
                                        className="min-h-[120px] rounded-[1.5rem] border-border bg-accent/20 focus:bg-white transition-all text-base"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. ข้อมูลการศึกษา */}
                        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 transition-all hover:shadow-primary/10">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
                                <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground">การศึกษาและฐานะ</h3>
                                    <p className="text-xs text-muted-foreground">ผลการเรียนและรายละเอียดความจำเป็น</p>
                                </div>
                            </div>

                            <div className="space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 flex items-center gap-2 px-1">
                                            <School className="w-4 h-4 text-primary" /> สถานศึกษาล่าสุด
                                        </Label>
                                        <Input
                                            required
                                            placeholder="ระบุชื่อโรงเรียน/วิทยาลัย"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                            value={formData.school_name}
                                            onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 px-1">ระดับชั้นที่กำลังศึกษา</Label>
                                        <Input
                                            required
                                            placeholder="เช่น ม.6, ปวช.3"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                            value={formData.grade_level}
                                            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 px-1">เกรดเฉลี่ยล่าสุด (GPA)</Label>
                                        <Input
                                            placeholder="เช่น 3.50"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base font-bold text-primary"
                                            value={formData.gpa}
                                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="font-bold text-foreground/80 flex items-center gap-2 px-1">
                                            <Banknote className="w-4 h-4 text-primary" /> รายรับครอบครัว/เดือน
                                        </Label>
                                        <Input
                                            placeholder="ระบุรายได้โดยประมาณ"
                                            className="h-14 rounded-2xl border-border bg-accent/20 focus:bg-white transition-all text-base"
                                            value={formData.family_income}
                                            onChange={(e) => setFormData({ ...formData, family_income: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5 pt-4">
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                                        <Label className="text-lg font-black text-foreground">เหตุผลที่ต้องการขอรับทุนการศึกษา</Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground px-1 mb-3">บอกเล่าเรื่องราวความฝัน หรือความจำเป็นของคุณให้เราฟัง...</p>
                                    <Textarea
                                        className="min-h-[160px] rounded-[1.5rem] border-border bg-accent/20 focus:bg-white transition-all text-base leading-relaxed p-6"
                                        placeholder="เขียนข้อมูลที่นี่..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 relative">
                            <div className="absolute -inset-1 bg-warm-gradient rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all"></div>
                            <Button
                                disabled={loading}
                                className="w-full h-20 text-xl font-black bg-warm-gradient text-white rounded-3xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        กำลังบันทึกใบสมัคร...
                                    </>
                                ) : (
                                    <>
                                        ส่งใบสมัครขอรับทุน <Send className="w-6 h-6" />
                                    </>
                                )}
                            </Button>
                            <p className="text-center mt-6 text-xs text-muted-foreground font-medium">
                                * ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับและใช้เพื่อการพิจารณาทุนการศึกษาเท่านั้น
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

// Helper for Loader icon
const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default ScholarshipApply;
