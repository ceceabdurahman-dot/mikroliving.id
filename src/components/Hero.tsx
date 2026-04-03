import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

type HeroProps = {
  settings?: Record<string, string>;
};

type HeroStat = {
  label: string;
  value: string;
};

const fallbackStats: HeroStat[] = [
  { label: "Projects", value: "150+" },
  { label: "Satisfaction", value: "98%" },
  { label: "Years Exp.", value: "10+" },
];

function parseStats(value?: string) {
  if (!value) {
    return fallbackStats;
  }

  try {
    const parsed = JSON.parse(value) as HeroStat[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallbackStats;
  } catch {
    return fallbackStats;
  }
}

export default function Hero({ settings }: HeroProps) {
  const stats = parseStats(settings?.hero_stats);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 z-10 space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline leading-tight text-on-surface">
            {settings?.hero_headline ?? "Designing Smart Living Spaces"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-lg font-light leading-relaxed">
            {settings?.hero_subheadline ??
              "Creating Elegant & Functional Interiors that resonate with your lifestyle and personality."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-on-primary px-6 sm:px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300"
            >
              {settings?.hero_primary_cta_label ?? "View Portfolio"}
              <ArrowUpRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto border border-outline-variant/20 hover:bg-stone-50 text-primary px-6 sm:px-8 py-4 rounded-lg font-bold text-center transition-all duration-300"
            >
              {settings?.hero_secondary_cta_label ?? "Book Consultation"}
            </a>
          </div>
          <div className="pt-8 sm:pt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-headline text-primary">{stat.value}</p>
                <p className="text-[11px] sm:text-sm text-on-surface-variant uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-6 relative h-[360px] sm:h-[460px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={settings?.hero_image_url ?? "https://picsum.photos/seed/interior1/1200/1200"}
            alt="Modern Interior Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}

