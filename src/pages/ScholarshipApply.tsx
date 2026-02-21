
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, FileText, CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ScholarshipApply = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        education_level: "",
        reason: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("scholarship_applications")
                .insert([formData]);

            if (error) throw error;

            setSubmitted(true);
            toast.success("ส่งข้อมูลขอรับทุนเรียบร้อยแล้ว");
        } catch (error: any) {
            console.error("Error:", error);
            toast.error("เกิดข้อผิดพลาด: " + (error.message || "โปรดลองอีกครั้ง"));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6 pt-32">
                    <Card className="max-w-md w-full text-center p-12 rounded-[3rem] border-none shadow-2xl bg-white">
                        <CardContent className="space-y-6 flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">ส่งคำขอสำเร็จ!</h2>
                            <p className="text-slate-500">
                                ขอบคุณที่แจ้งความประสงค์ขอรับทุนการศึกษา <br />
                                เจ้าหน้าที่จะพิจารณาและติดต่อกลับหาคุณโดยเร็วที่สุด
                            </p>
                            <Button asChild className="w-full h-14 rounded-2xl font-bold bg-primary hover:bg-primary/90 mt-4">
                                <Link to="/">กลับหน้าหลัก</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc]">
            <Navbar />
            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto space-y-10">
                    <div className="text-center space-y-4">
                        <Link to="/scholarship" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> ย้อนกลับ
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">ขอรับทุนการศึกษา</h1>
                        <p className="text-slate-500 text-lg font-medium">กรอกข้อมูลเบื้องต้นเพื่อให้เจ้าหน้าที่ติดต่อกลับ</p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 ml-1">ชื่อ-นามสกุล</label>
                                    <Input
                                        required
                                        placeholder="ตัวอย่าง: นายสมชาย ใจดี"
                                        className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 ml-1">เบอร์โทรศัพท์</label>
                                        <Input
                                            required
                                            placeholder="08X-XXX-XXXX"
                                            className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-600 ml-1">ระดับการศึกษาปัจจุบัน</label>
                                        <Input
                                            required
                                            placeholder="เช่น ม.3, ม.6"
                                            className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all"
                                            value={formData.education_level}
                                            onChange={e => setFormData({ ...formData, education_level: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 ml-1">เหตุผลที่ขอรับทุน / ข้อมูลเพิ่มเติม</label>
                                    <Textarea
                                        required
                                        placeholder="อธิบายสั้นๆ เกี่ยวกับเหตุผลที่ต้องการรับทุน..."
                                        className="min-h-[150px] rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all p-4"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-warm-gradient text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> กำลังส่งข้อมูล...</>
                                    ) : (
                                        <>ส่งคำขอรับทุน <Sparkles className="ml-2 w-5 h-5" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-slate-400 text-sm font-medium">
                            หากมีข้อสงสัยเพิ่มเติม สามารถ <Link to="/contact" className="text-primary hover:underline">ติดต่อสอบถาม</Link> ได้โดยตรง
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ScholarshipApply;
