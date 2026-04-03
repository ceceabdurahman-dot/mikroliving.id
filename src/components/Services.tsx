import { motion } from "motion/react";
import { Building2, Hammer, Layout, LucideIcon, Sofa } from "lucide-react";
import { ServiceItem } from "../services/api";

type ServicesProps = {
  items?: ServiceItem[];
};

const iconMap: Record<string, LucideIcon> = {
  Layout,
  Building2,
  Sofa,
  Hammer,
};

const fallbackServices: ServiceItem[] = [
  {
    id: 1,
    icon_key: "Layout",
    title: "Interior Design",
    description: "Comprehensive conceptual and technical planning for any space.",
    sort_order: 1,
  },
  {
    id: 2,
    icon_key: "Building2",
    title: "Apartment Design",
    description: "Specialized solutions for compact living and high-rise dwellings.",
    sort_order: 2,
  },
  {
    id: 3,
    icon_key: "Sofa",
    title: "Custom Furniture",
    description: "Bespoke pieces crafted specifically for your home's dimensions.",
    sort_order: 3,
  },
  {
    id: 4,
    icon_key: "Hammer",
    title: "Design & Build",
    description: "Integrated project management from concept to completion.",
    sort_order: 4,
  },
];

export default function Services({ items }: ServicesProps) {
  const services = items && items.length > 0 ? items : fallbackServices;

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div id="studio" className="relative -top-24"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-headline mb-4">Our Services</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            From spatial planning to bespoke furniture, we provide end-to-end interior solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon_key] ?? Layout;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white rounded-xl hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-lg font-headline mb-3">{service.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
