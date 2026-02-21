
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Home, Users, GraduationCap, FileText, Banknote, UserCheck, Loader2, CheckCircle, LogIn, ArrowLeft, Sparkles, Plus, BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const studentSchema = z.object({
    prefix: z.string().optional(),
    first_name: z.string().min(1, "กรุณากรอกชื่อ"),
    last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
    id_card: z.string().optional(),
    birth_date: z.string().optional(),
    ethnicity: z.string().optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    birthplace: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    disease: z.string().optional(),

    registered_address: z.string().optional(),
    current_address: z.string().optional(),
    phone: z.string().optional(),

    father_name: z.string().optional(),
    father_id_card: z.string().optional(),
    father_age: z.string().optional(),
    father_occupation: z.string().optional(),
    father_phone: z.string().optional(),

    mother_name: z.string().optional(),
    mother_id_card: z.string().optional(),
    mother_age: z.string().optional(),
    mother_occupation: z.string().optional(),
    mother_phone: z.string().optional(),

    parents_status: z.string().optional(),

    guardian_name: z.string().optional(),
    guardian_id_card: z.string().optional(),
    guardian_age: z.string().optional(),
    guardian_occupation: z.string().optional(),
    guardian_relation: z.string().optional(),
    guardian_phone: z.string().optional(),
    guardian_address: z.string().optional(),

    siblings_count: z.string().optional(),
    siblings_male: z.string().optional(),
    siblings_female: z.string().optional(),

    old_school: z.string().optional(),
    old_school_location: z.string().optional(),
    gpa: z.string().optional(),
    graduated_year: z.string().optional(),
    education_level: z.string().optional(),
    apply_level: z.string().optional(),

    recruiter_name: z.string().optional(),

    parent_signature_name: z.string().optional(),
    parent_signature_address: z.string().optional(),

    doc_house_registration: z.boolean().default(false),
    doc_id_card: z.boolean().default(false),
    doc_education: z.boolean().default(false),
    doc_photo: z.boolean().default(false),
    doc_name_change: z.boolean().default(false),
});

type StudentFormData = z.infer<typeof studentSchema>;

