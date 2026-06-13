'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.section} id="about">
      <div className={`container ${styles.container}`}>
        
        {/* Left: Editorial Photo Collage */}
        <div className={styles.collageWrapper}>
          <motion.div 
            className={`${styles.photoFrame} ${styles.photo1}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Image src="/about-symposium.jpg" alt="Symposium Event" fill style={{ objectFit: 'cover' }} />
          </motion.div>

          <motion.div 
            className={`${styles.photoFrame} ${styles.photo2}`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Image src="/about-sports.jpg" alt="Delegates at Sports" fill style={{ objectFit: 'cover' }} />
          </motion.div>

          <motion.div 
            className={`${styles.photoFrame} ${styles.photo3}`}
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Image src="/about-dinner.jpg" alt="Gala Dinner" fill style={{ objectFit: 'cover' }} />
          </motion.div>
          
          <div className={styles.decorCircle} />
          <div className={styles.decorDots} />
        </div>

        {/* Right: Story Typography */}
        <div className={styles.textContent}>
          <motion.span 
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            The Convention
          </motion.span>
          
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            The Premier Gathering of <br />
            <span className={styles.goldItalic}>Legal Minds</span>
          </motion.h2>

          <motion.div 
            className={styles.divider}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "circOut" }}
          />

          <motion.div 
            className={styles.storyParagraphs}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p>
              SEZC is LAWSAN's biggest annual event in the South East. We bring together ambitious students, academics, and industry leaders to shape the future of Nigerian law.
            </p>
            <p>
              It's three days of high-level conversations, career-defining networking, and celebrating our culture. No boring lectures—just real value, real connections, and real impact.
            </p>
          </motion.div>

          <motion.div 
            className={styles.statsGrid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className={styles.statBox}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Days of Impact</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Institutions</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>1k+</span>
              <span className={styles.statLabel}>Delegates</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
