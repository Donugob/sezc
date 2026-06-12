'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScheduleSection.module.css';

export default function ScheduleSection() {
  const [activeTab, setActiveTab] = useState(0);

  const schedule = [
    {
      day: 'Day 1',
      title: 'Arrival & Welcome',
      events: [
        { time: 'Morning', name: 'Delegate Arrival & Registration', desc: 'Clearance and accommodation check-in.' },
        { time: 'Afternoon', name: 'Welcome Address', desc: 'Opening remarks by the Zonal Director.' },
        { time: 'Evening', name: 'Arrival Party', desc: 'Networking, music, and relaxation.' }
      ]
    },
    {
      day: 'Day 2',
      title: 'Intellectual & Cultural',
      events: [
        { time: 'Morning', name: 'Main Symposium', desc: '"Redefining Legal Practice" panel discussions.' },
        { time: 'Afternoon', name: 'Games Fest', desc: 'Inter-chapter sports and games.' },
        { time: 'Evening', name: 'Cultural Night & Pageantry', desc: 'Crowning of the Zonal King and Queen.' }
      ]
    },
    {
      day: 'Day 3',
      title: 'Grand Finale',
      events: [
        { time: 'Morning', name: 'Zonal Meetings & Awards', desc: 'Recognitions and chapter reports.' },
        { time: 'Evening', name: 'Grand Law Dinner', desc: 'Black-tie formal dinner and closing.' },
        { time: 'Next Day', name: 'Departure', desc: 'Safe travels to all delegates.' }
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
            Convention Itinerary
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
            Official dates to be announced shortly.
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
