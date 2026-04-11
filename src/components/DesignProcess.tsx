import { motion } from "motion/react";

const steps = [
  { id: "01", title: "Consultation", sub: "Initial Discovery" },
  { id: "02", title: "Concept", sub: "Mood & Style" },
  { id: "03", title: "3D Design", sub: "Visualization" },
  { id: "04", title: "Production", sub: "Fabrication" },
  { id: "05", title: "Installation", sub: "Final Setup" }
];

export default function DesignProcess() {
  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-headline text-center mb-12 sm:mb-20">Design Process</h2>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold">{step.id}</span>
                </div>
                <h4 className="font-headline mb-2">{step.title}</h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">{step.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
