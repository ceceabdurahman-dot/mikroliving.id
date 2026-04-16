import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SignatureProjects from "./components/SignatureProjects";
import Services from "./components/Services";
import DesignProcess from "./components/DesignProcess";
import Testimonial from "./components/Testimonial";
import Insights from "./components/Insights";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import {
  InsightDetailPage,
  InsightsPage,
  NotFoundPage,
  PrivacyPolicyPage,
  ProjectDetailPage,
  ProjectsPage,
  TermsOfServicePage,
} from "./components/PublicPages";
import { getPublicRoute } from "./components/publicSiteUtils";
import { api, HomepageContent } from "./services/api";

export default function App() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const publicRoute = getPublicRoute(currentPath);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);

  useEffect(() => {
    if (currentPath.startsWith("/admin")) {
      return;
    }

    let isMounted = true;
    api
      .getHomepage()
      .then((data) => {
        if (isMounted) {
          setHomepage(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load homepage content:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPath]);

  if (currentPath.startsWith("/admin")) {
    return <AdminPanel />;
  }

  if (publicRoute.kind === "projects") {
    return <ProjectsPage homepage={homepage} />;
  }

  if (publicRoute.kind === "project-detail") {
    return <ProjectDetailPage homepage={homepage} projectId={publicRoute.id} />;
  }

  if (publicRoute.kind === "insights") {
    return <InsightsPage homepage={homepage} />;
  }

  if (publicRoute.kind === "insight-detail") {
    return <InsightDetailPage homepage={homepage} slug={publicRoute.slug} />;
  }

  if (publicRoute.kind === "privacy-policy") {
    return <PrivacyPolicyPage homepage={homepage} />;
  }

  if (publicRoute.kind === "terms-of-service") {
    return <TermsOfServicePage homepage={homepage} />;
  }

  if (publicRoute.kind === "not-found") {
    return <NotFoundPage homepage={homepage} />;
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar brandName={homepage?.settings.brand_name} navigationLinks={homepage?.navigation_links} />
      <main>
        <Hero settings={homepage?.settings} />
        <SignatureProjects />
        <Services items={homepage?.services} />
        <DesignProcess />
        <Testimonial item={homepage?.testimonial} />
        <Insights items={homepage?.insights} />
        <CTA intro={homepage?.settings.contact_intro} />
      </main>
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
