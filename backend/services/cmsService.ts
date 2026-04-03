import {
  ContactChannelPayload,
  ContactChannelRecord,
  HomepageContent,
  InsightPayload,
  InsightRecord,
  NavigationLinkPayload,
  NavigationLinkRecord,
  ServicePayload,
  ServiceRecord,
  SiteSettingPayload,
  SiteSettingRecord,
  TestimonialPayload,
  TestimonialRecord,
} from "../types/cms";
import {
  deleteContactChannelById,
  deleteInsightById,
  deleteNavigationLinkById,
  deleteServiceById,
  deleteTestimonialById,
  findAllContactChannels,
  findAllInsights,
  findAllNavigationLinks,
  findAllServices,
  findAllTestimonials,
  findFeaturedTestimonial,
  findPublicContactChannels,
  findPublicInsights,
  findPublicNavigationLinks,
  findPublicServices,
  findPublicSiteSettings,
  findSiteSettingsByGroups,
  insertContactChannel,
  insertInsight,
  insertNavigationLink,
  insertService,
  insertTestimonial,
  updateContactChannelById,
  updateInsightById,
  updateNavigationLinkById,
  updateServiceById,
  updateTestimonialById,
  upsertSiteSettings,
} from "./cmsRepository";
import { toSlug } from "../utils/strings";

const defaultServices: ServiceRecord[] = [
  { id: 1, icon_key: "Layout", title: "Interior Design", description: "Comprehensive conceptual and technical planning for any space.", sort_order: 1, is_active: 1 },
  { id: 2, icon_key: "Building2", title: "Apartment Design", description: "Specialized solutions for compact living and high-rise dwellings.", sort_order: 2, is_active: 1 },
  { id: 3, icon_key: "Sofa", title: "Custom Furniture", description: "Bespoke pieces crafted specifically for your home's dimensions.", sort_order: 3, is_active: 1 },
  { id: 4, icon_key: "Hammer", title: "Design & Build", description: "Integrated project management from concept to completion.", sort_order: 4, is_active: 1 },
];

const defaultInsights: InsightRecord[] = [
  { id: 1, tag: "Trends", slug: "maximizing-space-in-compact-apartments", title: "Maximizing Space in Compact Apartments", excerpt: "Discover clever furniture hacks and architectural tricks to make small spaces feel twice their size.", image_url: "https://picsum.photos/seed/blog1/600/400", author_name: "MikroLiving Studio", is_published: 1, sort_order: 1 },
  { id: 2, tag: "Aesthetics", slug: "choosing-the-perfect-earth-tone-palette", title: "Choosing the Perfect Earth-Tone Palette", excerpt: "Why organic colors are dominating modern interiors and how to pair them with raw materials.", image_url: "https://picsum.photos/seed/blog2/600/400", author_name: "MikroLiving Studio", is_published: 1, sort_order: 2 },
  { id: 3, tag: "Material", slug: "the-rise-of-sustainable-wood-in-decor", title: "The Rise of Sustainable Wood in Decor", excerpt: "Exploring ethically sourced timber options that add warmth without harming the planet.", image_url: "https://picsum.photos/seed/blog3/600/400", author_name: "MikroLiving Studio", is_published: 1, sort_order: 3 },
];

const defaultTestimonial: TestimonialRecord = { id: 1, client_name: "Sarah & Dimas", client_label: "The Botanica Apartments", quote: "MikroLiving transformed our 45sqm apartment into a sanctuary. Their attention to storage solutions and aesthetic flow is truly unmatched in the industry.", image_url: "https://picsum.photos/seed/client/200/200", rating: 5, is_featured: 1, sort_order: 1, is_active: 1 };

const defaultSettings: Record<string, string> = {
  brand_name: "MikroLiving",
  hero_headline: "Designing Smart Living Spaces",
  hero_subheadline: "Creating Elegant & Functional Interiors that resonate with your lifestyle and personality.",
  hero_primary_cta_label: "View Portfolio",
  hero_secondary_cta_label: "Book Consultation",
  hero_image_url: "https://picsum.photos/seed/interior1/1200/1200",
  hero_stats: '[{"label":"Projects","value":"150+"},{"label":"Satisfaction","value":"98%"},{"label":"Years Exp.","value":"10+"}]',
  footer_tagline: "Crafting intelligent, elegant spaces that elevate the standard of compact and residential living.",
  footer_copyright: "(C) 2024 MikroLiving Interior Studio. All rights reserved.",
  contact_intro: "Whether you're starting from scratch or renovating a room, our team is ready to bring your vision to life.",
};