const StudentRegistration = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [teachers, setTeachers] = useState<{ id: string, name: string, email: string }[]>([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const { data, error } = await supabase
                    .from("teachers")
                    .select("id, name, email")
                    .order("name", { ascending: true });

                if (error) throw error;
                if (data) {
                    setTeachers(data.map(t => ({ id: t.id, name: t.name, email: t.email || "" })));
                }
            } catch (error) {
                console.error("Error fetching teachers", error);
            }
        };
        fetchTeachers();
    }, []);

    const form = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            prefix: "",
            first_name: "",
            last_name: "",
            id_card: "",
            birth_date: "",
            ethnicity: "",
            nationality: "",
            religion: "",
            birthplace: "",
            weight: "",
            height: "",
            disease: "",

            registered_address: "",
            current_address: "",
            phone: "",

            father_name: "",
            father_id_card: "",
            father_age: "",
            father_occupation: "",
            father_phone: "",

            mother_name: "",
            mother_id_card: "",
            mother_age: "",
            mother_occupation: "",
            mother_phone: "",

            parents_status: "together",

            guardian_name: "",
            guardian_id_card: "",
            guardian_age: "",
            guardian_occupation: "",
            guardian_relation: "",
            guardian_phone: "",
            guardian_address: "",

            siblings_count: "1",
            siblings_male: "0",
            siblings_female: "0",

            old_school: "",
            old_school_location: "",
            gpa: "",
            graduated_year: "",
            education_level: "",
            apply_level: "",

            recruiter_name: "",

            parent_signature_name: "",
            parent_signature_address: "",

            doc_house_registration: false,
            doc_id_card: false,
            doc_education: false,
            doc_photo: false,
            doc_name_change: false,
        },
    });

    const onSubmit = async (data: StudentFormData) => {
        setIsSubmitting(true);
        try {
            const studentData = {
                ...data,
                deposit_status: "pending",
                tuition_status: "pending",
                grade_level: data.apply_level || "ไม่ระบุ",
                email: "",
                nickname: "",
            };

            const { error } = await supabase
                .from("students")
                .insert(studentData);

            if (error) throw error;

            setIsSuccess(true);
            toast.success("บันทึกข้อมูลการสมัครเรียนสำเร็จ");
            form.reset();
            window.scrollTo(0, 0);
        } catch (error: any) {
            console.error("Error saving student data:", error);
            toast.error("เกิดข้อผิดพลาด: " + (error.message || "โปรดตรวจสอบการเชื่อมต่อ"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-20 font-sans">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                    <Card className="max-w-lg w-full text-center p-12 rounded-[3.5rem] border-white shadow-2xl bg-white/80 backdrop-blur-xl">
                        <CardContent className="space-y-8">
                            <div className="mx-auto h-24 w-24 bg-blue-50 rounded-[2rem] flex items-center justify-center rotate-12 shadow-inner">
                                <CheckCircle className="h-12 w-12 text-blue-500 -rotate-12" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-slate-900">สมัครเรียนสำเร็จ!</h2>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    ยินดีต้อนรับสู่ครอบครัวปัญญาคำ<br />
                                    เราได้รับข้อมูลการสมัครเรียนของคุณเรียบร้อยแล้ว
                                </p>
                            </div>
                            <Button asChild className="w-full h-16 rounded-2xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 text-xl">
                                <Link to="/">กลับสู่หน้าหลัก</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans">
            <Navbar />

            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-6 group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> ย้อนกลับหน้าหลัก
                        </Link>
                        <div className="relative inline-block">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-6 transform -rotate-6 transition-transform hover:rotate-0">
                                <BookOpen className="w-10 h-10 text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                <Plus className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                            ใบสมัคร <span className="text-primary">เข้าเรียน</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                            วิทยาลัยอาชีวศึกษาเอกปัญญาหริภุญชัย <br />
                            โปรดตรวจสอบข้อมูลให้ถูกต้องครบถ้วนก่อนยืนยันการส่งใบสมัคร
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                            {/* Info Callout */}
                            <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-indigo-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/30">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2 text-center md:text-left relative">
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">สำหรับนักเรียนที่ผ่านการคัดเลือก</h3>
                                    <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                                        แบบฟอร์มนี้สงวนสิทธิ์สำหรับ "นักเรียนที่ผ่านการคัดเลือกจากอาจารย์และอาจารย์รับสมัคร" เท่านั้น <br />
                                        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อดำเนินการในขั้นตอนต่อไป
                                    </p>
                                </div>
                            </div>


                            {/* 0. อาจารย์ผู้รับสมัคร */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-md">
                                <CardHeader className="bg-primary/5 pb-8">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-primary">
                                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                                            <UserCheck className="h-6 w-6" />
                                        </div>
                                        อาจารย์ผู้รับสมัคร
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10">
                                    <FormField
                                        control={form.control}
                                        name="recruiter_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-600 mb-2 block">เลือกอาจารย์ที่รับสมัคร</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all">
                                                            <SelectValue placeholder="เลือกอาจารย์..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                        {teachers.map((t) => (
                                                            <SelectItem key={t.id} value={t.name} className="py-2.5 rounded-xl">
                                                                {t.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* 1. ข้อมูลนักเรียน */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-8 border-b border-slate-50">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                                            <User className="h-6 w-6" />
                                        </div>
                                        ข้อมูลผู้สมัคร/นักเรียน
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name="prefix"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-600">คำนำหน้าชื่อ</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50">
                                                                    <SelectValue placeholder="เลือก" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ด.ช.">ด.ช.</SelectItem>
                                                                <SelectItem value="ด.ญ.">ด.ญ.</SelectItem>
                                                                <SelectItem value="นาย">นาย</SelectItem>
                                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <FormField
                                                control={form.control}
                                                name="first_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-600">ชื่อจริง</FormLabel>
                                                        <FormControl><Input className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name="last_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-600">นามสกุล</FormLabel>
                                                        <FormControl><Input className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="id_card"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-600">เลขประจำตัวประชาชน</FormLabel>
                                                    <FormControl><Input maxLength={13} className="h-14 rounded-2xl bg-slate-50" placeholder="x-xxxx-xxxxx-xx-x" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="birth_date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-600">วันเดือนปีเกิด</FormLabel>
                                                    <FormControl><Input type="date" className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="birthplace"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-600">สถานที่เกิด (จังหวัด)</FormLabel>
                                                    <FormControl><Input className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="ethnicity"
                                            render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold text-slate-600">เชื้อชาติ</FormLabel><FormControl><Input className="h-14 rounded-2xl bg-slate-50" placeholder="ไทย" {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="nationality"
                                            render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold text-slate-600">สัญชาติ</FormLabel><FormControl><Input className="h-14 rounded-2xl bg-slate-50" placeholder="ไทย" {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="religion"
                                            render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold text-slate-600">ศาสนา</FormLabel><FormControl><Input className="h-14 rounded-2xl bg-slate-50" placeholder="พุทธ" {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold text-slate-600">น้ำหนัก (กก.)</FormLabel><FormControl><Input type="number" className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="height"
                                            render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold text-slate-600">ส่วนสูง (ซม.)</FormLabel><FormControl><Input type="number" className="h-14 rounded-2xl bg-slate-50" {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="disease"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-600">โรคประจำตัว (ถ้าไม่มีให้พิมพ์ 'ไม่มี')</FormLabel>
                                                <FormControl><Textarea className="min-h-[80px] rounded-2xl bg-slate-50 focus:bg-white transition-all shadow-inner border-slate-100" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* 2. ที่อยู่ */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-8 border-b border-slate-50">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                                        <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                                            <Home className="h-6 w-6" />
                                        </div>
                                        ที่อยู่การติดต่อ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="registered_address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-600">ที่อยู่ตามทะเบียนบ้าน</FormLabel>
                                                <FormControl><Textarea className="min-h-[100px] rounded-2xl bg-slate-50 focus:bg-white transition-all shadow-inner border-slate-100" placeholder="บ้านเลขที่ หมู่ หมู่บ้าน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <Checkbox id="sameAddress" onCheckedChange={(checked) => {
                                            if (checked) {
                                                form.setValue("current_address", form.getValues("registered_address"));
                                            }
                                        }} />
                                        <Label htmlFor="sameAddress" className="text-sm font-bold text-slate-500">ที่อยู่ปัจจุบันเสมือนที่อยู่ตามทะเบียนบ้าน</Label>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="current_address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-600">ที่อยู่ปัจจุบันที่สามารถติดต่อได้</FormLabel>
                                                <FormControl><Textarea className="min-h-[100px] rounded-2xl bg-slate-50 focus:bg-white transition-all shadow-inner border-slate-100" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-600">เบอร์โทรศัพท์มือถือที่ติดต่อได้</FormLabel>
                                                <FormControl><Input className="h-14 rounded-2xl bg-slate-50" placeholder="0xx-xxx-xxxx" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* 3. ข้อมูลครอบครัว */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-8 border-b border-slate-50">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                                        <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        ข้อมูลบิดา - มารดา
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-10">
                                    {/* Father */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-indigo-600 border-l-4 border-indigo-600 pl-4 py-1">ข้อมูลบิดา</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField control={form.control} name="father_name" render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel className="font-bold">ชื่อ - นามสกุลบิดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="father_id_card" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">เลขบัตรประชาชนบิดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="father_age" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">อายุ (ปี)</FormLabel><FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="father_occupation" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">อาชีพ</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="father_phone" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">เบอร์โทรศัพท์บิดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100" />

                                    {/* Mother */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-pink-500 border-l-4 border-pink-500 pl-4 py-1">ข้อมูลมารดา</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField control={form.control} name="mother_name" render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel className="font-bold">ชื่อ - นามสกุลมารดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="mother_id_card" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">เลขบัตรประชาชนมารดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="mother_age" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">อายุ (ปี)</FormLabel><FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="mother_occupation" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">อาชีพ</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="mother_phone" render={({ field }) => (
                                                <FormItem><FormLabel className="font-bold">เบอร์โทรศัพท์มารดา</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                            )} />
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100" />

                                    <FormField
                                        control={form.control}
                                        name="parents_status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-black text-slate-700">สถานภาพบิดา – มารดา</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                                                            <SelectValue placeholder="เลือกสถานภาพ" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="together">อยู่ด้วยกัน</SelectItem>
                                                        <SelectItem value="separated">แยกกันอยู่</SelectItem>
                                                        <SelectItem value="divorced">หย่าร้าง</SelectItem>
                                                        <SelectItem value="father_deceased">บิดาถึงแก่กรรม</SelectItem>
                                                        <SelectItem value="mother_deceased">มารดาถึงแก่กรรม</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* 4. ผู้ปกครอง */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-8 border-b border-slate-50">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                            <UserCheck className="h-6 w-6" />
                                        </div>
                                        ข้อมูลผู้ปกครอง (กรณีไม่ได้อยู่กับบิดามารดา)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="guardian_name" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel className="font-bold">ชื่อ - สกุลผู้ปกครอง</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="guardian_id_card" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">เลขประจำตัวประชาชน</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="guardian_age" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">อายุ (ปี)</FormLabel><FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="guardian_phone" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">เบอร์โทรศัพท์ติดต่อ</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="guardian_relation" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">ความสัมพันธ์กับนักเรียน</FormLabel><FormControl><Input className="h-12 rounded-xl" placeholder="เช่น ลุง, ป้า, พี่..." {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="guardian_address" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel className="font-bold">ที่อยู่ผู้ปกครอง</FormLabel><FormControl><Textarea className="min-h-[80px] rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 5. ข้อมูลการศึกษาเดิม */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-8 border-b border-slate-50">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                                        <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center">
                                            <GraduationCap className="h-6 w-6" />
                                        </div>
                                        ข้อมูลการศึกษาเดิม
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="old_school" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel className="font-bold">โรงเรียนเดิมล่าสุด</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="old_school_location" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">จังหวัดที่โรงเรียนเดิมตั้งอยู่</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="gpa" render={({ field }) => (
                                            <FormItem><FormLabel className="font-bold">เกรดเฉลี่ย (GPA)</FormLabel><FormControl><Input className="h-12 rounded-xl" placeholder="0.00" {...field} /></FormControl></FormItem>
                                        )} />
                                        <FormField control={form.control} name="apply_level" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel className="font-black text-primary">ระดับชั้นและสาขางานที่ต้องการสมัครเข้าเรียน</FormLabel><FormControl><Input className="h-14 rounded-xl border-primary/20 bg-primary/5 font-bold" placeholder="เช่น ปวช.1 คอมพิวเตอร์ธุรกิจ" {...field} /></FormControl></FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 6. เอกสารแนบ */}
                            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                                <CardHeader className="pb-4 px-8 md:px-10 pt-8">
                                    <CardTitle className="text-2xl font-black text-slate-700 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        หลักฐานที่แนบ (นำมาส่งวันที่มอบตัว)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="doc_house_registration" render={({ field }) => (
                                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-bold text-slate-600 cursor-pointer">สำเนาทะเบียนบ้าน</FormLabel>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="doc_id_card" render={({ field }) => (
                                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-bold text-slate-600 cursor-pointer">สำเนาบัตรประชาชน (ผู้สมัคร/ผู้ปกครอง)</FormLabel>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="doc_education" render={({ field }) => (
                                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-bold text-slate-600 cursor-pointer">สำเนาวุฒิการศึกษา</FormLabel>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="doc_photo" render={({ field }) => (
                                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-bold text-slate-600 cursor-pointer">รูปถ่าย</FormLabel>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>



                            {/* Submit */}
                            <div className="pt-6 relative group">
                                <div className="absolute -inset-1 bg-primary rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition-all"></div>
                                <Button type="submit" disabled={isSubmitting} className="w-full h-20 rounded-[2.5rem] text-3xl font-black bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98] relative">
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-3 h-8 w-8 animate-spin" /> กำลังส่งข้อมูลใบสมัคร...</>
                                    ) : (
                                        <>ส่งใบสมัครเข้าเรียน <CheckCircle className="ml-3 w-8 h-8" /></>
                                    )}
                                </Button>
                                <p className="text-center mt-6 text-sm text-slate-400 font-bold uppercase tracking-widest">
                                    * กรุณาแคปหน้าจอเมื่อส่งข้อมูลสำเร็จเพื่อเป็นหลักฐาน
                                </p>
                            </div>

                        </form>
                    </Form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StudentRegistration;
