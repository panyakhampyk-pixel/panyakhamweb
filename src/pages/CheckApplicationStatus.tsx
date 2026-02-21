
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, GraduationCap, ArrowLeft, Loader2, CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CheckApplicationStatus = () => {
    const [idCard, setIdCard] = useState("");
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idCard || idCard.length < 13) {
            toast.error("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
            return;
        }

        setLoading(true);
        setHasSearched(true);
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("id_card", idCard)
                .maybeSingle();

            if (error) throw error;
            setStudent(data);

            if (!data) {
                toast.error("ไม่พบข้อมูลการสมัครของเลขบัตรประชาชนนี้");
            } else {
                toast.success("พบข้อมูลการสมัครแล้ว");
            }
        } catch (error: any) {
            console.error("Search error:", error);
            toast.error("เกิดข้อผิดพลาดในการค้นหา");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
                            <Search className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">ตรวจสอบสถานะการสมัคร</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            กรอกเลขบัตรประชาชน 13 หลักเพื่อตรวจสอบข้อมูลการสมัครเรียนและการขอรับทุน
                        </p>
                    </div>

                    {/* Search Card */}
                    <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardContent className="p-8 md:p-12">
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                                    <Input
                                        type="text"
                                        placeholder="เลขประจำตัวประชาชน 13 หลัก"
                                        className="h-16 pl-14 pr-6 rounded-2xl text-xl font-medium border-slate-200 focus:ring-primary focus:border-primary shadow-sm"
                                        value={idCard}
                                        onChange={(e) => setIdCard(e.target.value.replace(/\D/g, "").slice(0, 13))}
                                        maxLength={13}
                                    />
                                </div>
                                <Button
                                    className="w-full h-16 rounded-2xl text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> กำลังตรวจสอบ...</>
                                    ) : (
                                        "ตรวจสอบสถานะ"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Result Section */}
                    {hasSearched && !loading && student && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <Card className="border-none shadow-2xl shadow-emerald-500/5 rounded-[2.5rem] overflow-hidden bg-white border-t-8 border-emerald-500">
                                <CardHeader className="bg-emerald-50/50 p-8 border-b border-emerald-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                            <CheckCircle className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black text-slate-900">พบข้อมูลการสมัคร</CardTitle>
                                            <CardDescription className="text-emerald-700 font-medium pt-1">เลขเขตพื้นที่การศึกษา/วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">ชื่อ-นามสกุล</p>
                                                <p className="text-2xl font-black text-slate-800">{student.prefix}{student.first_name} {student.last_name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">ระดับชั้นที่สมัคร</p>
                                                <Badge className="text-lg px-4 py-1.5 bg-primary/10 text-primary border-none rounded-xl">
                                                    {student.apply_level}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">วันที่สมัคร</p>
                                                <p className="text-xl font-bold text-slate-700">
                                                    {new Date(student.created_at).toLocaleDateString('th-TH', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">สถานะการสมัคร</p>
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-xl">
                                                    <CheckCircle className="w-6 h-6" />
                                                    ยื่นใบสมัครเรียบร้อยแล้ว
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-center md:text-left">
                                            <p className="font-bold text-slate-800">ต้องการแก้ไขข้อมูล? หรือสอบถามถามเพิ่มเติม</p>
                                            <p className="text-slate-500">กรุณาติดต่อเจ้าหน้าที่มูลนิธิปัญญาคำ</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-2 font-bold px-8 h-12" asChild>
                                            <Link to="/contact">ติดต่อเรา</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {hasSearched && !loading && !student && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <Card className="border-none shadow-2xl shadow-rose-500/5 rounded-[2.5rem] overflow-hidden bg-white border-t-8 border-rose-500">
                                <CardContent className="p-12 text-center space-y-6">
                                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                                        <XCircle className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900">ไม่พบข้อมูลในระบบ</h3>
                                        <p className="text-slate-500 text-lg">หากท่านยังไม่ได้สมัครเรียน สามารถกดสมัครได้ที่ปุ่มด้านล่าง</p>
                                    </div>
                                    <Button size="lg" className="rounded-2xl h-14 px-10 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
                                        <Link to="/register">สมัครเรียนใหม่ที่นี่</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button variant="ghost" className="text-slate-500 font-bold hover:text-primary transition-colors" asChild>
                            <Link to="/">
                                <ArrowLeft className="w-4 h-4 mr-2" /> กลับหน้าหลัก
                            </Link>
                        </Button>
                        <Button variant="ghost" className="text-slate-500 font-bold hover:text-primary transition-colors" asChild>
                            <Link to="/register">
                                <GraduationCap className="w-4 h-4 mr-2" /> สมัครเรียน
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CheckApplicationStatus;
