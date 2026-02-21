import { useState } from "react";
import { Copy, Check, Heart, Building2, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DonateSection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const accountNumber = "144-1-80242-7";

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber.replace(/-/g, ""));
    setCopied(true);
    toast({ title: "คัดลอกเลขบัญชีแล้ว", description: accountNumber });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Column: Bank Card (Visual Representation of Account) */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative group max-w-md mx-auto lg:mx-0">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-primary opacity-10 filter blur-3xl transform -rotate-6"></div>

              {/* Premium Bank Card UI */}
              <div className="relative bg-gradient-to-br from-primary to-blue-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-white overflow-hidden active:scale-95 transition-transform duration-300">
                {/* Bank Logo / Icon */}
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-70">บัญชีสำหรับการบริจาค</p>
                    <p className="font-bold text-lg">ธนาคารกสิกรไทย</p>
                  </div>
                </div>

                {/* Account Number Section */}
                <div className="mb-10">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2">บัญชีเลขที่</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl md:text-3xl font-mono font-black tracking-widest">
                      {accountNumber}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={copyAccount}
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-1">ชื่อบัญชี</p>
                    <p className="text-xl font-bold">มูลนิธิเพื่อการศึกษาปัญญาคำ</p>
                  </div>
                  <Sparkles className="w-8 h-8 opacity-20" />
                </div>

                {/* Chip-like decoration */}
                <div className="absolute top-1/2 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              {/* Click to copy hint */}
              <p className="text-center mt-6 text-sm text-muted-foreground font-medium animate-bounce">
                คลิกที่ปุ่มเพื่อคัดลอกเลขบัญชี
              </p>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              </div>
              <span className="text-sm font-black text-rose-500 uppercase tracking-widest">Make an Impact</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
              ร่วมบริจาคเพื่อเป็น <br />
              <span className="text-primary italic">ส่วนหนึ่งในการช่วยเหลือ</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">
                มอบโอกาสทางการศึกษา พัฒนาคุณภาพชีวิตที่ดีขึ้น สร้างสรรค์สังคม ชีวิตที่มีคุณภาพ
              </p>
              <div className="bg-slate-50 border-l-4 border-slate-200 p-6 rounded-r-2xl">
                <p>
                  (สามารถบริจาคเป็นสิ่งของ หรือเป็นเงินเพื่อส่งต่อให้กับผู้ต้องการความช่วยเหลือ
                  เพื่อสามารถนำสิ่งนี้ให้มีประโยชน์และมีค่าน้อยที่สุด)
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-warm-gradient hover:opacity-90 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-amber-500/20">
                <a href="/donate">
                  ส่งหลักฐานการบริจาค
                </a>
              </Button>
              <div className="flex items-center gap-3 px-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-sm text-muted-foreground font-medium leading-tight">
                  จัดส่งสิ่งของบริจาคได้ที่ <br />
                  <span className="text-foreground">ที่อยู่มูลนิธิ (หน้าติดต่อ)</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DonateSection;
