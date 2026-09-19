import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <TechStack />
        <ProjectsSection />
        <CertificatesSection />
      </main>
      <SiteFooter>
        <ContactSection />
      </SiteFooter>
    </>
  );
}
