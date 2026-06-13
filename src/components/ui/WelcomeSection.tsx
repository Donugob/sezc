'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './WelcomeSection.module.css';

export default function WelcomeSection() {
  return (
    <section className={styles.section} id="welcome">
      <div className={`container ${styles.container}`}>
        
        {/* Left: Image / Visual */}
        <motion.div 
          className={styles.visualCol}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.imageWrapper}>
            <div className={styles.imageBox}>
              <Image src="/director.jpg" alt="Nduh Hephzibah Chibuzor" fill style={{ objectFit: 'cover' }} />
            </div>
            
            <div className={styles.namePlate}>
              <h3 className={styles.plateName}>Nduh Hephzibah Chibuzor</h3>
              <p className={styles.plateRole}>Zonal Director</p>
            </div>
          </div>
          
          {/* Subtle decorative element */}
          <div className={styles.decoratorBox} />
        </motion.div>

        {/* Right: Letter / Message */}
        <div className={styles.textCol}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            A Welcome from the <span className={styles.goldText}>Director</span>
          </motion.h2>
          
          <motion.div 
            className={styles.divider}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          <motion.div 
            className={styles.messageContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>
              It is my distinct honor to welcome every law student, distinguished alumnus, and esteemed guest to the 2026 South East Zonal Convention.
            </p>
            <p>
              As we gather in the beautiful city of Owerri, our focus remains clear and resolute: to challenge the status quo and foster an environment where true legal excellence thrives. This year&apos;s convention is more than an event; it is a movement aimed at <strong>&quot;Redefining Legal Practice&quot;</strong> in our era.
            </p>
            <p>
              We have curated a 3-day experience encompassing robust intellectual symposiums, vibrant cultural showcases, and networking opportunities that will forge lifelong professional bonds. I invite you to immerse yourself fully in what promises to be the most impactful gathering of legal minds in the South East.
            </p>
          </motion.div>

          <motion.div 
            className={styles.signatureBox}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className={styles.signName}>Nduh Hephzibah Chibuzor</span>
            <span className={styles.signTitle}>Director of Projects, Programmes & Policies</span>
            <span className={styles.signOrg}>LAWSAN South East</span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
