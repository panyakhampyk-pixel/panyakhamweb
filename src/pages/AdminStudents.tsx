
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Printer, Loader2, Users, CheckCircle, Search, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { StudentDetailDialog } from "@/components/StudentDetailDialog";

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
    father_id_card: string;
    father_age: string;
    father_occupation: string;
    father_phone: string;

    mother_name: string;
    mother_id_card: string;
    mother_age: string;
    mother_occupation: string;
    mother_phone: string;

    parents_status: string;

    guardian_name: string;
    guardian_id_card: string;
    guardian_age: string;
    guardian_occupation: string;
    guardian_relation: string;
    guardian_phone: string;
    guardian_address: string;

    siblings_count: string;
    siblings_male: string;
    siblings_female: string;

    old_school: string;
    old_school_location: string;
    gpa: string;
    graduated_year: string;
    education_level: string;
    apply_level: string;

    recruiter_name: string;

    parent_signature_name: string;
    parent_signature_address: string;

    doc_house_registration: boolean;
    doc_id_card: boolean;
    doc_education: boolean;
    doc_photo: boolean;
    doc_name_change: boolean;

    deposit_status: string;
    tuition_status: string;
    created_at: string;
}

const AdminStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
    const [isAddingTeacher, setIsAddingTeacher] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: "", email: "", position: "อาจารย์" });
    const [teachers, setTeachers] = useState<{ id: string, name: string, position: string, email: string }[]>([]);
    const [isTeachersListOpen, setIsTeachersListOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error: any) {
            console.error("Error:", error);
            toast.error("ไม่สามารถโหลดข้อมูลนักเรียนได้");
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data, error } = await supabase
                .from("teachers")
                .select("id, name, position, email")
                .order("name", { ascending: true });
            if (error) throw error;
            setTeachers(data || []);
        } catch (error) {
            console.error("Error fetching teachers", error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
    }, []);

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
    );

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsAddingTeacher(true);
            const { error } = await supabase
                .from("teachers")
                .insert([{
                    name: newTeacher.name,
                    email: newTeacher.email,
                    position: newTeacher.position,
                    group_name: "อาจารย์ผู้รับสมัคร",
                    group_level: 1
                }]);

            if (error) throw error;

            toast.success("เพิ่มรายชื่ออาจารย์เรียบร้อยแล้ว");
            setIsAddTeacherOpen(false);
            setNewTeacher({ name: "", email: "", position: "อาจารย์" });
            fetchTeachers(); // Refresh the list
        } catch (error: any) {
            console.error("Error:", error);
            toast.error("ไม่สามารถเพิ่มข้อมูลได้: " + error.message);
        } finally {
            setIsAddingTeacher(false);
        }
    };

    const handleViewStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
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

        const formatFullThDate = (date: Date) => {
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const today = new Date();
        const buddhistYear = today.getFullYear() + 543;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <title>ใบสมัครเรียน - ${student.first_name} ${student.last_name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
                    
                    @page {
                        size: A4;
                        margin: 25mm 20mm;
                    }
                    
                    body { 
                        font-family: 'Sarabun', sans-serif; 
                        padding: 20px; 
                        margin: 0;
                        color: #1e293b; 
                        line-height: 1.4; 
                        font-size: 13pt;
                        background: #f1f5f9;
                    }

                    .container {
                        width: 100%;
                        max-width: 100%;
                        background: #fff;
                        padding: 10mm;
                        box-sizing: border-box;
                        position: relative;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        border-radius: 8px;
                        -webkit-print-color-adjust: exact;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        margin-bottom: 25px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #4f46e5;
                    }

                    .school-logo {
                        height: 75px;
                        margin-right: 20px;
                    }

                    .header-text {
                        text-align: left;
                    }

                    .header-text h1 { 
                        font-size: 22pt; 
                        margin: 0; 
                        font-weight: 800; 
                        color: #4f46e5;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .header-text h2 { 
                        font-size: 14pt; 
                        margin: 2px 0; 
                        font-weight: 600; 
                        color: #64748b; 
                    }

                    .photo-box {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 3cm;
                        height: 4cm;
                        border: 2px dashed #cbd5e1;
                        background: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10pt;
                        color: #94a3b8;
                        border-radius: 5mm;
                    }

                    .section {
                        margin-bottom: 15px;
                        border: 1px solid #e2e8f0;
                        padding: 12px;
                        border-radius: 8px;
                        background: #fff;
                    }

                    .section-title {
                        font-weight: 800;
                        background: #4f46e5;
                        color: #fff;
                        padding: 8px 15px;
                        margin: -12px -12px 10px -12px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        font-size: 12pt;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        -webkit-print-color-adjust: exact;
                    }

                    .row {
                        display: flex;
                        flex-wrap: wrap;
                        margin-bottom: 4px;
                    }

                    .col {
                        display: flex;
                        margin-right: 15px;
                        align-items: baseline;
                    }

                    .label { 
                        font-weight: 600; 
                        color: #64748b; 
                        margin-right: 8px;
                        font-size: 11pt;
                    }
                    
                    .value { 
                        font-weight: 600;
                        color: #0f172a;
                        border-bottom: 1px solid #e2e8f0; 
                        min-width: 40px; 
                        padding: 0 4px;
                        font-size: 12pt;
                    }
                    
                    .flex-grow { flex-grow: 1; }

                    .signature-area {
                        margin-top: 35px;
                        display: flex;
                        justify-content: space-around;
                        gap: 20px;
                    }

                    .sig-box {
                        text-align: center;
                        width: 32%;
                        background: #f8fafc;
                        padding: 15px 10px;
                        border-radius: 12px;
                        border: 1px solid #f1f5f9;
                        -webkit-print-color-adjust: exact;
                    }

                    .sig-line {
                        margin-top: 35px;
                        border-bottom: 2px solid #cbd5e1;
                        margin-bottom: 8px;
                        width: 80%;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    
                    .sig-label {
                        font-size: 10pt;
                        font-weight: 700;
                        color: #64748b;
                        margin-bottom: 4px;
                    }

                    .footer-info {
                        margin-top: 25px;
                        background: #fff9f2;
                        border: 2px dashed #f59e0b;
                        padding: 15px;
                        border-radius: 12px;
                        -webkit-print-color-adjust: exact;
                    }

                    .footer-title {
                        color: #b45309;
                        font-weight: 800;
                        margin-bottom: 8px;
                        font-size: 11pt;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }

                    .page-break { page-break-before: always; }

                    @media print {
                        .no-print { display: none; }
                        body { background: transparent; padding: 0; }
                        .container { border: none; box-shadow: none; margin: 0; padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header" style="margin-bottom: 35px; padding: 10px 15px; border-bottom: 3px solid #4f46e5; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <img src="https://www.ecvc.ac.th/GRADE-ECVE/images/logo.png" class="school-logo" style="margin: 0;">
                            <div class="header-text">
                                <h1 style="font-size: 24pt;">ใบสมัครเข้าเรียน</h1>
                                <h2 style="font-size: 14pt; color: #64748b;">วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย</h2>
                            </div>
                        </div>
                        <div class="photo-box" style="position: static; flex-shrink: 0;">ติดรูปถ่าย<br>1.5 - 2 นิ้ว</div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 15px; clear: both;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 10pt; color: #64748b; font-weight: bold;">APPLICATION FORM</span>
                            <span style="font-weight: bold; color: #4f46e5; font-size: 12pt;">เลขที่ใบสมัคร: <span style="color: #ef4444; border-bottom: 2px solid #ef4444;">${student.id.slice(0, 8).toUpperCase()}</span></span>
                        </div>
                        <span style="font-weight: bold; color: #4f46e5;">วันที่สมัคร: ${formatDate(student.created_at)}</span>
                    </div>

                    <div class="section">
                        <div class="section-title">
                            <span>1. ข้อมูลนักเรียน</span>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">ชื่อ-นามสกุล:</span><span class="value">${student.prefix}${student.first_name} ${student.last_name}</span></div>
                            <div class="col"><span class="label">เลขบัตรประชาชน:</span><span class="value">${student.id_card}</span></div>
                        </div>
                        <div class="row">
                            <div class="col"><span class="label">วันเกิด:</span><span class="value">${formatDate(student.birth_date)}</span></div>
                            <div class="col"><span class="label">เชื้อชาติ:</span><span class="value">${student.ethnicity}</span></div>
                            <div class="col"><span class="label">สัญชาติ:</span><span class="value">${student.nationality}</span></div>
                            <div class="col"><span class="label">ศาสนา:</span><span class="value">${student.religion}</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">สถานที่เกิด:</span><span class="value">${student.birthplace || "-"}</span></div>
                            <div class="col"><span class="label">น้ำหนัก:</span><span class="value">${student.weight} กก.</span></div>
                            <div class="col"><span class="label">ส่วนสูง:</span><span class="value">${student.height} ซม.</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">โรคประจำตัว:</span><span class="value">${student.disease || "ไม่มี"}</span></div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">
                            <span>2. ข้อมูลติดต่อและการสื่อสาร</span>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">ที่อยู่ตามทะเบียนบ้าน:</span><span class="value">${student.registered_address}</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">ที่อยู่ปัจจุบัน:</span><span class="value">${student.current_address}</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">เบอร์โทรศัพท์ที่ติดต่อได้:</span><span class="value" style="font-size: 14pt; color: #4f46e5;">${student.phone}</span></div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">
                            <span>3. ข้อมูลครอบครัวและผู้ปกครอง</span>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">บิดา:</span><span class="value">${student.father_name}</span></div>
                            <div class="col"><span class="label">ปชช:</span><span class="value">${student.father_id_card || "-"}</span></div>
                            <div class="col"><span class="label">อายุ:</span><span class="value">${student.father_age || "-"} ปี</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">อาชีพ:</span><span class="value">${student.father_occupation}</span></div>
                            <div class="col flex-grow"><span class="label">โทร:</span><span class="value">${student.father_phone}</span></div>
                        </div>
                        <div style="height: 6px; border-bottom: 1px dashed #f1f5f9; margin-bottom: 6px;"></div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">มารดา:</span><span class="value">${student.mother_name}</span></div>
                            <div class="col"><span class="label">ปชช:</span><span class="value">${student.mother_id_card || "-"}</span></div>
                            <div class="col"><span class="label">อายุ:</span><span class="value">${student.mother_age || "-"} ปี</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">อาชีพ:</span><span class="value">${student.mother_occupation}</span></div>
                            <div class="col flex-grow"><span class="label">โทร:</span><span class="value">${student.mother_phone}</span></div>
                        </div>
                        <div style="height: 6px; border-bottom: 1px dashed #f1f5f9; margin-bottom: 6px;"></div>
                        <div class="row">
                            <div class="col"><span class="label">สถานภาพ:</span><span class="value">${student.parents_status === 'together' ? 'อยู่ด้วยกัน' : student.parents_status === 'separated' ? 'แยกกันอยู่' : student.parents_status === 'divorced' ? 'หย่าร้าง' : student.parents_status === 'father_deceased' ? 'บิดาถึงแก่กรรม' : student.parents_status === 'mother_deceased' ? 'มารดาถึงแก่กรรม' : '-'}</span></div>
                            <div class="col flex-grow"><span class="label">พี่น้อง:</span><span class="value">${student.siblings_count} คน (ชาย: ${student.siblings_male} / หญิง: ${student.siblings_female})</span></div>
                        </div>
                        <div style="height: 6px; border-bottom: 1px dashed #f1f5f9; margin-bottom: 6px;"></div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">ชื่อผู้ปกครอง:</span><span class="value">${student.guardian_name || "-"}</span></div>
                            <div class="col"><span class="label">เกี่ยวข้อง:</span><span class="value">${student.guardian_relation || "-"}</span></div>
                            <div class="col"><span class="label">โทร:</span><span class="value">${student.guardian_phone || "-"}</span></div>
                        </div>
                    </div>

                    <div class="section page-break">
                        <div class="section-title">
                            <span>4. ประวัติการศึกษาและการรับสมัคร</span>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">จบจากโรงเรียน:</span><span class="value">${student.old_school}</span></div>
                            <div class="col"><span class="label">จังหวัด:</span><span class="value">${student.old_school_location}</span></div>
                        </div>
                        <div class="row">
                            <div class="col"><span class="label">วุฒิเดิม:</span><span class="value">${student.education_level || "-"}</span></div>
                            <div class="col"><span class="label">GPA:</span><span class="value">${student.gpa}</span></div>
                            <div class="col"><span class="label">ปีที่จบ:</span><span class="value">${student.graduated_year || "-"}</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">สมัครเข้าเรียนระดับชั้น:</span><span class="value" style="font-size: 15pt; color: #4f46e5; font-weight: 800; border-bottom: 2px solid #4f46e5;">${student.apply_level}</span></div>
                        </div>
                        <div class="row">
                            <div class="col flex-grow"><span class="label">อาจารย์ผู้รับสมัคร:</span><span class="value" style="color: #b45309;">${student.recruiter_name || "-"}</span></div>
                        </div>
                    </div>

                    <div class="signature-area">
                        <div class="sig-box">
                            <div class="sig-line"></div>
                            <div class="sig-label">ลงชื่อ ผู้สมัคร</div>
                            <div style="font-size: 11pt;">(${student.first_name} ${student.last_name})</div>
                        </div>
                        <div class="sig-box">
                            <div class="sig-line"></div>
                            <div class="sig-label">ลงชื่อ ผู้ปกครอง</div>
                            <div style="font-size: 11pt;">(${student.guardian_name || student.father_name || student.mother_name || ".............................................."})</div>
                        </div>
                        <div class="sig-box">
                            <div class="sig-line"></div>
                            <div class="sig-label">ลงชื่อ ผู้รับสมัคร</div>
                            <div style="font-size: 11pt;">(${student.recruiter_name || ".............................................."})</div>
                        </div>
                    </div>

                    <div class="footer-info">
                        <div class="footer-title">📑 หลักฐานประกอบการสมัคร (สำหรับเจ้าหน้าที่)</div>
                        <div class="row" style="gap: 10px;">
                            <div class="col"><span style="margin-right: 5px;">[ ${student.doc_house_registration ? '✓' : ' '} ]</span> ทะเบียนบ้าน</div>
                            <div class="col"><span style="margin-right: 5px;">[ ${student.doc_id_card ? '✓' : ' '} ]</span> บัตรประชาชน</div>
                            <div class="col"><span style="margin-right: 5px;">[ ${student.doc_education ? '✓' : ' '} ]</span> วุฒิการศึกษา</div>
                            <div class="col"><span style="margin-right: 5px;">[ ${student.doc_photo ? '✓' : ' '} ]</span> รูปถ่าย</div>
                            <div class="col"><span style="margin-right: 5px;">[ ${student.doc_name_change ? '✓' : ' '} ]</span> ใบเปลี่ยนชื่อ</div>
                        </div>
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);

                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <Link to="/admin" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้าแผงควบคุม
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900">จัดการข้อมูลนักเรียน</h1>
                        <div className="flex items-center gap-4">
                            <p className="text-slate-500">ตรวจสอบและจัดการใบสมัครนักเรียนทั้งหมด</p>
                            <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-full bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 font-bold gap-2">
                                        <UserPlus className="w-4 h-4" /> เพิ่มรายชื่ออาจารย์
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold">เพิ่มรายชื่ออาจารย์ (สำหรับรับสมัคร)</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddTeacher} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="font-bold">ชื่อ-นามสกุลอาจารย์</Label>
                                            <Input
                                                id="name"
                                                placeholder="ระบุชื่ออาจารย์"
                                                required
                                                value={newTeacher.name}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold">อีเมล (ถ้ามี)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={newTeacher.email}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position" className="font-bold">ตำแหน่ง</Label>
                                            <Input
                                                id="position"
                                                placeholder="เช่น อาจารย์ระดับชั้น ม.1"
                                                value={newTeacher.position}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, position: e.target.value })}
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="submit" disabled={isAddingTeacher} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                                {isAddingTeacher ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isTeachersListOpen} onOpenChange={setIsTeachersListOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-full bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 font-bold gap-2">
                                        <Users className="w-4 h-4" /> ดูรายชื่ออาจารย์ทั้งหมด
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] rounded-[2rem] max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-600" />
                                            รายชื่ออาจารย์ในระบบ ({teachers.length})
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="font-bold">ชื่อ-นามสกุล</TableHead>
                                                    <TableHead className="font-bold">ตำแหน่ง</TableHead>
                                                    <TableHead className="font-bold">รหัสเช็ค (6 หลัก)</TableHead>
                                                    <TableHead className="font-bold">อีเมล</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {teachers.map((t) => (
                                                    <TableRow key={t.id}>
                                                        <TableCell className="font-medium text-slate-800">{t.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none">
                                                                {t.position}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <code className="bg-slate-100 px-2 py-1 rounded text-indigo-600 font-bold">
                                                                {t.id.slice(0, 6).toUpperCase()}
                                                            </code>
                                                        </TableCell>
                                                        <TableCell className="text-slate-500 text-sm">{t.email || "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {teachers.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                                                            ยังไม่มีรายชื่ออาจารย์ในระบบ
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => setIsTeachersListOpen(false)} className="rounded-xl">ปิดหน้าต่าง</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="ค้นหาชื่อ หรือ เบอร์โทร..."
                            className="pl-12 h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-none shadow-sm rounded-2xl bg-white">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">นักเรียนทั้งหมด</p>
                                <h3 className="text-2xl font-black text-slate-900">{students.length} คน</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm rounded-2xl bg-white">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">อาจารย์ทั้งหมด</p>
                                <h3 className="text-2xl font-black text-slate-900">{teachers.length} ท่าน</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-800">รายชื่อนักเรียนที่สมัครเข้าระบบ</CardTitle>
                        <Button variant="outline" size="sm" onClick={fetchStudents} className="rounded-lg h-9">รีเฟรช</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="font-medium">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="py-20 text-center text-slate-400">
                                <p className="text-lg">ไม่พบข้อมูลนักเรียน</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="py-5 px-8 font-bold text-slate-600">เลขที่ใบสมัคร</TableHead>
                                            <TableHead className="font-bold text-slate-600">ชื่อ-นามสกุล</TableHead>
                                            <TableHead className="font-bold text-slate-600">ระดับชั้น</TableHead>
                                            <TableHead className="font-bold text-slate-600">เบอร์โทร</TableHead>
                                            <TableHead className="font-bold text-slate-600">รหัสอาจารย์</TableHead>
                                            <TableHead className="font-bold text-slate-600">ผู้รับสมัคร</TableHead>
                                            <TableHead className="font-bold text-slate-600">วันที่สมัคร</TableHead>
                                            <TableHead className="text-right px-8 font-bold text-slate-600">จัดการ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-5 px-8 font-mono text-sm font-bold text-primary">
                                                    #{student.id.slice(0, 8).toUpperCase()}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-800">
                                                    {student.prefix}{student.first_name} {student.last_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-none px-3 py-1">
                                                        {student.apply_level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600 font-medium">{student.phone}</TableCell>
                                                <TableCell className="font-mono text-xs text-indigo-600 font-bold">
                                                    {teachers.find(t => t.name === student.recruiter_name)?.id.slice(0, 6).toUpperCase() || "-"}
                                                </TableCell>
                                                <TableCell className="text-slate-600 font-medium">
                                                    {student.recruiter_name || "-"}
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm">
                                                    {new Date(student.created_at).toLocaleDateString('th-TH', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right px-8">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline" size="icon"
                                                            className="h-9 w-9 border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all rounded-lg"
                                                            title="ดูรายละเอียด"
                                                            onClick={() => handleViewStudent(student)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline" size="icon"
                                                            className="h-9 w-9 border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all rounded-lg"
                                                            title="พิมพ์เอกสาร"
                                                            onClick={() => handlePrint(student)}
                                                        >
                                                            <Printer className="w-4 h-4" />
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
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </div>
    );
};

export default AdminStudents;
