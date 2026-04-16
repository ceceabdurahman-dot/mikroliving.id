import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HomepageContent, InsightItem, Project, api } from "../services/api";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { formatPublicDate, resolveContactHref } from "./publicSiteUtils";

type SharedPageProps = {
  homepage?: HomepageContent | null;
};

type DetailPageProps = SharedPageProps & {
  projectId?: number;
  slug?: string;
};

type LegalSection = {
  title: string;
  paragraphs: string[];
};

const privacySections: LegalSection[] = [
  {
    title: "Informasi yang Kami Kumpulkan",
    paragraphs: [
      "Kami mengumpulkan informasi yang Anda kirimkan secara langsung saat mengisi formulir konsultasi, termasuk nama, email, nomor telepon, dan detail proyek yang Anda bagikan kepada tim MikroLiving.",
      "Kami juga dapat menyimpan data teknis dasar seperti alamat IP, jenis browser, dan waktu akses untuk menjaga keamanan sistem, menganalisis performa situs, dan menindaklanjuti permintaan yang masuk.",
    ],
  },
  {
    title: "Cara Kami Menggunakan Data",
    paragraphs: [
      "Data digunakan untuk merespons inquiry, menyiapkan proposal layanan, menjadwalkan konsultasi, dan memberikan pembaruan yang relevan mengenai proyek atau layanan yang Anda minta.",
      "Kami tidak menjual data pribadi Anda. Informasi hanya digunakan secara internal oleh tim yang berwenang atau oleh penyedia layanan yang membantu operasional situs dan komunikasi bisnis kami.",
    ],
  },
  {
    title: "Penyimpanan dan Perlindungan",
    paragraphs: [
      "Kami menyimpan data pada sistem yang diproteksi dengan kontrol akses, autentikasi admin, pencatatan sesi, dan pembatasan akses berbasis peran agar hanya personel yang relevan yang dapat melihat data Anda.",
      "Walau kami menerapkan upaya teknis dan organisasional yang wajar, tidak ada metode transmisi atau penyimpanan digital yang bisa dijamin 100% bebas risiko.",
    ],
  },
  {
    title: "Hak Anda",
    paragraphs: [
      "Anda dapat meminta pembaruan, koreksi, atau penghapusan informasi pribadi yang pernah Anda kirimkan melalui situs ini, sepanjang permintaan tersebut tidak bertentangan dengan kewajiban hukum atau kebutuhan dokumentasi bisnis kami.",
      "Untuk pertanyaan privasi, Anda dapat menghubungi kami melalui kanal kontak resmi yang tercantum pada situs MikroLiving.",
    ],
  },
];

const termsSections: LegalSection[] = [
  {
    title: "Penggunaan Situs",
    paragraphs: [
      "Dengan mengakses situs MikroLiving, Anda setuju menggunakan situs ini hanya untuk tujuan yang sah, termasuk mencari informasi layanan, melihat portofolio, membaca insight, dan mengirim inquiry bisnis.",
      "Anda tidak diperkenankan mencoba mengganggu operasional situs, mengakses area admin tanpa izin, mengirim data palsu, atau melakukan tindakan yang berpotensi merusak integritas sistem kami.",
    ],
  },
  {
    title: "Konten dan Kekayaan Intelektual",
    paragraphs: [
      "Seluruh materi di situs ini, termasuk teks, desain, visual, identitas merek, dan struktur konten, dimiliki atau digunakan secara sah oleh MikroLiving dan tidak boleh disalin atau digunakan kembali tanpa izin tertulis.",
      "Portofolio dan insight ditampilkan untuk tujuan informasi dan referensi. Detail proyek aktual dapat berbeda tergantung kebutuhan klien, lokasi, ketersediaan material, dan kondisi lapangan.",
    ],
  },
  {
    title: "Hubungan Layanan",
    paragraphs: [
      "Pengiriman inquiry melalui situs ini tidak otomatis membentuk hubungan kontraktual. Hubungan kerja sama hanya dianggap berlaku setelah ada kesepakatan tertulis atau dokumen komersial yang disetujui kedua pihak.",
      "Kami berhak menolak, menunda, atau menghentikan korespondensi apabila ditemukan penyalahgunaan sistem, permintaan yang tidak sah, atau kondisi operasional yang mengharuskan demikian.",
    ],
  },
  {
    title: "Perubahan Ketentuan",
    paragraphs: [
      "Kami dapat memperbarui Terms of Service ini sewaktu-waktu untuk menyesuaikan perubahan layanan, praktik operasional, atau kebutuhan kepatuhan. Versi terbaru akan selalu ditampilkan di halaman ini.",
      "Dengan terus menggunakan situs setelah perubahan dipublikasikan, Anda dianggap memahami dan menerima versi ketentuan yang berlaku saat itu.",
    ],
  },
];

