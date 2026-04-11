const logoMikroLiving = "/branding/logo_mikroliving_20.svg";

type BrandMarkProps = {
  brandName?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  stacked?: boolean;
  compact?: boolean;
};

const sizeMap = {
  sm: {
    frame: "h-10 w-10",
    title: "text-base sm:text-lg",
    subtitle: "text-[10px] tracking-[0.28em]",
  },
  md: {
    frame: "h-12 w-12",
    title: "text-lg sm:text-xl",
    subtitle: "text-[10px] tracking-[0.32em]",
  },
  lg: {
    frame: "h-16 w-16",
    title: "text-2xl sm:text-3xl",
    subtitle: "text-[11px] tracking-[0.34em]",
  },
} as const;

export default function BrandMark({
  brandName = "MikroLiving",
  size = "md",
  tone = "dark",
  stacked = false,
  compact = false,
}: BrandMarkProps) {
  const palette =
    tone === "light"
      ? {
          title: "text-white",
          subtitle: "text-white/55",
          frame: "bg-white/10 ring-white/10",
        }
      : {
          title: "text-stone-900",
          subtitle: "text-stone-400",
          frame: "bg-white ring-stone-200/80",
        };

  const sizing = sizeMap[size];

  return (
    <div className={`flex min-w-0 items-center gap-3 ${stacked ? "flex-col items-start" : ""}`}>
      <div className={`${sizing.frame} flex shrink-0 items-center justify-center rounded-2xl ring-1 ${palette.frame}`}>
        <img
          src={logoMikroLiving}
          alt={`${brandName} logo`}
          className="h-[82%] w-[82%] object-contain"
        />
      </div>
      <div className={`min-w-0 ${stacked ? "space-y-1" : "space-y-0.5"}`}>
        <p
          className={`font-headline leading-none ${palette.title} ${sizing.title} ${
            compact ? "max-w-[10rem] text-balance break-words sm:max-w-[12rem]" : ""
          }`}
        >
          {brandName}
        </p>
        <p
          className={`uppercase leading-none ${palette.subtitle} ${sizing.subtitle} ${
            compact ? "max-w-[10rem] text-balance sm:max-w-[12rem]" : ""
          }`}
        >
          Interior Studio
        </p>
      </div>
    </div>
  );
}
