import { prisma } from '@/lib/prisma';
import { formatNaira } from '@/lib/paystack';
import { formatDate } from '@/lib/utils';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TicketManager from '@/components/ui/TicketManager';
import AttendeeTable from '@/components/ui/AttendeeTable';
import styles from './dashboard.module.css';

export default async function AdminDashboardPage() {
  let stats = { totalRevenue: 0, totalRegistrations: 0, byTier: [] as { tierName: string; count: number; revenue: number }[] };
  let recentRegistrations: { fullName: string; email: string; institution: string; ticketNumber: string; ticketTier: { name: string }; createdAt: Date }[] = [];
  let tiers: { id: string; name: string; description: string; price: number; capacity: number | null; sold: number; isOpen: boolean; perks: string[] }[] = [];
  let allRegistrations: { id: string; fullName: string; email: string; phone: string; institution: string; ticketNumber: string; ticketTier: { name: string }; paymentStatus: string; paystackAmount: number; createdAt: Date }[] = [];

  try {
    const [registrations, tierList] = await Promise.all([
      prisma.registration.findMany({
        where: { paymentStatus: 'SUCCESS' },
        include: { ticketTier: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.ticketTier.findMany({ orderBy: { price: 'asc' } }),
    ]);

    tiers = tierList;
    allRegistrations = registrations;
    recentRegistrations = registrations.slice(0, 5);

    stats.totalRegistrations = registrations.length;
    stats.totalRevenue = registrations.reduce((sum, r) => sum + r.paystackAmount, 0);
    stats.byTier = tierList.map(t => ({
      tierName: t.name,
      count: registrations.filter(r => r.ticketTierId === t.id).length,
      revenue: registrations.filter(r => r.ticketTierId === t.id).reduce((s, r) => s + r.paystackAmount, 0),
    }));
  } catch {
    // DB not connected — show empty state
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>SEZC 2026 — Owerri</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={`glass-card ${styles.statCard}`}>
            <p className={styles.statLabel}>Total Revenue</p>
            <p className={styles.statValue}>{formatNaira(stats.totalRevenue)}</p>
          </div>
          <div className={`glass-card ${styles.statCard}`}>
            <p className={styles.statLabel}>Total Registrations</p>
            <p className={styles.statValue}>{stats.totalRegistrations}</p>
          </div>
          {stats.byTier.map(t => (
            <div key={t.tierName} className={`glass-card ${styles.statCard}`}>
              <p className={styles.statLabel}>{t.tierName}</p>
              <p className={styles.statValue}>{t.count}</p>
              <p className={styles.statSub}>{formatNaira(t.revenue)}</p>
            </div>
          ))}
        </div>

        {/* Ticket Manager */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ticket Tiers</h2>
          <TicketManager initialTiers={tiers} />
        </section>

        {/* Attendee Table */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Registered Attendees</h2>
          <AttendeeTable registrations={allRegistrations} />
        </section>
      </main>
    </div>
  );
}