function PublicPageShell({ homepage, children }: SharedPageProps & { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar brandName={homepage?.settings.brand_name} navigationLinks={homepage?.navigation_links} />
      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">{children}</main>
      <Footer
        brandName={homepage?.settings.brand_name}
        tagline={homepage?.settings.footer_tagline}
        copyright={homepage?.settings.footer_copyright}
        navigationLinks={homepage?.navigation_links}
        contactChannels={homepage?.contact_channels}
      />
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  intro,
  meta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  meta?: string[];
}) {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.22),_transparent_32%),linear-gradient(135deg,_#0c0a09,_#1c1917_48%,_#f5f5f4)] px-6 py-10 text-white shadow-[0_28px_90px_rgba(15,23,42,0.18)] sm:px-10 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="text-xs uppercase tracking-[0.35em] text-white/55">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-headline leading-tight sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">{intro}</p>
        {meta && meta.length > 0 ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {meta.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="mx-auto mt-8 max-w-7xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  );
}

function ErrorPanel({ message, backHref, backLabel }: { message: string; backHref: string; backLabel: string }) {
  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-sm">
      <p className="text-lg font-semibold text-red-800">{message}</p>
      <a href={backHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-700">
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </a>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`/projects/${project.id}`}
      className="group overflow-hidden rounded-[1.8rem] border border-stone-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={project.image_url}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{project.category}</p>
            <h2 className="mt-3 text-2xl font-headline text-stone-950">{project.title}</h2>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {project.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            {project.size}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-600">{project.description}</p>
      </div>
    </a>
  );
}

function InsightCard({ item }: { item: InsightItem }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-stone-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <a href={`/insights/${item.slug}`} className="block">
        <div className="aspect-video overflow-hidden bg-stone-100">
          <img
            src={item.image_url ?? "https://picsum.photos/seed/blog-fallback/600/400"}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      </a>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{item.tag}</span>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-400">
            <CalendarDays className="h-4 w-4" />
            {formatPublicDate(item.published_at)}
          </span>
        </div>
        <a href={`/insights/${item.slug}`} className="mt-3 block text-2xl font-headline text-stone-950 transition-colors group-hover:text-primary">
          {item.title}
        </a>
        <p className="mt-4 text-sm leading-7 text-stone-600">{item.excerpt}</p>
        <a href={`/insights/${item.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Baca selengkapnya
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export function ProjectsPage({ homepage }: SharedPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    document.title = "Projects | MikroLiving";
    api.getProjects()
      .then((items) => setProjects(items))
      .catch((fetchError) => {
        console.error("Failed to load projects page:", fetchError);
        setError("Halaman projects belum bisa dimuat saat ini.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const filteredProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <PublicPageShell homepage={homepage}>
      <PageHero
        eyebrow="Portfolio"
        title="Lihat seluruh proyek MikroLiving dalam satu halaman yang rapi."
        intro="Halaman ini merangkum proyek interior yang sudah dipublikasikan, lengkap dengan kategori, lokasi, ukuran ruang, dan narasi singkat untuk membantu calon klien memahami pendekatan desain kami."
        meta={["Published Projects", `${projects.length || 0} entries`]}
      />

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === category
                  ? "bg-stone-950 text-white"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-stone-950"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading ? <LoadingPanel label="Memuat daftar proyek..." /> : null}
      {!loading && error ? <ErrorPanel message={error} backHref="/" backLabel="Kembali ke homepage" /> : null}
      {!loading && !error ? (
        <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : null}
    </PublicPageShell>
  );
}

export function ProjectDetailPage({ homepage, projectId }: DetailPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("Project tidak ditemukan.");
      setLoading(false);
      return;
    }

    Promise.all([api.getProjectById(projectId), api.getProjects()])
      .then(([projectItem, allProjects]) => {
        setProject(projectItem);
        setProjects(allProjects);
        document.title = `${projectItem.title} | Projects | MikroLiving`;
      })
      .catch((fetchError) => {
        console.error("Failed to load project detail:", fetchError);
        setError("Project yang kamu cari belum tersedia.");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const relatedProjects = useMemo(
    () => projects.filter((item) => item.id !== project?.id).slice(0, 3),
    [project?.id, projects],
  );
  const contactHref = resolveContactHref(typeof window !== "undefined" ? window.location.pathname : "/projects");

  return (
    <PublicPageShell homepage={homepage}>
      <a href="/projects" className="mx-auto flex max-w-7xl items-center gap-2 text-sm font-semibold text-stone-600">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar projects
      </a>

      {loading ? <LoadingPanel label="Memuat detail project..." /> : null}
      {!loading && error ? <ErrorPanel message={error} backHref="/projects" backLabel="Lihat semua projects" /> : null}
      {!loading && !error && project ? (
        <>
          <section className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm">
              <img
                src={project.image_url}
                alt={project.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">{project.category}</p>
              <h1 className="mt-4 text-4xl font-headline text-stone-950">{project.title}</h1>
              <div className="mt-5 flex flex-wrap gap-5 text-sm text-stone-500">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {project.size}
                </span>
              </div>
              <p className="mt-6 text-sm leading-8 text-stone-600">{project.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={contactHref} className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">
                  Diskusikan proyek serupa
                </a>
                <a href="/projects" className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700">
                  Jelajahi portfolio lain
                </a>
              </div>
            </div>
          </section>

          {relatedProjects.length > 0 ? (
            <section className="mx-auto mt-10 max-w-7xl">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">Related Projects</p>
                <h2 className="mt-3 text-3xl font-headline text-stone-950">Lanjutkan eksplorasi portfolio.</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedProjects.map((item) => (
                  <ProjectCard key={item.id} project={item} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </PublicPageShell>
  );
}

export function InsightsPage({ homepage }: SharedPageProps) {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Insights | MikroLiving";
    api.getInsights()
      .then((items) => setInsights(items))
      .catch((fetchError) => {
        console.error("Failed to load insights page:", fetchError);
        setError("Halaman insights belum bisa dimuat saat ini.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicPageShell homepage={homepage}>
      <PageHero
        eyebrow="Editorial"
        title="Kumpulan insight interior yang bisa dibuka satu per satu."
        intro="Mulai dari strategi ruang kompak sampai arah material dan warna, halaman ini merangkum seluruh artikel publik MikroLiving agar pengunjung bisa membaca lebih dalam tanpa berhenti di homepage."
        meta={["Published Insights", `${insights.length || 0} articles`]}
      />

      {loading ? <LoadingPanel label="Memuat daftar insight..." /> : null}
      {!loading && error ? <ErrorPanel message={error} backHref="/" backLabel="Kembali ke homepage" /> : null}
      {!loading && !error ? (
        <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
        </section>
      ) : null}
    </PublicPageShell>
  );
}

export function InsightDetailPage({ homepage, slug }: DetailPageProps) {
  const [insight, setInsight] = useState<InsightItem | null>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Insight tidak ditemukan.");
      setLoading(false);
      return;
    }

    Promise.all([api.getInsightBySlug(slug), api.getInsights()])
      .then(([insightItem, allInsights]) => {
        setInsight(insightItem);
        setInsights(allInsights);
        document.title = `${insightItem.title} | Insights | MikroLiving`;
      })
      .catch((fetchError) => {
        console.error("Failed to load insight detail:", fetchError);
        setError("Insight yang kamu cari belum tersedia.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedInsights = useMemo(
    () => insights.filter((item) => item.slug !== insight?.slug).slice(0, 3),
    [insight?.slug, insights],
  );
  const paragraphs = useMemo(() => {
    const content = insight?.content?.trim() || insight?.excerpt || "";
    return content
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [insight?.content, insight?.excerpt]);

  return (
    <PublicPageShell homepage={homepage}>
      <a href="/insights" className="mx-auto flex max-w-4xl items-center gap-2 text-sm font-semibold text-stone-600">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar insights
      </a>

      {loading ? <LoadingPanel label="Memuat artikel insight..." /> : null}
      {!loading && error ? <ErrorPanel message={error} backHref="/insights" backLabel="Lihat semua insights" /> : null}
      {!loading && !error && insight ? (
        <>
          <article className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <div className="aspect-[16/8] overflow-hidden bg-stone-100">
              <img
                src={insight.image_url ?? "https://picsum.photos/seed/blog-fallback/1200/600"}
                alt={insight.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  {insight.tag}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-stone-400">
                  <CalendarDays className="h-4 w-4" />
                  {formatPublicDate(insight.published_at)}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-headline text-stone-950">{insight.title}</h1>
              <p className="mt-4 text-sm font-medium text-stone-500">
                Oleh {insight.author_name ?? "MikroLiving Studio"}
              </p>
              <div className="mt-8 space-y-6 text-base leading-8 text-stone-700">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          {relatedInsights.length > 0 ? (
            <section className="mx-auto mt-10 max-w-7xl">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">More Insights</p>
                <h2 className="mt-3 text-3xl font-headline text-stone-950">Artikel lain yang bisa kamu baca berikutnya.</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedInsights.map((item) => (
                  <InsightCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </PublicPageShell>
  );
}

export function LegalDocumentPage({
  homepage,
  title,
  intro,
  sections,
}: SharedPageProps & {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  useEffect(() => {
    document.title = `${title} | MikroLiving`;
  }, [title]);

  return (
    <PublicPageShell homepage={homepage}>
      <PageHero
        eyebrow="Legal"
        title={title}
        intro={intro}
        meta={["Terakhir diperbarui: 13 April 2026", "MikroLiving.store"]}
      />

      <section className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-3 text-stone-500">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm">Dokumen ini berlaku untuk penggunaan situs publik MikroLiving.store.</p>
        </div>
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-headline text-stone-950">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-8 text-stone-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

export function PrivacyPolicyPage({ homepage }: SharedPageProps) {
  return (
    <LegalDocumentPage
      homepage={homepage}
      title="Privacy Policy"
      intro="Halaman ini menjelaskan bagaimana MikroLiving mengumpulkan, menggunakan, menyimpan, dan melindungi informasi yang masuk melalui website resmi kami."
      sections={privacySections}
    />
  );
}

export function TermsOfServicePage({ homepage }: SharedPageProps) {
  return (
    <LegalDocumentPage
      homepage={homepage}
      title="Terms of Service"
      intro="Halaman ini mengatur cara penggunaan website MikroLiving, perlindungan konten, serta batasan hubungan layanan sebelum ada kesepakatan bisnis formal."
      sections={termsSections}
    />
  );
}

export function NotFoundPage({ homepage }: SharedPageProps) {
  useEffect(() => {
    document.title = "Page Not Found | MikroLiving";
  }, []);

  return (
    <PublicPageShell homepage={homepage}>
      <PageHero
        eyebrow="Not Found"
        title="Halaman yang kamu tuju belum tersedia."
        intro="Link ini mungkin sudah berubah, belum dipublikasikan, atau ada salah ketik pada alamat halaman."
      />

      <section className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm leading-7 text-stone-600">
          Kamu bisa kembali ke homepage, melihat portfolio terbaru, atau membaca insight yang sudah dipublikasikan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/" className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">
            Homepage
          </a>
          <a href="/projects" className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700">
            Projects
          </a>
          <a href="/insights" className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700">
            Insights
          </a>
        </div>
      </section>
    </PublicPageShell>
  );
}
