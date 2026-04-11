import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { TestimonialItem } from "../services/api";

type TestimonialProps = {
  item?: TestimonialItem | null;
};

const fallbackTestimonial: TestimonialItem = {
  id: 1,
  client_name: "Sarah & Dimas",
  client_label: "The Botanica Apartments",
  quote:
    'MikroLiving transformed our 45sqm apartment into a sanctuary. Their attention to storage solutions and aesthetic flow is truly unmatched in the industry.',
  image_url: "https://picsum.photos/seed/client/200/200",
  rating: 5,
  sort_order: 1,
};

export default function Testimonial({ item }: TestimonialProps) {
  const testimonial = item ?? fallbackTestimonial;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-white p-8 sm:p-12 md:p-20 rounded-3xl shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 sm:p-12 text-primary/5">
          <Quote className="w-20 h-20 sm:w-32 sm:h-32" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-headline italic leading-relaxed text-on-surface mb-8 sm:mb-10">
            "{testimonial.quote}"
          </p>
          <div className="flex flex-col items-center">
            <img
              src={testimonial.image_url ?? "https://picsum.photos/seed/client/200/200"}
              alt={testimonial.client_name}
              className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-stone-100"
              referrerPolicy="no-referrer"
            />
            <h5 className="font-headline text-lg">{testimonial.client_name}</h5>
            <p className="text-sm text-on-surface-variant">{testimonial.client_label}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
