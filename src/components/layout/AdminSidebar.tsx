import Link from 'next/link';
import styles from './AdminSidebar.module.css';

const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '🎫', label: 'Ticket Tiers', href: '/admin/dashboard#tickets' },
  { icon: '👥', label: 'Attendees', href: '/admin/dashboard#attendees' },
];

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>⚖</span>
        <div>
          <div className={styles.logoTitle}>SEZC 2026</div>
          <div className={styles.logoSub}>Admin</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={styles.navItem}>
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <Link href="/" className={styles.viewSite} target="_blank">
          ↗ View Public Site
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className={styles.logoutBtn}>Sign Out</button>
        </form>
      </div>
    </aside>
  );
}
