interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    className?: string;
}

const sizes = {
    sm: { icon: 36, text1: "text-sm", text2: "text-xs" },
    md: { icon: 48, text1: "text-base", text2: "text-sm" },
    lg: { icon: 72, text1: "text-xl", text2: "text-sm" },
    xl: { icon: 96, text1: "text-2xl", text2: "text-base" },
};

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
    const s = sizes[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo image from favicon.ico */}
            <img
                src="/favicon.ico"
                alt="Logo มูลนิธิเพื่อการศึกษาปัญญาคำ"
                width={s.icon}
                height={s.icon}
                style={{ width: s.icon, height: s.icon, objectFit: "contain" }}
                className="shrink-0"
            />

            {/* Text */}
            {showText && (
                <div className="leading-tight">
                    <span className={`font-bold text-foreground block ${s.text1}`}>
                        มูลนิธิเพื่อการศึกษา
                    </span>
                    <span className={`font-semibold text-amber-500 ${s.text2}`}>
                        ปัญญาคำ
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
