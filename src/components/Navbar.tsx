import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { NavigationLink } from "../services/api";
import BrandMark from "./BrandMark";
import { resolveBrandHref, resolveContactHref, resolveNavigationHref } from "./publicSiteUtils";

type NavbarProps = {
  brandName?: string;
  navigationLinks?: NavigationLink[];
};

const fallbackNavItems = [
  { label: "Home", url: "#home", location: "header", sort_order: 1 },
  { label: "Studio", url: "#studio", location: "header", sort_order: 2 },
  { label: "Services", url: "#services", location: "header", sort_order: 3 },
  { label: "Portfolio", url: "#portfolio", location: "header", sort_order: 4 },
  { label: "Insights", url: "#insights", location: "header", sort_order: 5 },
  { label: "Contact", url: "#contact", location: "header", sort_order: 6 },
] as const;

export default function Navbar({ brandName = "MikroLiving", navigationLinks }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  const navItems = useMemo(() => {
    const items = (navigationLinks ?? fallbackNavItems).filter((item) => item.location === "header");
    return items.length > 0 ? items : fallbackNavItems;
  }, [navigationLinks]);
  const contactHref = resolveContactHref(currentPath);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href={resolveBrandHref(currentPath)} className="shrink-0">
            <BrandMark brandName={brandName} size="sm" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              (() => {
                const href = resolveNavigationHref(item.url, item.label, currentPath);
                const isActive =
                  (href === "/projects" && currentPath.startsWith("/projects"))
                  || (href === "/insights" && currentPath.startsWith("/insights"))
                  || (href === "/privacy-policy" && currentPath === "/privacy-policy")
                  || (href === "/terms-of-service" && currentPath === "/terms-of-service")
                  || (idx === 0 && currentPath === "/");

                return (
                  <a
                    key={`${item.label}-${item.url}`}
                    href={href}
                    className={
                      isActive
                        ? "text-primary border-b-2 border-primary pb-1 text-sm font-medium tracking-wide transition-all duration-300"
                        : "text-stone-600 hover:text-stone-900 text-sm font-medium tracking-wide transition-all duration-300"
                    }
                  >
                    {item.label}
                  </a>
                );
              })()
            ))}
          </div>
          <a
            href={contactHref}
            className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 active:scale-95"
          >
            Book Consultation
          </a>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-stone-200 p-2 text-stone-700 transition-colors hover:bg-stone-50"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="md:hidden border-t border-stone-100 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={`${item.label}-${item.url}`}
                  href={resolveNavigationHref(item.url, item.label, currentPath)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={contactHref}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Book Consultation
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </motion.nav>
  );
}