const defaultNavigationLinks: NavigationLinkRecord[] = [
  { id: 1, label: "Home", url: "#home", location: "header", sort_order: 1, opens_new_tab: 0, is_active: 1 },
  { id: 2, label: "Studio", url: "#studio", location: "header", sort_order: 2, opens_new_tab: 0, is_active: 1 },
  { id: 3, label: "Services", url: "#services", location: "header", sort_order: 3, opens_new_tab: 0, is_active: 1 },
  { id: 4, label: "Portfolio", url: "#portfolio", location: "header", sort_order: 4, opens_new_tab: 0, is_active: 1 },
  { id: 5, label: "Insights", url: "#insights", location: "header", sort_order: 5, opens_new_tab: 0, is_active: 1 },
  { id: 6, label: "Contact", url: "#contact", location: "header", sort_order: 6, opens_new_tab: 0, is_active: 1 },
  { id: 7, label: "Studio", url: "#studio", location: "footer", sort_order: 1, opens_new_tab: 0, is_active: 1 },
  { id: 8, label: "Portfolio", url: "#portfolio", location: "footer", sort_order: 2, opens_new_tab: 0, is_active: 1 },
  { id: 9, label: "Services", url: "#services", location: "footer", sort_order: 3, opens_new_tab: 0, is_active: 1 },
  { id: 10, label: "Privacy Policy", url: "#", location: "legal", sort_order: 1, opens_new_tab: 0, is_active: 1 },
  { id: 11, label: "Terms of Service", url: "#", location: "legal", sort_order: 2, opens_new_tab: 0, is_active: 1 },
];

const defaultContactChannels: ContactChannelRecord[] = [
  { id: 1, label: "WhatsApp", value_text: "+62 812 3456 7890", href: "https://wa.me/6281234567890", icon_key: "MessageCircle", location_label: null, sort_order: 1, is_active: 1 },
  { id: 2, label: "Email Us", value_text: "hello@mikroliving.local", href: "mailto:hello@mikroliving.local", icon_key: "AtSign", location_label: null, sort_order: 2, is_active: 1 },
  { id: 3, label: "Location", value_text: "Jakarta, Indonesia", href: "#contact", icon_key: "Globe", location_label: "Jakarta, Indonesia", sort_order: 3, is_active: 1 },
];

function toSettingsMap(rows: SiteSettingRecord[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.setting_key] = row.setting_value ?? "";
    return acc;
  }, {});
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const [services, insights, testimonial, settingsRows, navigationLinks, contactChannels] = await Promise.all([
    findPublicServices(),
    findPublicInsights(),
    findFeaturedTestimonial(),
    findPublicSiteSettings(),
    findPublicNavigationLinks(),
    findPublicContactChannels(),
  ]);

  return {
    services: services.length > 0 ? services : defaultServices,
    insights: insights.length > 0 ? insights : defaultInsights,
    testimonial: testimonial ?? defaultTestimonial,
    settings: { ...defaultSettings, ...toSettingsMap(settingsRows) },
    navigation_links: navigationLinks.length > 0 ? navigationLinks : defaultNavigationLinks,
    contact_channels: contactChannels.length > 0 ? contactChannels : defaultContactChannels,
  };
}

export async function getAdminContent() {
  const [services, insights, testimonials, settings, navigation_links, contact_channels] = await Promise.all([
    findAllServices(),
    findAllInsights(),
    findAllTestimonials(),
    findSiteSettingsByGroups(["branding", "hero", "footer", "contact"]),
    findAllNavigationLinks(),
    findAllContactChannels(),
  ]);

  return { services, insights, testimonials, settings, navigation_links, contact_channels };
}

export async function createService(payload: ServicePayload) { return insertService(payload); }
export async function updateService(serviceId: number, payload: ServicePayload) { return updateServiceById(serviceId, payload); }
export async function deleteService(serviceId: number) { return deleteServiceById(serviceId); }
export async function createInsight(payload: InsightPayload) { return insertInsight({ ...payload, slug: toSlug(payload.title) }); }
export async function updateInsight(insightId: number, payload: InsightPayload) { return updateInsightById(insightId, { ...payload, slug: toSlug(payload.title) }); }
export async function deleteInsight(insightId: number) { return deleteInsightById(insightId); }
export async function createTestimonial(payload: TestimonialPayload) { return insertTestimonial(payload); }
export async function updateTestimonial(testimonialId: number, payload: TestimonialPayload) { return updateTestimonialById(testimonialId, payload); }
export async function deleteTestimonial(testimonialId: number) { return deleteTestimonialById(testimonialId); }
export async function saveSiteSettings(settings: SiteSettingPayload[]) { return upsertSiteSettings(settings); }
export async function createNavigationLink(payload: NavigationLinkPayload) { return insertNavigationLink(payload); }
export async function updateNavigationLink(linkId: number, payload: NavigationLinkPayload) { return updateNavigationLinkById(linkId, payload); }
export async function deleteNavigationLink(linkId: number) { return deleteNavigationLinkById(linkId); }
export async function createContactChannel(payload: ContactChannelPayload) { return insertContactChannel(payload); }
export async function updateContactChannel(channelId: number, payload: ContactChannelPayload) { return updateContactChannelById(channelId, payload); }
export async function deleteContactChannel(channelId: number) { return deleteContactChannelById(channelId); }
