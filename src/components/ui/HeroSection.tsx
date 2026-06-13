'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Shield, Star } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} id="home">
      {/* Massive Background Text for Editorial Prestige */}
      <div className={styles.bgText} aria-hidden="true">SEZC</div>
      
      {/* Subtle Glows */}
      <div className={styles.glowPrimary} />
      <div className={styles.glowSecondary} />

      <div className={`container ${styles.content}`}>
        {/* Left Column: Bold Typography */}
        <div className={styles.textCol}>
          <motion.div 
            className={styles.badgeWrapper}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className={styles.badgeLine} />
            <span className={styles.badgeText}>LAWSAN South East Presents</span>
          </motion.div>

          <h1 className={styles.heading}>
            The 2026 Zonal <br />
            <span className={styles.headingHighlight}>Convention</span>
          </h1>

          <motion.div 
            className={styles.themeBox}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className={styles.themeLabel}>Official Theme</p>
            <h2 className={styles.themeText}>&quot;Redefining Legal Practice&quot;</h2>
          </motion.div>

          <div className={styles.ctas}>
            <Link href="/register" className={styles.primaryBtn}>
              Secure Your Pass
            </Link>
            <a href="#welcome" className={styles.secondaryBtn}>
              Discover More
            </a>
          </div>
        </div>

        {/* Right Column: Abstract / Floating UI Elements */}
        <div className={styles.visualCol}>
          <motion.div 
            className={`${styles.glassCard} ${styles.card1}`}
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
          >
            <div className={styles.cardIconBox}>
              <MapPin size={24} color="var(--brand-gold)" />
            </div>
            <div>
              <p className={styles.cardTitle}>Location</p>
              <p className={styles.cardValue}>Owerri, Imo State</p>
            </div>
          </motion.div>

          <motion.div 
            className={`${styles.glassCard} ${styles.card2}`}
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, type: "spring" }}
          >
            <div className={styles.cardIconBox}>
              <Star size={24} color="var(--brand-gold)" />
            </div>
            <div>
              <p className={styles.cardTitle}>Experience</p>
              <p className={styles.cardValue}>3 Days of Excellence</p>
            </div>
          </motion.div>
          
          <motion.div 
            className={`${styles.glassCard} ${styles.card3}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
          >
            <div className={styles.cardIconBox}>
              <Shield size={24} color="var(--brand-gold)" />
            </div>
            <div>
              <p className={styles.cardTitle}>Network</p>
              <p className={styles.cardValue}>1,000+ Delegates</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
