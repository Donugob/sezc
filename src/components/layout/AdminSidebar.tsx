'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Ticket, Users, ExternalLink, LogOut } from 'lucide-react';
import { Suspense } from 'react';
import styles from './AdminSidebar.module.css';

const navItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard?tab=overview' },
  { id: 'tickets', icon: Ticket, label: 'Tickets', href: '/admin/dashboard?tab=tickets' },
  { id: 'attendees', icon: Users, label: 'Attendees', href: '/admin/dashboard?tab=attendees' },
];

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image 
            src="/lawsan-se-logo.png" 
            alt="LAWSAN SE Logo" 
            width={40} 
            height={40} 
            className={styles.logoMark} 
          />
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>SEZC 2026</div>
            <div className={styles.logoSub}>Command Center</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Link key={item.id} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Icon size={18} className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link href="/" className={styles.viewSite} target="_blank">
            <ExternalLink size={16} /> Public Site
          </Link>
          <form action="/api/admin/logout" method="POST" className={styles.logoutForm}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <Link key={item.id} href={item.href} className={`${styles.mobileNavItem} ${isActive ? styles.active : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function AdminSidebar() {
  return (
    <Suspense fallback={<aside className={styles.sidebar}></aside>}>
      <SidebarContent />
    </Suspense>
  );
}
