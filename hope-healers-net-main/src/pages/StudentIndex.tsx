
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, FileText, CheckCircle, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const StudentIndex = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                            สำหรับนักเรียน
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                            ระบบรับสมัครเรียน <br />
                            <span className="text-primary">และขอรับทุนการศึกษา</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            มูลนิธิเพื่อการศึกษาปัญญาคำ มอบโอกาสทางการศึกษาให้กับเด็กที่ขาดแคลนทุนทรัพย์
                            เพื่อเข้าศึกษาต่อ ณ วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Apply Card */}
                        <div className="group relative bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-primary/30">
                                <FileText className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">สมัครเรียนใหม่</h3>
                            <p className="text-slate-500 text-lg mb-8 flex-1">
                                ยื่นใบสมัครเพื่อเข้าศึกษาต่อและขอรับทุนการศึกษา
                                พร้อมสวัสดิการ ที่พัก อาหารสด และอุปกรณ์การเรียนฟรี
                            </p>
                            <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
                                <Link to="/register">เริ่มการสมัคร</Link>
                            </Button>
                        </div>

                        {/* Check Status Card */}
                        <div className="group relative bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-lg shadow-amber-500/30">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">ตรวจสอบสถานะ</h3>
                            <p className="text-slate-500 text-lg mb-8 flex-1">
                                ตรวจสอบรายชื่อและผลการสมัครเรียนโดยใช้
                                เลขบัตรประจำตัวประชาชน 13 หลัก
                            </p>
                            <Button size="lg" variant="outline" className="w-full h-16 rounded-2xl text-xl font-black border-2 border-amber-500 text-amber-600 hover:bg-amber-50" asChild>
                                <Link to="/check-application">ตรวจสอบรายชื่อ</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">ช่วงเวลาการสมัคร</h4>
                                <p className="text-slate-500">เปิดรับสมัครทุกวัน ไม่เว้นวันหยุดราชการ <br />ตั้งแต่เวลา 08.30 - 16.30 น.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">คุณสมบัติเบื้องต้น</h4>
                                <p className="text-slate-500">สำเร็จการศึกษาระดับชั้น ม.3 / ม.6 หรือเทียบเท่า และเป็นผู้ที่ขาดแคลนทุนทรัพย์</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">สถานที่เรียน</h4>
                                <p className="text-slate-500">วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย จังหวัดลำพูน</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudentIndex;
