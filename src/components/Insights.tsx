import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InsightItem } from "../services/api";

type InsightsProps = {
  items?: InsightItem[];
};

const fallbackInsights: InsightItem[] = [
  {
    id: 1,
    tag: "Trends",
    slug: "maximizing-space-in-compact-apartments",
    title: "Maximizing Space in Compact Apartments",
    excerpt: "Discover clever furniture hacks and architectural tricks to make small spaces feel twice their size.",
    image_url: "https://picsum.photos/seed/blog1/600/400",
    sort_order: 1,
  },
  {
    id: 2,
    tag: "Aesthetics",
    slug: "choosing-the-perfect-earth-tone-palette",
    title: "Choosing the Perfect Earth-Tone Palette",
    excerpt: "Why organic colors are dominating modern interiors and how to pair them with raw materials.",
    image_url: "https://picsum.photos/seed/blog2/600/400",
    sort_order: 2,
  },
  {
    id: 3,
    tag: "Material",
    slug: "the-rise-of-sustainable-wood-in-decor",
    title: "The Rise of Sustainable Wood in Decor",
    excerpt: "Exploring ethically sourced timber options that add warmth without harming the planet.",
    image_url: "https://picsum.photos/seed/blog3/600/400",
    sort_order: 3,
  },
];

export default function Insights({ items }: InsightsProps) {
  const insights = items && items.length > 0 ? items : fallbackInsights;

  return (
    <section id="insights" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-headline">Latest Insights</h2>
          <a href="/insights" className="text-primary font-bold flex items-center gap-2 group">
            Explore Blog
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <a href={`/insights/${item.slug}`} className="block">
                <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-stone-100">
                  <img
                    src={item.image_url ?? "https://picsum.photos/seed/blog-fallback/600/400"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </a>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{item.tag}</span>
              <a href={`/insights/${item.slug}`} className="block">
                <h4 className="text-xl font-headline mt-2 mb-4 group-hover:text-primary transition-colors">{item.title}</h4>
              </a>
              <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">{item.excerpt}</p>
              <a href={`/insights/${item.slug}`} className="text-sm font-bold border-b-2 border-primary/20 pb-1 hover:border-primary transition-colors">
                Read More
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
