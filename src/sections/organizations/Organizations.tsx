import { organizations } from "../../data/organizations";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import styles from "./Organizations.module.css";

export function Organizations() {
  return (
    <section
      id="organizations"
      className={styles.organizations}
      aria-labelledby="organizations-heading"
    >
      <div className="container">
        <div className={styles.headerRow}>
          <SectionHeading
            index="06"
            eyebrow="Organizations"
            headline={<span id="organizations-heading">Building alongside others.</span>}
          />
        </div>

        <div className={styles.grid}>
          {organizations.map((org, i) => (
            <Reveal key={org.id} delay={i * 80} className={styles.org}>
              <div>
                <h3 className={styles.orgName}>{org.name}</h3>
                {org.fullName ? <p className={styles.orgFullName}>{org.fullName}</p> : null}
              </div>
              <div className={styles.roleList}>
                {org.roles.map((role) => (
                  <div key={role.id} className={styles.role}>
                    <span className={styles.roleTitle}>{role.title}</span>
                    <span className={styles.roleDate}>
                      {role.start === role.end ? role.start : `${role.start} — ${role.end}`}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
