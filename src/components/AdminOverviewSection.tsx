import { AdminDashboardSummary, ContactChannel, InsightItem, NavigationLink, ServiceItem } from "../services/api";

const summaryCards = [
  { key: "projects_total", label: "Projects", hint: "Portfolio items" },
  { key: "services_total", label: "Services", hint: "Homepage offerings" },
  { key: "insights_total", label: "Insights", hint: "Editorial entries" },
  { key: "testimonials_total", label: "Testimonials", hint: "Social proof" },
  { key: "inquiries_total", label: "Inquiries", hint: "Leads captured" },
  { key: "new_inquiries", label: "New Inbox", hint: "Need response" },
] as const;

type Props = {
  summary: AdminDashboardSummary;
  services: ServiceItem[];
  insights: InsightItem[];
  navigationLinks: NavigationLink[];
  contactChannels: ContactChannel[];
};

function formatTimestamp(value?: string | null) {
  if (!value) return "Belum ada inquiry masuk";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminOverviewSection({
  summary,
  services,
  insights,
  navigationLinks,
  contactChannels,
}: Props) {
  const publishingHealth = [
    { label: "Active Services", value: summary.active_services },
    { label: "Published Insights", value: summary.published_insights },
    { label: "Active Testimonials", value: summary.active_testimonials },
    { label: "Featured Projects", value: summary.featured_projects },
  ];

  const topServices = services.slice(0, 3);
  const latestInsights = insights.slice(0, 3);
  const headerLinks = navigationLinks.filter((item) => item.location === "header");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_42%),linear-gradient(135deg,_rgba(245,158,11,0.16),_rgba(15,23,42,0.92)_48%,_rgba(14,165,233,0.14))] p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Command Center</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-headline sm:text-4xl">Dashboard utama untuk seluruh pengalaman frontend MikroLiving.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Pantau kesehatan konten, jumlah lead masuk, dan elemen yang paling sering disentuh dalam satu permukaan kerja.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/80">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Latest inquiry: {formatTimestamp(summary.latest_inquiry_at)}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Header links: {headerLinks.length}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Contact channels: {contactChannels.length}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {publishingHealth.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/55">{item.label}</p>
                <p className="mt-3 text-3xl font-headline">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <article key={card.key} className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400">{card.label}</p>
            <p className="mt-3 text-4xl font-headline text-stone-950">{summary[card.key]}</p>
            <p className="mt-2 text-sm text-stone-500">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Service Stack</p>
              <h3 className="mt-2 text-2xl font-headline text-stone-950">Front-facing service highlights</h3>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{summary.active_services} active</span>
          </div>
          <div className="mt-6 space-y-4">
            {topServices.map((service) => (
              <div key={service.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-400">{service.icon_key}</p>
                    <h4 className="mt-2 text-lg font-headline text-stone-950">{service.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{service.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${service.is_active ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"}`}>
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Latest Insights</p>
          <h3 className="mt-2 text-2xl font-headline text-stone-950">Editorial feed snapshot</h3>
          <div className="mt-6 space-y-4">
            {latestInsights.map((insight) => (
              <div key={insight.id} className="rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{insight.tag}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${insight.is_published ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"}`}>
                    {insight.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <h4 className="mt-4 text-lg font-headline text-stone-950">{insight.title}</h4>
                <p className="mt-2 text-sm leading-6 text-stone-600">{insight.excerpt}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
