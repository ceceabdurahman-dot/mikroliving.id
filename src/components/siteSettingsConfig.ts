export type HeroStat = {
  label: string;
  value: string;
};

export type SiteSettingsFieldConfig = {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  type: "text" | "url" | "textarea" | "json";
};

export const siteSettingsFields: SiteSettingsFieldConfig[] = [
  {
    key: "brand_name",
    label: "Brand Name",
    description: "Nama brand yang muncul di navbar dan footer.",
    placeholder: "MikroLiving",
    type: "text",
  },
  {
    key: "hero_headline",
    label: "Hero Headline",
    description: "Judul utama di bagian hero halaman depan.",
    placeholder: "Designing Smart Living Spaces",
    type: "text",
  },
  {
    key: "hero_subheadline",
    label: "Hero Subheadline",
    description: "Kalimat pendukung tepat di bawah headline hero.",
    placeholder: "Creating elegant and functional interiors...",
    type: "textarea",
  },
  {
    key: "hero_primary_cta_label",
    label: "Primary CTA Label",
    description: "Teks tombol utama pada hero.",
    placeholder: "View Portfolio",
    type: "text",
  },
  {
    key: "hero_secondary_cta_label",
    label: "Secondary CTA Label",
    description: "Teks tombol kedua pada hero.",
    placeholder: "Book Consultation",
    type: "text",
  },
  {
    key: "hero_image_url",
    label: "Hero Image URL",
    description: "URL gambar hero. Harus berupa alamat http/https yang valid.",
    placeholder: "https://example.com/hero.jpg",
    type: "url",
  },
  {
    key: "hero_stats",
    label: "Hero Stats JSON",
    description: 'Format: [{"label":"Projects","value":"150+"}]',
    placeholder: '[{"label":"Projects","value":"150+"}]',
    type: "json",
  },
  {
    key: "footer_tagline",
    label: "Footer Tagline",
    description: "Kalimat singkat di footer.",
    placeholder: "Crafting intelligent, elegant spaces...",
    type: "textarea",
  },
  {
    key: "footer_copyright",
    label: "Footer Copyright",
    description: "Teks copyright di bagian bawah footer.",
    placeholder: "(C) 2024 MikroLiving Interior Studio. All rights reserved.",
    type: "text",
  },
  {
    key: "contact_intro",
    label: "Contact Intro",
    description: "Pengantar singkat di section contact.",
    placeholder: "Whether you're starting from scratch...",
    type: "textarea",
  },
];

export const defaultEditableSiteSettings: Record<string, string> = {
  brand_name: "MikroLiving",
  hero_headline: "Designing Smart Living Spaces",
  hero_subheadline:
    "Creating Elegant & Functional Interiors that resonate with your lifestyle and personality.",
  hero_primary_cta_label: "View Portfolio",
  hero_secondary_cta_label: "Book Consultation",
  hero_image_url: "https://picsum.photos/seed/interior1/1200/1200",
  hero_stats:
    '[{"label":"Projects","value":"150+"},{"label":"Satisfaction","value":"98%"},{"label":"Years Exp.","value":"10+"}]',
  footer_tagline:
    "Crafting intelligent, elegant spaces that elevate the standard of compact and residential living.",
  footer_copyright: "(C) 2024 MikroLiving Interior Studio. All rights reserved.",
  contact_intro:
    "Whether you're starting from scratch or renovating a room, our team is ready to bring your vision to life.",
};
