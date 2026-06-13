'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Lock, Ticket } from 'lucide-react';
import styles from './TicketsSection.module.css';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  capacity: number | null;
  sold: number;
  isOpen: boolean;
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

export default function TicketsSection() {
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.tiers) {
          setTiers(data.tiers.filter((t: TicketTier) => t.isOpen));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.section} id="tickets">
      <div className={`container ${styles.container}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <motion.span 
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Access Passes
          </motion.span>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Secure Your <span className={styles.goldItalic}>Seat</span>
          </motion.h2>
        </div>

        {/* Content */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
          </div>
        ) : tiers.length === 0 ? (
          /* State 1: Registration Not Open */
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.emptyCard}>
              <div className={styles.lockIconBox}>
                <Lock size={40} className={styles.lockIcon} strokeWidth={1} />
              </div>
              <h3 className={styles.emptyTitle}>Registration Opening Soon</h3>
              <p className={styles.emptyDesc}>
                We're putting the final touches on our ticket tiers. Check back soon or keep an eye on our socials for the official launch.
              </p>
              <div className={styles.emptyDecorLine} />
            </div>
          </motion.div>
        ) : (
          /* State 2: Tickets Available */
          <div className={styles.ticketsGrid}>
            {tiers.map((tier, i) => {
              const isSoldOut = tier.capacity !== null && tier.sold >= tier.capacity;
              const isFeatured = i === 1 && tiers.length > 1; // Highlight the middle tier if multiple
              
              return (
                <motion.div 
                  key={tier.id} 
                  className={`${styles.ticketCard} ${isFeatured ? styles.featured : ''} ${isSoldOut ? styles.soldOut : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {isFeatured && <div className={styles.popularBadge}>Most Popular</div>}
                  
                  <div className={styles.cardHeader}>
                    <div className={styles.tierNameBox}>
                      <Ticket size={20} className={isFeatured ? styles.iconFeatured : styles.iconStandard} />
                      <h3 className={styles.tierName}>{tier.name}</h3>
                    </div>
                    <div className={styles.tierPrice}>{formatNaira(tier.price)}</div>
                    <p className={styles.tierDesc}>{tier.description}</p>
                  </div>
                  
                  <ul className={styles.perksList}>
                    {tier.perks.map((perk, j) => (
                      <li key={j} className={styles.perkItem}>
                        <Check size={18} className={isFeatured ? styles.checkFeatured : styles.checkStandard} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className={styles.cardFooter}>
                    <Link 
                      href={isSoldOut ? '#' : `/register?tier=${tier.id}`} 
                      className={`${styles.registerBtn} ${isFeatured ? styles.btnPrimary : styles.btnOutline}`}
                      tabIndex={isSoldOut ? -1 : 0}
                    >
                      {isSoldOut ? 'Sold Out' : 'Get Ticket'}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
