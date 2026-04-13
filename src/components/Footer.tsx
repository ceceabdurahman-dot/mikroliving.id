import { AtSign, Globe, LucideIcon, MessageCircle } from "lucide-react";
import { ContactChannel, NavigationLink } from "../services/api";
import BrandMark from "./BrandMark";
import { resolveNavigationHref } from "./publicSiteUtils";

type FooterProps = {
  brandName?: string;
  tagline?: string;
  copyright?: string;
  navigationLinks?: NavigationLink[];
  contactChannels?: ContactChannel[];
};

const iconMap: Record<string, LucideIcon> = {
  AtSign,
  MessageCircle,
  Globe,
};

const fallbackNavigationLinks: NavigationLink[] = [
  { id: 1, label: "Studio", url: "#studio", location: "footer", sort_order: 1 },
  { id: 2, label: "Portfolio", url: "/projects", location: "footer", sort_order: 2 },
  { id: 3, label: "Services", url: "#services", location: "footer", sort_order: 3 },
  { id: 4, label: "Privacy Policy", url: "/privacy-policy", location: "legal", sort_order: 1 },
  { id: 5, label: "Terms of Service", url: "/terms-of-service", location: "legal", sort_order: 2 },
];

const fallbackContactChannels: ContactChannel[] = [
  { id: 1, label: "WhatsApp", value_text: "+62 812 3456 7890", href: "#", icon_key: "MessageCircle", sort_order: 1 },
  { id: 2, label: "Email Us", value_text: "hello@mikroliving.local", href: "#", icon_key: "AtSign", sort_order: 2 },
  { id: 3, label: "Location", value_text: "Jakarta, Indonesia", href: "https://mikroliving.id", icon_key: "Globe", sort_order: 3 },
];

export default function Footer({
  brandName = "MikroLiving",
  tagline = "Crafting intelligent, elegant spaces that elevate the standard of compact and residential living.",
  copyright = "(C) 2024 MikroLiving Interior Studio. All rights reserved.",
  navigationLinks,
  contactChannels,
}: FooterProps) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const footerLinks = (navigationLinks ?? fallbackNavigationLinks).filter((item) => item.location === "footer");
  const legalLinks = (navigationLinks ?? fallbackNavigationLinks).filter((item) => item.location === "legal");
  const contacts = contactChannels && contactChannels.length > 0 ? contactChannels : fallbackContactChannels;

  return (
    <footer className="bg-stone-50 w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6">
          <BrandMark brandName={brandName} size="md" stacked />
          <p className="max-w-xs text-stone-500 text-sm leading-relaxed">{tagline}</p>
          <div className="flex gap-4">
            {contacts.map((channel) => {
              const Icon = iconMap[channel.icon_key ?? ""] ?? Globe;
              return (
                <a key={channel.id} href={resolveNavigationHref(channel.href ?? "#", channel.label, currentPath)} className="text-stone-400 hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-stone-900 font-bold mb-2">Navigation</span>
            {footerLinks.map((link) => (
              <a key={link.id} href={resolveNavigationHref(link.url, link.label, currentPath)} className="text-stone-500 hover:text-primary transition-colors text-sm">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-stone-900 font-bold mb-2">Contact</span>
            {contacts.map((channel) => (
              <a key={channel.id} href={resolveNavigationHref(channel.href ?? "#", channel.label, currentPath)} className="text-stone-500 hover:text-primary transition-colors text-sm">
                {channel.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-stone-900 font-bold mb-2">Legal</span>
            {legalLinks.map((link) => (
              <a key={link.id} href={resolveNavigationHref(link.url, link.label, currentPath)} className="text-stone-500 hover:text-primary transition-colors text-sm">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs uppercase tracking-widest text-stone-500">{copyright}</p>
        <div className="flex gap-6 text-stone-400 text-xs uppercase tracking-widest font-bold">
          <span>Eco Friendly</span>
          <span>Verified</span>
        </div>
      </div>
    </footer>
  );
}
