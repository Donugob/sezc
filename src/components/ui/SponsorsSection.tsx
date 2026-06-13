'use client';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './SponsorsSection.module.css';

export default function SponsorsSection() {
  return (
    <section className={styles.section} id="sponsors">
      {/* Background Animated Glowing Orbs */}
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />

      <div className={`container ${styles.container}`}>
        <motion.div 
          className={styles.glassCard}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.cardInner}>
            <span className={styles.badge}>Exclusive Partnership</span>
            
            <h2 className={styles.title}>
              Align with Legal <br />
              <span className={styles.goldItalic}>Excellence</span>
            </h2>
            
            <p className={styles.description}>
              The South East Zonal Convention is the most prestigious gathering of future legal leaders. We invite visionary brands and law firms to partner with us in redefining legal practice. Gain unparalleled visibility, elite networking access, and the opportunity to position your brand at the forefront of the Nigerian legal sector.
            </p>

            <a 
              href="https://wa.me/2349053196834?text=Hello%2C%20I%20am%20interested%20in%20sponsoring%20the%20SEZC%202026." 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.whatsappBtn}
            >
              <MessageCircle size={20} className={styles.btnIcon} strokeWidth={2.5} />
              Inquire via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
