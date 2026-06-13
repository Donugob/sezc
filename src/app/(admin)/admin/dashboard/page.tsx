import { prisma } from '@/lib/prisma';
import { formatNaira } from '@/lib/paystack';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TicketManager from '@/components/ui/TicketManager';
import AttendeeTable from '@/components/ui/AttendeeTable';
import styles from './dashboard.module.css';

// Force Next.js to dynamically fetch live database records on every request
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let stats = { totalRevenue: 0, totalRegistrations: 0, venueCapacity: 1000, byTier: [] as { tierName: string; count: number; capacity: number | null; revenue: number }[] };
  let allRegistrations: { id: string; fullName: string; email: string; phone: string; institution: string; ticketNumber: string; ticketTier: { name: string }; paymentStatus: string; paystackAmount: number; createdAt: Date }[] = [];
  let tiers: { id: string; name: string; description: string; price: number; capacity: number | null; sold: number; isOpen: boolean; perks: string[] }[] = [];

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

    stats.totalRegistrations = registrations.length;
    stats.totalRevenue = registrations.reduce((sum, r) => sum + r.paystackAmount, 0);
    stats.byTier = tierList.map(t => ({
      tierName: t.name,
      count: registrations.filter(r => r.ticketTierId === t.id).length,
      capacity: t.capacity,
      revenue: registrations.filter(r => r.ticketTierId === t.id).reduce((s, r) => s + r.paystackAmount, 0),
    }));
  } catch {
    // DB offline fallback
  }

  // Calculate global capacity percentage
  const fillPercentage = stats.totalRegistrations > 0 ? Math.min((stats.totalRegistrations / stats.venueCapacity) * 100, 100) : 0;

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>Real-time metrics & reporting</p>
        </header>

        {/* Bento Grid Top Section */}
        <div className={styles.bentoGrid}>
          
          {/* Main Revenue Widget */}
          <div className={`${styles.bentoCard} ${styles.heroRevenue}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Total Gross Revenue</span>
            </div>
            <div className={styles.heroValue}>{formatNaira(stats.totalRevenue)}</div>
            <div className={styles.heroSub}>Across {stats.totalRegistrations} secured registrations</div>
            
            {/* Faux mini area chart at bottom of card */}
            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.1 }}>
              <path d="M0,40 L0,20 Q25,30 50,15 T100,5 L100,40 Z" fill="#D4AF37" />
              <path d="M0,20 Q25,30 50,15 T100,5" fill="none" stroke="#D4AF37" strokeWidth="2" />
            </svg>
          </div>

          {/* Venue Capacity Widget */}
          <div className={`${styles.bentoCard} ${styles.heroRegistrations}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Venue Capacity</span>
              <span style={{ color: 'var(--brand-gold)', fontWeight: 600, fontSize: '0.875rem' }}>{Math.round(fillPercentage)}%</span>
            </div>
            <div className={styles.heroValue}>{stats.totalRegistrations}</div>
            <div className={styles.heroSub}>/ {stats.venueCapacity} Max Allowed</div>
            <div className={styles.tierProgressWrapper}>
              <div className={styles.tierProgressTrack}>
                <div className={styles.tierProgressFill} style={{ width: `${fillPercentage}%` }} />
              </div>
            </div>
          </div>

        </div>

        {/* Swipeable Metrics (Tiers) */}
        <div className={styles.metricsCarousel}>
          {stats.byTier.map(t => {
            const pct = t.capacity ? Math.min((t.count / t.capacity) * 100, 100) : 0;
            return (
              <div key={t.tierName} className={styles.bentoCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{t.tierName} Tier</span>
                </div>
                <div className={styles.statValue}>{t.count} <span style={{fontSize: '1rem', color: 'rgba(255,255,255,0.3)'}}>{t.capacity ? `/ ${t.capacity}` : ''}</span></div>
                <div className={styles.statSub}>Rev: {formatNaira(t.revenue)}</div>
                
                {t.capacity !== null && (
                  <div className={styles.tierProgressWrapper}>
                    <div className={styles.tierProgressTrack}>
                      <div className={styles.tierProgressFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Ticket Manager */}
          <section className={styles.section} id="tickets">
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ticket Configuration</h2>
            </header>
            <div className={styles.sectionCard}>
              <TicketManager initialTiers={tiers} />
            </div>
          </section>

          {/* Attendee Table */}
          <section className={styles.section} id="attendees">
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Attendee Roster</h2>
            </header>
            <div className={styles.sectionCard}>
              <AttendeeTable registrations={allRegistrations} />
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
