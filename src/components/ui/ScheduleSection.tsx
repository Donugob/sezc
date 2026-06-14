'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScheduleSection.module.css';

export default function ScheduleSection() {
  const [activeTab, setActiveTab] = useState(0);

  const schedule = [
    {
      day: 'Day 1',
      title: 'Arrival',
      events: [
        { time: 'Morning', name: 'Check-in', desc: 'Get your tags and settle in.' },
        { time: 'Afternoon', name: 'Welcome Speech', desc: 'Kick-off with the Zonal Director.' },
        { time: 'Evening', name: 'Welcome Party', desc: 'Music, drinks, and good vibes.' }
      ]
    },
    {
      day: 'Day 2',
      title: 'The Main Event',
      events: [
        { time: 'Morning', name: 'The Symposium', desc: 'Deep dives into the future of law.' },
        { time: 'Afternoon', name: 'Games Fest', desc: 'Rep your chapter on the field.' },
        { time: 'Evening', name: 'Cultural Night', desc: 'Fashion, music, and the crowning of the Zonal King & Queen.' }
      ]
    },
    {
      day: 'Day 3',
      title: 'The Finale',
      events: [
        { time: 'Morning', name: 'Awards & Meetings', desc: 'Recognitions and chapter wrap-ups.' },
        { time: 'Evening', name: 'The Grand Dinner', desc: 'Suits, gowns, and the final send-off.' },
        { time: 'Next Day', name: 'Departure', desc: 'Until next time.' }
      ]
    }
  ];

  return (
    <section className={styles.section} id="schedule">
      <div className={`container ${styles.container}`}>
        
        <div className={styles.header}>
          <motion.span 
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Plan
          </motion.span>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Event Schedule
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Official dates dropping soon.
          </motion.p>
        </div>

        {/* Interactive Tabs Menu */}
        <motion.div 
          className={styles.tabsWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {schedule.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`${styles.tabBtn} ${activeTab === i ? styles.activeTab : ''}`}
            >
              {day.day}
              {activeTab === i && (
                <motion.div 
                  layoutId="activeScheduleTab" 
                  className={styles.activeIndicator} 
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className={styles.contentWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={styles.dayContent}
            >
              <h3 className={styles.dayTitle}>{schedule[activeTab].title}</h3>
              
              <div className={styles.timeline}>
                {schedule[activeTab].events.map((ev, j) => (
                  <div key={j} className={styles.eventItem}>
                    <div className={styles.eventTime}>{ev.time}</div>
                    
                    <div className={styles.timelineCenter}>
                      <div className={styles.eventDot} />
                      {j !== schedule[activeTab].events.length - 1 && (
                        <div className={styles.eventLine} />
                      )}
                    </div>
                    
                    <div className={styles.eventDetails}>
                      <h4 className={styles.eventName}>{ev.name}</h4>
                      <p className={styles.eventDesc}>{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
