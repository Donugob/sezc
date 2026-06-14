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
              Welcome to the 2026 South East Zonal Convention.
            </p>
            <p>
              We're heading to Owerri with one goal: to challenge the status quo and build a future where legal excellence actually means something. This is a movement to redefine how law is practiced in our generation.
            </p>
            <p>
              Expect three unforgettable days of sharp debates, cultural celebrations, and the kind of networking that builds lifelong careers. Come ready to learn, connect, and leave your mark. See you in Owerri.
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
