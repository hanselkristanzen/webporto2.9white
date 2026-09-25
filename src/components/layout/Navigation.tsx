import { useEffect, useRef, useState } from "react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useSmoothScroll } from "../../lib/SmoothScrollContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "./Navigation.module.css";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const { direction, pastThreshold } = useScrollDirection(80);
  const active = useActiveSection(NAV_ITEMS.map((item) => item.id));
  const { scrollTo } = useSmoothScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Builds the open/close timeline once and simply plays it forward or in
  // reverse — the same tween data drives both directions so "closing"
  // is guaranteed to be the exact mirror of "opening" (TASK 3).
  useEffect(() => {
    if (reducedMotion || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      const overlay = overlayRef.current!;
      const items = overlay.querySelectorAll<HTMLElement>("[data-menu-item]");
      const closeBtn = overlay.querySelector<HTMLElement>("[data-menu-close]");

      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(items, { y: 28, autoAlpha: 0 });
      if (closeBtn) gsap.set(closeBtn, { autoAlpha: 0 });

      overlayTl.current = gsap
        .timeline({ paused: true })
        .to(overlay, { autoAlpha: 1, duration: 0.35, ease: "power3.out" })
        .to(closeBtn, { autoAlpha: 1, duration: 0.3, ease: "power3.out" }, "-=0.15")
        .to(
          items,
          { y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out", stagger: 0.07 },
          "-=0.2"
        );
    }, overlayRef);

    return () => {
      ctx.revert();
      overlayTl.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !overlayTl.current) return;
    if (menuOpen) {
      overlayTl.current.play();
    } else {
      overlayTl.current.reverse();
    }
  }, [menuOpen, reducedMotion]);

  const handleNavigate = (id: string) => {
    setMenuOpen(false);
    scrollTo(`#${id}`, { offset: id === "home" ? 0 : -24 });
  };

  const hidden = pastThreshold && direction === "down" && !menuOpen;

  return (
    <>
      <nav
        className={styles.nav}
        data-visible={pastThreshold || menuOpen}
        data-hidden={hidden}
        aria-label="Primary"
      >
        <a
          href="#home"
          className={`${styles.mark} cursor-target`}
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("home");
          }}
        >
          HK
        </a>
        <ul className={styles.links}>
          {NAV_ITEMS.slice(1).map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.link} cursor-target`}
                data-active={active === item.id}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigate(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.navActions}>
          <ThemeToggle className={styles.desktopThemeToggle} />
          <button
            type="button"
            className={`${styles.menuToggle} cursor-target`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-overlay"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav-overlay"
        ref={overlayRef}
        className={styles.overlay}
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button
          type="button"
          data-menu-close
          className={`${styles.overlayClose} cursor-target`}
          onClick={() => setMenuOpen(false)}
        >
          Close ×
        </button>
        <ul className={styles.overlayLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} data-menu-item>
              <a
                href={`#${item.id}`}
                className={`${styles.overlayLink} cursor-target`}
                data-active={active === item.id}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigate(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.overlayFooter}>
          <p className={styles.overlayMeta}>Computer Science × Design — Jakarta, ID</p>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
