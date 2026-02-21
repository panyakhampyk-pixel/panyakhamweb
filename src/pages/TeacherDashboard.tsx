
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Printer, Users, LogOut, ArrowLeft, Loader2, Eye, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentDetailDialog } from "@/components/StudentDetailDialog";

interface StaffMember {
    id: string;
    name: string;
    position: string;
}

interface Student {
    id: string;
    prefix: string;
    first_name: string;
    last_name: string;
    id_card: string;
    birth_date: string;
    ethnicity: string;
    nationality: string;
    religion: string;
    birthplace: string;
    weight: string;
    height: string;
    disease: string;
    registered_address: string;
    current_address: string;
    phone: string;
    father_name: string;
    father_phone: string;
    mother_name: string;
    mother_phone: string;
    parents_status: string;
    guardian_name: string;
    guardian_phone: string;
    guardian_relation: string;
    old_school: string;
    old_school_location: string;
    gpa: string;
    graduated_year: string;
    education_level: string;
    apply_level: string;
    recruiter_name: string;
    created_at: string;
    doc_house_registration: boolean;
    doc_id_card: boolean;
    doc_education: boolean;
    doc_photo: boolean;
    doc_name_change: boolean;
    guardian_age: string;
    guardian_occupation: string;
    guardian_address: string;
    father_id_card: string;
    father_age: string;
    father_occupation: string;
    mother_id_card: string;
    mother_age: string;
    mother_occupation: string;
    siblings_count: string;
    siblings_male: string;
    siblings_female: string;

}

