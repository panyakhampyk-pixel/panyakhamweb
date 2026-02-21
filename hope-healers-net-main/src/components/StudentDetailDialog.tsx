
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Phone, MapPin, Users, GraduationCap, FileText, Heart, Calendar, IdCard, Weight, Ruler, Activity } from "lucide-react";

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

interface StudentDetailDialogProps {
    student: Student;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentDetailDialog({
    student,
    open,
    onOpenChange,
}: StudentDetailDialogProps) {

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const InfoItem = ({ label, value, icon: Icon }: { label: string, value: string | boolean | undefined, icon?: any }) => (
        <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </p>
            {typeof value === 'boolean' ? (
                <Badge variant={value ? "default" : "outline"} className={value ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "text-slate-300 border-slate-200"}>
                    {value ? "มีแนบมา" : "ไม่มี"}
                </Badge>
            ) : (
                <p className="text-sm font-bold text-slate-700">{value || "-"}</p>
            )}
        </div>
    );

    const SectionHeader = ({ title, icon: Icon, color }: { title: string, icon: any, color: string }) => (
        <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 ${color} text-white rounded-lg flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-slate-50">
                <DialogHeader className="p-8 pb-4 bg-white sticky top-0 z-10 border-b border-slate-50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-slate-900">
                                    {student.prefix}{student.first_name} {student.last_name}
                                </DialogTitle>
                                <p className="text-slate-500 font-bold">ใบสมัครเลขที่ {student.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <Badge className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 text-sm font-bold uppercase transition-all">
                            {student.apply_level}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-10 pb-12">
                    {/* ข้อมูลสมัครเรียน */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <SectionHeader title="ข้อมูลสมัครเรียน" icon={Activity} color="bg-primary" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <InfoItem label="วันที่สมัคร" value={formatDate(student.created_at)} icon={Calendar} />
                            <InfoItem label="ผู้รับสมัคร" value={student.recruiter_name} icon={User} />
                            <InfoItem label="สถานะมัดจำ" value={student.deposit_status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'} />
                            <InfoItem label="สถานะค่าเทอม" value={student.tuition_status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ข้อมูลส่วนตัว */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <SectionHeader title="ข้อมูลส่วนตัว" icon={User} color="bg-blue-500" />
                            <div className="grid grid-cols-2 gap-6">
                                <InfoItem label="เลขบัตรประชาชน" value={student.id_card} icon={IdCard} />
                                <InfoItem label="วันเกิด" value={formatDate(student.birth_date)} icon={Calendar} />
                                <InfoItem label="สถานที่เกิด" value={student.birthplace} />
                                <InfoItem label="ศาสนา" value={student.religion} />
                                <InfoItem label="เชื้อชาติ" value={student.ethnicity} />
                                <InfoItem label="สัญชาติ" value={student.nationality} />
                                <InfoItem label="น้ำหนัก" value={student.weight ? `${student.weight} กก.` : "-"} icon={Weight} />
                                <InfoItem label="ส่วนสูง" value={student.height ? `${student.height} ซม.` : "-"} icon={Ruler} />
                                <div className="col-span-2">
                                    <InfoItem label="โรคประจำตัว" value={student.disease} />
                                </div>
                            </div>
                        </div>

                        {/* ข้อมูลติดต่อ */}
                        <div className="flex flex-col gap-8">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
                                <SectionHeader title="ข้อมูลติดต่อ" icon={Phone} color="bg-emerald-500" />
                                <div className="space-y-6">
                                    <InfoItem label="เบอร์โทรศัพท์" value={student.phone} icon={Phone} />
                                    <InfoItem label="ที่อยู่ตามทะเบียนบ้าน" value={student.registered_address} icon={MapPin} />
                                    <InfoItem label="ที่อยู่ปัจจุบัน" value={student.current_address} icon={MapPin} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูลการศึกษาเดิม */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <SectionHeader title="ประวัติการศึกษาเดิม" icon={GraduationCap} color="bg-rose-500" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="md:col-span-2">
                                <InfoItem label="โรงเรียนเดิม" value={student.old_school} />
                            </div>
                            <InfoItem label="จังหวัด" value={student.old_school_location} />
                            <InfoItem label="เกรดเฉลี่ย (GPA)" value={student.gpa} />
                            <InfoItem label="ปีที่จบ" value={student.graduated_year} />
                            <InfoItem label="วุฒิที่จบ" value={student.education_level} />
                        </div>
                    </div>

                    {/* ข้อมูลครอบครัว */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <SectionHeader title="ข้อมูลบิดา" icon={Users} color="bg-indigo-500" />
                            <div className="space-y-4">
                                <InfoItem label="ชื่อ-นามสกุล" value={student.father_name} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="เลขบัตรประชาชน" value={student.father_id_card} />
                                    <InfoItem label="อาชีพ" value={student.father_occupation} />
                                    <InfoItem label="อายุ" value={student.father_age ? `${student.father_age} ปี` : "-"} />
                                    <InfoItem label="เบอร์โทร" value={student.father_phone} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <SectionHeader title="ข้อมูลมารดา" icon={Users} color="bg-pink-500" />
                            <div className="space-y-4">
                                <InfoItem label="ชื่อ-นามสกุล" value={student.mother_name} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="เลขบัตรประชาชน" value={student.mother_id_card} />
                                    <InfoItem label="อาชีพ" value={student.mother_occupation} />
                                    <InfoItem label="อายุ" value={student.mother_age ? `${student.mother_age} ปี` : "-"} />
                                    <InfoItem label="เบอร์โทร" value={student.mother_phone} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* สถานภาพและพี่น้อง */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <SectionHeader title="สถานภาพครอบครัว" icon={Heart} color="bg-amber-500" />
                                <InfoItem label="สถานภาพบิดา-มารดา" value={
                                    student.parents_status === 'together' ? 'อยู่ด้วยกัน' :
                                        student.parents_status === 'separated' ? 'แยกกันอยู่' :
                                            student.parents_status === 'divorced' ? 'หย่าร้าง' :
                                                student.parents_status === 'father_deceased' ? 'บิดาถึงแก่กรรม' :
                                                    student.parents_status === 'mother_deceased' ? 'มารดาถึงแก่กรรม' : '-'
                                } />
                            </div>
                            <div>
                                <SectionHeader title="ข้อมูลพี่น้อง" icon={Users} color="bg-cyan-500" />
                                <div className="grid grid-cols-3 gap-4">
                                    <InfoItem label="รวมตัวเอง" value={student.siblings_count} />
                                    <InfoItem label="ชาย" value={student.siblings_male} />
                                    <InfoItem label="หญิง" value={student.siblings_female} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูลผู้ปกครอง */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <SectionHeader title="ข้อมูลผู้ปกครอง (กรณีไม่ได้อยู่กับบิดามารดา)" icon={User} color="bg-emerald-600" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="ชื่อ-นามสกุล" value={student.guardian_name} />
                            <InfoItem label="ความสัมพันธ์" value={student.guardian_relation} />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="อายุ" value={student.guardian_age ? `${student.guardian_age} ปี` : "-"} />
                                <InfoItem label="เบอร์โทร" value={student.guardian_phone} />
                            </div>
                            <InfoItem label="อาชีพ" value={student.guardian_occupation} />
                            <div className="col-span-2">
                                <InfoItem label="ที่อยู่ผู้ปกครอง" value={student.guardian_address} />
                            </div>
                        </div>
                    </div>

                    {/* หลักฐานการสมัคร */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <SectionHeader title="หลักฐานการสมัคร" icon={FileText} color="bg-slate-700" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <InfoItem label="สำเนาทะเบียนบ้าน" value={student.doc_house_registration} />
                            <InfoItem label="สำเนาบัตรประชาชน" value={student.doc_id_card} />
                            <InfoItem label="สำเนาวุฒิการศึกษา" value={student.doc_education} />
                            <InfoItem label="รูปถ่าย" value={student.doc_photo} />
                            <InfoItem label="ใบเปลี่ยนชื่อ-สกุล" value={student.doc_name_change} />
                        </div>
                    </div>


                </div>
            </DialogContent>
        </Dialog>
    );
}
