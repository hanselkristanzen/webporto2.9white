import { contactChannels } from "../../data/contact";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className={styles.footer} data-dark>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.identity}>
            <p className={styles.wordmark}>HANSEL KRISTANZEN</p>
            <p className={styles.role}>Computer Science Student &amp; Designer</p>
            <p className={styles.location}>Jakarta, Indonesia</p>
          </div>
          <nav className={styles.links} aria-label="Contact links">
            {contactChannels.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                className={`${styles.link} cursor-target`}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer noopener" : undefined}
              >
                {channel.label} — {channel.value}
              </a>
            ))}
          </nav>
        </div>
        <div className={styles.bottom}>
          <p className={styles.settle}>neversettle.</p>
          <p className={styles.meta}>© {year} Hansel Kristanzen</p>
        </div>
      </div>
    </footer>
  );
}
