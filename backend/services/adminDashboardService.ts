import { getAdminContent } from "./cmsService";
import { getAdminInquiries } from "./inquiryService";
import { findAllProjects } from "./projectRepository";
import { getAdminUsers } from "./userService";

export async function getAdminDashboardData() {
  const [projects, content, inquiries, users] = await Promise.all([
    findAllProjects(),
    getAdminContent(),
    getAdminInquiries(),
    getAdminUsers(),
  ]);

  return {
    summary: {
      projects_total: projects.length,
      featured_projects: projects.filter((item) => Boolean(item.is_featured)).length,
      services_total: content.services.length,
      active_services: content.services.filter((item) => Boolean(item.is_active)).length,
      insights_total: content.insights.length,
      published_insights: content.insights.filter((item) => Boolean(item.is_published)).length,
      testimonials_total: content.testimonials.length,
      active_testimonials: content.testimonials.filter((item) => Boolean(item.is_active)).length,
      navigation_links_total: content.navigation_links.length,
      contact_channels_total: content.contact_channels.length,
      inquiries_total: inquiries.length,
      new_inquiries: inquiries.filter((item) => item.status === "new").length,
      replied_inquiries: inquiries.filter((item) => item.status === "replied").length,
      archived_inquiries: inquiries.filter((item) => item.status === "archived").length,
      latest_inquiry_at: inquiries[0]?.created_at ?? null,
      users_total: users.length,
      active_users: users.filter((item) => Boolean(item.is_active)).length,
      admin_users: users.filter((item) => item.role === "admin").length,
      editor_users: users.filter((item) => item.role === "editor").length,
    },
    projects,
    services: content.services,
    insights: content.insights,
    testimonials: content.testimonials,
    settings: content.settings,
    navigation_links: content.navigation_links,
    contact_channels: content.contact_channels,
    inquiries,
    users,
  };
}
