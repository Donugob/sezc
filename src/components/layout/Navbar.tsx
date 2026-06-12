'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  return (
    <>
      <div className={styles.navbarWrapper}>
        <motion.header 
          className={`${styles.pillNavbar} ${scrolled ? styles.scrolled : ''}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className={styles.inner}>
            
            {/* Brand / Logos */}
            <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
              <div className={styles.logoGroup}>
                <Image 
                  src="/lawsa-logo.webp" 
                  alt="LAWSAN" 
                  width={28} 
                  height={28} 
                  className={styles.logoImg}
                />
                <Image 
                  src="/lawsan-se-logo.png" 
                  alt="LAWSAN SE" 
                  width={28} 
                  height={28} 
                  className={styles.logoImg}
                />
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>SEZC</span>
                <span className={styles.brandSub}>2026</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className={styles.desktopNav}>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className={styles.desktopCta}>
              <Link href="/register" className={styles.ctaBtn}>
                Register
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className={styles.mobileToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} color="var(--brand-gold)" /> : <Menu size={24} color="var(--white)" />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={styles.mobileOverlay}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            <div className={`container ${styles.mobileInner}`}>
              <div className={styles.mobileNavLinks}>
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                  >
                    <Link 
                      href={link.href} 
                      className={styles.mobileNavLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className={styles.mobileCtaBox}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  href="/register" 
                  className={styles.mobileCtaBtn}
                  onClick={() => setMenuOpen(false)}
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
