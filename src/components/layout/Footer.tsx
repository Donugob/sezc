'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        
        {/* Top Minimal Layout */}
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <div className={styles.logoGroup}>
              <Image src="/lawsa-logo.webp" alt="LAWSAN" width={44} height={44} className={styles.logo} />
              <Image src="/lawsan-se-logo.png" alt="LAWSAN SE" width={44} height={44} className={styles.logo} />
            </div>
            <p className={styles.brandDesc}>
              The South East Zonal Convention.<br />
              Redefining Legal Practice.
            </p>
          </div>

          <div className={styles.linksCol}>
            <span className={styles.colLabel}>Navigation</span>
            <div className={styles.navGrid}>
              <Link href="#about" className={styles.navLink}>About SEZC</Link>
              <Link href="#schedule" className={styles.navLink}>Itinerary</Link>
              <Link href="#speakers" className={styles.navLink}>Speakers</Link>
              <Link href="#sponsors" className={styles.navLink}>Partnership</Link>
              <Link href="/register" className={styles.navLink}>Register Now</Link>
              <Link href="#faq" className={styles.navLink}>Support FAQ</Link>
            </div>
          </div>

          <div className={styles.contactCol}>
            <span className={styles.colLabel}>Inquiries</span>
            <a href="mailto:official@lawsan-se.com.ng" className={styles.contactLink}>
              official@lawsan-se.com.ng <ArrowUpRight size={14} />
            </a>
            <div className={styles.leaderInfo}>
              <p>Nduh Hephzibah Chibuzor</p>
              <span>Zonal Director</span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className={styles.bottomMeta}>
          <p>&copy; {currentYear} LAWSAN South East Zone. All rights reserved.</p>
          <div className={styles.creditAndLegal}>
            <span className={styles.creditText}>
              Powered by{' '}
              <a href="https://build-with-ugob.com.ng/" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                Ugo.B
              </a>
            </span>
            <div className={styles.legalLinks}>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>

      </div>

      {/* The Editorial Signature - Massive Background Typography */}
      <div className={styles.massiveTextWrapper} aria-hidden="true">
        <span className={styles.massiveText}>LAWSAN</span>
      </div>
    </footer>
  );
}