const TeacherDashboard = () => {
    const [loginCode, setLoginCode] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [teacher, setTeacher] = useState<StaffMember | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Load session from localStorage on mount
    useEffect(() => {
        const savedTeacher = localStorage.getItem("teacher_session");
        if (savedTeacher) {
            const data = JSON.parse(savedTeacher);
            setTeacher(data);
            setIsLoggedIn(true);
            fetchTeacherStudents(data.name);
        }
    }, []);

    const fetchTeacherStudents = async (teacherName: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("recruiter_name", teacherName)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error: any) {
            console.error("Fetch error:", error);
            toast.error("ไม่สามารถโหลดข้อมูลนักเรียนได้");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginCode) return;

        setLoading(true);
        try {
            // Check if the code matches a staff's ID or a specific check_code
            // For now, we search by ID (first 6-8 chars) or full ID
            const { data, error } = await supabase
                .from("staff")
                .select("*");

            if (error) throw error;

            // Find teacher whose ID starts with the code or matches exactly
            // This is "automatic generation" based on their ID
            const foundTeacher = data?.find(s =>
                s.id.toLowerCase().startsWith(loginCode.toLowerCase()) ||
                (s as any).check_code === loginCode
            );

            if (foundTeacher) {
                setTeacher(foundTeacher);
                setIsLoggedIn(true);
                localStorage.setItem("teacher_session", JSON.stringify(foundTeacher));
                fetchTeacherStudents(foundTeacher.name);
                toast.success(`ยินดีต้อนรับ อาจารย์${foundTeacher.name}`);
            } else {
                toast.error("รหัสไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("เกิดข้อผิดพลาดในการเข้าระบบ");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("teacher_session");
        setIsLoggedIn(false);
        setTeacher(null);
        setStudents([]);
        setLoginCode("");
    };

    const handlePrint = (student: Student) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return "-";
            return new Date(dateStr).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <title>ใบสมัครเรียน - ${student.first_name} ${student.last_name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
                    @page { size: A4; margin: 25mm 20mm; }
                    body { font-family: 'Sarabun', sans-serif; padding: 20px; color: #1e293b; line-height: 1.4; font-size: 13pt; background: white; }
                    .container { width: 100%; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
                    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px; }
                    .section { margin-bottom: 15px; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; }
                    .section-title { font-weight: 800; background: #4f46e5; color: #fff; padding: 5px 12px; margin: -12px -12px 10px -12px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 11pt; }
                    .row { display: flex; flex-wrap: wrap; margin-bottom: 4px; }
                    .col { display: flex; margin-right: 15px; align-items: baseline; }
                    .label { font-weight: 600; color: #64748b; margin-right: 8px; font-size: 10pt; }
                    .value { font-weight: 600; color: #0f172a; border-bottom: 1px solid #e2e8f0; min-width: 40px; padding: 0 4px; font-size: 11pt; }
                    .signature-area { margin-top: 30px; display: flex; justify-content: space-around; }
                    .sig-box { text-align: center; width: 30%; }
                    .sig-line { border-bottom: 1px solid #000; margin-bottom: 5px; height: 30px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div>
                            <h1 style="font-size: 18pt; margin: 0; color: #4f46e5;">ใบสมัครเข้าเรียน</h1>
                            <h2 style="font-size: 12pt; margin: 0; color: #64748b;">วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย</h2>
                        </div>
                        <div style="border: 1px solid #ccc; width: 3cm; height: 4cm; display: flex; align-items: center; justify-content: center; font-size: 8pt; color: #999;">ติดรูปถ่าย</div>
                    </div>
                    <div class="section">
                        <div class="section-title">1. ข้อมูลนักเรียน</div>
                        <div class="row">
                            <div class="col" style="flex: 1;"><span class="label">ชื่อ-นามสกุล:</span><span class="value">${student.prefix}${student.first_name} ${student.last_name}</span></div>
                            <div class="col"><span class="label">เลขบัตรประชาชน:</span><span class="value">${student.id_card}</span></div>
                        </div>
                        <div class="row">
                            <div class="col"><span class="label">วันเกิด:</span><span class="value">${formatDate(student.birth_date)}</span></div>
                            <div class="col"><span class="label">เบอร์โทร:</span><span class="value">${student.phone}</span></div>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-title">2. ข้อมูลการสมัคร</div>
                        <div class="row">
                            <div class="col" style="flex: 1;"><span class="label">ระดับชั้นที่สมัคร:</span><span class="value" style="font-size: 14pt;">${student.apply_level}</span></div>
                        </div>
                        <div class="row">
                            <div class="col"><span class="label">อาจารย์ผู้รับสมัคร:</span><span class="value">${student.recruiter_name}</span></div>
                        </div>
                    </div>
                    <div class="signature-area">
                        <div class="sig-box"><div class="sig-line"></div><div>ลงชื่อ ผู้สมัคร</div></div>
                        <div class="sig-box"><div class="sig-line"></div><div>ลงชื่อ ผู้ปกครอง</div></div>
                        <div class="sig-box"><div class="sig-line"></div><div>ลงชื่อ อาจารย์ผู้รับสมัคร</div></div>
                    </div>
                </div>
                <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <main className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
                    <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="bg-indigo-600 p-10 text-center text-white">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                <UserCheck className="w-10 h-10 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-black">ระบบล็อกอินอาจารย์</CardTitle>
                            <p className="text-indigo-100 mt-2 font-medium opacity-80">กรุณากรอกรหัสตรวจสอบของท่าน</p>
                        </CardHeader>
                        <CardContent className="p-10">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">รหัสอาจารย์ (6 หลักแรกของ ID)</label>
                                    <Input
                                        type="password"
                                        placeholder="ระบุรหัส 6 หลัก"
                                        className="h-14 rounded-2xl text-center text-2xl font-black tracking-[0.5em] border-slate-200 focus:ring-indigo-500"
                                        value={loginCode}
                                        onChange={(e) => setLoginCode(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 rounded-2xl text-lg font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "เข้าสู่ระบบ"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-emerald-500 text-white border-none py-1.5 px-4 rounded-full font-bold">
                                เข้าสู่ระบบแล้ว
                            </Badge>
                            <span className="text-slate-400 font-bold">|</span>
                            <span className="text-slate-500 font-bold">อาจารย์ผู้รับสมัคร</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-none">
                            สวัสดี, <span className="text-indigo-600">อาจารย์{teacher?.name}</span>
                        </h1>
                        <p className="text-slate-500 font-medium">รายการนักเรียนทั้งหมดที่คุณเป็นผู้ดูแล</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="h-12 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold"
                        >
                            <LogOut className="w-5 h-5 mr-2" /> ออกจากระบบ
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="border-none shadow-sm rounded-3xl bg-white p-8 group hover:shadow-xl transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">นักเรียนในความดูแล</p>
                                <h3 className="text-4xl font-black text-slate-900">{students.length} <span className="text-lg font-bold text-slate-400">คน</span></h3>
                            </div>
                        </div>
                    </Card>

                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                        <Input
                            placeholder="ค้นหาชื่อนักเรียน หรือ เบอร์โทรศัพท์..."
                            className="h-full min-h-[80px] pl-16 rounded-[2rem] text-xl font-medium border-none shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Card */}
                <Card className="border-none shadow-2xl shadow-indigo-600/5 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="px-10 py-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
                        <CardTitle className="text-2xl font-black text-slate-800">รายชื่อนักเรียนของคุณ</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => teacher && fetchTeacherStudents(teacher.name)} className="text-sm font-bold text-indigo-600">รีเฟรชข้อมูล</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                                <p className="font-bold text-slate-400">กำลังโหลดข้อมูลนักเรียน...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="py-32 text-center text-slate-300 space-y-4">
                                <Users className="w-16 h-16 mx-auto opacity-20" />
                                <p className="text-xl font-bold">ไม่พบข้อมูลนักเรียนในตอนี้</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="py-6 px-10 font-black text-slate-500 uppercase tracking-widest text-xs">ชื่อ-นามสกุล</TableHead>
                                            <TableHead className="font-black text-slate-500 uppercase tracking-widest text-xs">ระดับชั้น</TableHead>
                                            <TableHead className="font-black text-slate-500 uppercase tracking-widest text-xs">เบอร์โทรศัพท์</TableHead>
                                            <TableHead className="font-black text-slate-500 uppercase tracking-widest text-xs">วันที่สมัคร</TableHead>
                                            <TableHead className="text-right px-10 font-black text-slate-500 uppercase tracking-widest text-xs">เครื่องมือ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="group hover:bg-indigo-50/30 transition-colors border-slate-50">
                                                <TableCell className="py-6 px-10">
                                                    <div className="font-black text-slate-800 text-lg">
                                                        {student.prefix}{student.first_name} {student.last_name}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400">ID: {student.id.slice(0, 8).toUpperCase()}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none px-4 py-1 rounded-xl font-bold">
                                                        {student.apply_level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600 font-bold">{student.phone}</TableCell>
                                                <TableCell className="text-slate-400 text-sm font-medium">
                                                    {new Date(student.created_at).toLocaleDateString('th-TH', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right px-10">
                                                    <div className="flex justify-end gap-3 transition-opacity">
                                                        <Button
                                                            variant="outline" size="icon"
                                                            className="h-11 w-11 rounded-xl border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setIsDetailOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline" size="icon"
                                                            className="h-11 w-11 rounded-xl border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                                            onClick={() => handlePrint(student)}
                                                        >
                                                            <Printer className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />

            {selectedStudent && (
                <StudentDetailDialog
                    student={selectedStudent}
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;
