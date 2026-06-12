'use client';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import styles from './SpeakersSection.module.css';

export default function SpeakersSection() {
  return (
    <section className={styles.section} id="speakers">
      <div className={`container ${styles.container}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <motion.span 
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Lineup
          </motion.span>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Curating the Finest <br />
            <span className={styles.goldItalic}>Legal Minds</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            The official roster of our Keynote Speaker, Distinguished Panelists, and Special Guests is currently under embargo. Keep an eye on our channels for the grand reveal.
          </motion.p>
        </div>

        {/* The Silhouette Cluster */}
        <div className={styles.clusterWrapper}>
          <motion.div 
            className={styles.glowEffect}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          <div className={styles.avatarsContainer}>
            {/* Avatar 1 (Far Left) */}
            <motion.div 
              className={`${styles.avatarCircle} ${styles.av1}`}
              initial={{ opacity: 0, scale: 0.5, x: -40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
            >
              <User className={styles.avatarIcon} />
            </motion.div>

            {/* Avatar 2 (Mid Left) */}
            <motion.div 
              className={`${styles.avatarCircle} ${styles.av2}`}
              initial={{ opacity: 0, scale: 0.5, x: -20, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            >
              <User className={styles.avatarIcon} />
            </motion.div>

            {/* Avatar 3 (Center Keynote) */}
            <motion.div 
              className={`${styles.avatarCircle} ${styles.av3}`}
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            >
              <User className={styles.avatarIconCenter} />
            </motion.div>

            {/* Avatar 4 (Mid Right) */}
            <motion.div 
              className={`${styles.avatarCircle} ${styles.av4}`}
              initial={{ opacity: 0, scale: 0.5, x: 20, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            >
              <User className={styles.avatarIcon} />
            </motion.div>

            {/* Avatar 5 (Far Right) */}
            <motion.div 
              className={`${styles.avatarCircle} ${styles.av5}`}
              initial={{ opacity: 0, scale: 0.5, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            >
              <User className={styles.avatarIcon} />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
