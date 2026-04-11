import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api, Project } from "../services/api";

export default function SignatureProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (fetchError) {
        console.error("Failed to fetch projects:", fetchError);
        setError("We couldn't load the latest projects right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <section id="portfolio" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-headline mb-4"
            >
              Signature Projects
            </motion.h2>
            <p className="text-on-surface-variant">
              A curated selection of our finest work across diverse residential scales and styles.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-4 sm:gap-6 text-sm font-medium overflow-x-auto no-scrollbar pb-2">
            {["All", "Apartment", "Residential", "Kitchen", "Bedroom"].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={
                  filter === category
                    ? "text-primary border-b-2 border-primary pb-1 shrink-0"
                    : "text-on-surface-variant hover:text-primary transition-colors shrink-0"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="aspect-[16/10] bg-stone-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            <p className="font-medium">{error}</p>
            <p className="mt-2 text-sm text-red-600">Please refresh the page or try again in a moment.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-8 text-center text-on-surface-variant">
            No projects match the selected category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer bg-stone-50 rounded-xl overflow-hidden hover:bg-stone-100 transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xl font-headline">{project.title}</h3>
                    <ArrowRight className="w-5 h-5 shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex gap-4 text-sm text-on-surface-variant">
                    <span>{project.location}</span>
                    <span className="text-outline-variant/30">&bull;</span>
                    <span>{project.size}</span>
                  </div>
                  {project.description ? (
                    <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                      {project.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
