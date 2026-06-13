'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Gavel, Landmark, BookOpen } from 'lucide-react';
import styles from './BackgroundParallax.module.css';

export default function BackgroundParallax() {
  // Track global window scroll
  const { scrollYProgress } = useScroll();

  // Different speeds and rotations for parallax depth
  // The y values translate the icons upward as you scroll down
  const y1 = useTransform(scrollYProgress, [0, 1], ["10vh", "-150vh"]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const y2 = useTransform(scrollYProgress, [0, 1], ["40vh", "-120vh"]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [15, -45]);

  const y3 = useTransform(scrollYProgress, [0, 1], ["70vh", "-180vh"]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [-15, 60]);

  const y4 = useTransform(scrollYProgress, [0, 1], ["90vh", "-100vh"]);
  const rotate4 = useTransform(scrollYProgress, [0, 1], [45, -10]);

  return (
    <div className={styles.parallaxWrapper}>
      <motion.div 
        className={styles.symbol} 
        style={{ top: '0%', right: '-5%', y: y1, rotate: rotate1, willChange: 'transform', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
      >
        <Scale size={500} strokeWidth={0.5} aria-hidden="true" focusable="false" />
      </motion.div>

      <motion.div 
        className={styles.symbol} 
        style={{ top: '20%', left: '-10%', y: y2, rotate: rotate2, willChange: 'transform', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
      >
        <Gavel size={600} strokeWidth={0.5} aria-hidden="true" focusable="false" />
      </motion.div>

      <motion.div 
        className={styles.symbol} 
        style={{ top: '50%', right: '5%', y: y3, rotate: rotate3, willChange: 'transform', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
      >
        <Landmark size={450} strokeWidth={0.5} aria-hidden="true" focusable="false" />
      </motion.div>

      <motion.div 
        className={styles.symbol} 
        style={{ top: '80%', left: '10%', y: y4, rotate: rotate4, willChange: 'transform', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
      >
        <BookOpen size={550} strokeWidth={0.5} aria-hidden="true" focusable="false" />
      </motion.div>
    </div>
  );
}
