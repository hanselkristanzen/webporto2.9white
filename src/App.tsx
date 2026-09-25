import { useEffect, useState } from "react";
import { SmoothScrollProvider, useSmoothScroll } from "./lib/SmoothScrollContext";
import { useActiveSection } from "./hooks/useActiveSection";
import { Loader } from "./components/layout/Loader";
import { Navigation } from "./components/layout/Navigation";
import { TargetCursor } from "./components/effects/TargetCursor";
import { ImageLightboxProvider } from "./components/ui/ImageLightbox";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./sections/hero/Hero";
import { About } from "./sections/about/About";
import { Projects } from "./sections/projects/Projects";
import { Research } from "./sections/research/Research";
import { Experience } from "./sections/experience/Experience";
import { Education } from "./sections/education/Education";
import { Organizations } from "./sections/organizations/Organizations";
import { Volunteer } from "./sections/volunteer/Volunteer";
import { Skills } from "./sections/skills/Skills";
import { Contact } from "./sections/contact/Contact";

const DARK_SECTION_IDS = new Set(["home", "research", "contact", "site-footer"]);
const ALL_SECTION_IDS = [
  "home",
  "about",
  "work",
  "research",
  "experience",
  "education",
  "organizations",
  "volunteer",
  "skills",
  "contact",
  "site-footer",
];

function AppShell() {
  const [ready, setReady] = useState(false);
  const { stop, start } = useSmoothScroll();
  const activeSection = useActiveSection(ALL_SECTION_IDS);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "is-dark-section",
      DARK_SECTION_IDS.has(activeSection)
    );
  }, [activeSection]);

  useEffect(() => {
    if (!ready) {
      document.body.style.overflow = "hidden";
      stop();
    } else {
      document.body.style.overflow = "";
      start();
    }
  }, [ready, stop, start]);

  return (
    <>
      {!ready && <Loader onComplete={() => setReady(true)} />}
      <TargetCursor cursorColor="#f6f3ec" cursorColorOnTarget="#EAB308" spinDuration={2} />
      <div inert={!ready}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content">
          <Hero ready={ready} />
          <About />
          <Projects />
          <Research />
          <Experience />
          <Education />
          <Organizations />
          <Volunteer />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <ImageLightboxProvider>
        <AppShell />
      </ImageLightboxProvider>
    </SmoothScrollProvider>
  );
}
