'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import styles from './FaqSection.module.css';

export default function FaqSection() {
  const faqs = [
    { 
      q: 'Who is eligible to attend the convention?', 
      a: 'Any registered law student within the South East Zone is welcome, as well as invited alumni, legal practitioners, and special guests from across Nigeria.' 
    },
    { 
      q: 'Does the registration fee cover accommodation?', 
      a: 'Yes. Early Bird and Regular ticket tiers cover standard hotel accommodation for the 3 days. VIP ticket holders are upgraded to premium suites with specialized room service.' 
    },
    { 
      q: 'What is the official dress code for the events?', 
      a: 'Corporate/Professional attire is mandatory for the morning symposiums and panel sessions. We encourage native and cultural attire for the Cultural Night, and black-tie or formal evening wear for the Grand Law Dinner.' 
    },
    { 
      q: 'How do I participate in the sports or pageantry?', 
      a: 'Interested delegates should contact their local Chapter Presidents or the Zonal Director of Socials immediately after purchasing a ticket to receive the official registration forms.' 
    },
    { 
      q: 'Are tickets refundable?', 
      a: 'Ticket purchases are generally non-refundable. However, tickets are transferable to another student within the same institution up until 7 days before the event.' 
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
              Everything you need to know about attending the South East Zonal Convention. Can't find your answer? 
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
