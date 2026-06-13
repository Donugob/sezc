'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import styles from './FaqSection.module.css';

export default function FaqSection() {
  const faqs = [
    { 
      q: 'Who can attend?', 
      a: 'All registered law students in the South East Zone, plus alumni, lawyers, and invited guests from across Nigeria.' 
    },
    { 
      q: 'Does my ticket cover accommodation?', 
      a: 'Yes. Regular tickets cover standard hotel rooms for all 3 days, while VIP tickets include premium suites.' 
    },
    { 
      q: 'What should I wear?', 
      a: 'Corporate wear for morning sessions, traditional attire for Cultural Night, and formal black-tie for the Grand Dinner.' 
    },
    { 
      q: 'How do I join the sports or pageantry?', 
      a: 'Reach out to your local Chapter President or the Zonal Director of Socials right after getting your ticket.' 
    },
    { 
      q: 'Can I get a refund?', 
      a: 'Tickets are non-refundable, but you can transfer your ticket to another student in your school up to 7 days before the event.' 
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section} id="faq">
      <div className={`container ${styles.container}`}>
        
        {/* Left Column: Sticky Header */}
        <div className={styles.headerCol}>
          <div className={styles.stickyBox}>
            <motion.div 
              className={styles.iconBox}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <HelpCircle size={32} className={styles.headerIcon} strokeWidth={1.5} />
            </motion.div>
            
            <motion.span 
              className={styles.badge}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Support
            </motion.span>
            
            <motion.h2 
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Frequently <br />
              <span className={styles.goldItalic}>Asked Questions</span>
            </motion.h2>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Everything you need to know about attending the South East Zonal Convention. Can&apos;t find your answer?
              <a href="#sponsors" className={styles.contactLink}> Contact Support.</a>
            </motion.p>
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className={styles.faqCol}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div 
                key={i} 
                className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <button 
                  className={styles.faqQuestion} 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{faq.q}</span>
                  <div className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ''}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      className={styles.faqAnswerWrapper}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className={styles.faqAnswer}>
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
