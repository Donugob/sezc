import { prisma } from '@/lib/prisma';
import { formatNaira } from '@/lib/paystack';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TicketManager from '@/components/ui/TicketManager';
import AttendeeTable from '@/components/ui/AttendeeTable';
import Link from 'next/link';
import styles from './dashboard.module.css';

// Force Next.js to dynamically fetch live database records on every request
export const dynamic = 'force-dynamic';

function calculatePaystackFee(amountKobo: number): number {
  let fee = amountKobo * 0.015;
  if (amountKobo >= 250000) { // 2500 NGN = 250000 kobo
    fee += 10000; // 100 NGN = 10000 kobo
  }
  if (fee > 200000) { // Capped at 2000 NGN = 200000 kobo
    fee = 200000;
  }
  return Math.round(fee);
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const tab = params.tab || 'overview';

  let stats = { 
    grossRevenue: 0, 
    totalFees: 0, 
    netRevenue: 0, 
    totalRegistrations: 0, 
    venueCapacity: 1000, 
    byTier: [] as { tierName: string; count: number; capacity: number | null; gross: number; net: number }[] 
  };
  
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
    
    // Calculate global revenues
    registrations.forEach(r => {
      const fee = calculatePaystackFee(r.paystackAmount);
      stats.grossRevenue += r.paystackAmount;
      stats.totalFees += fee;
    });
    stats.netRevenue = stats.grossRevenue - stats.totalFees;

    stats.byTier = tierList.map(t => {
      const tierRegs = registrations.filter(r => r.ticketTierId === t.id);
      let tGross = 0;
      let tFees = 0;
      tierRegs.forEach(r => {
        const f = calculatePaystackFee(r.paystackAmount);
        tGross += r.paystackAmount;
        tFees += f;
      });

      return {
        tierName: t.name,
        count: tierRegs.length,
        capacity: t.capacity,
        gross: tGross,
        net: tGross - tFees,
      };
    });
  } catch {
    // DB offline fallback
  }

  // Calculate global capacity percentage
  const fillPercentage = stats.totalRegistrations > 0 ? Math.min((stats.totalRegistrations / stats.venueCapacity) * 100, 100) : 0;

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      
      <main className={styles.main}>
        {/* Header & Tabs */}
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Real-time metrics & reporting</p>
        </header>

        {tab === 'overview' && (
          <>
            {/* Bento Grid Top Section */}
            <div className={styles.bentoGrid}>
              
              {/* Main Net Revenue Widget */}
              <div className={`${styles.bentoCard} ${styles.heroRevenue}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>Net Revenue (After Fees)</span>
                </div>
                <div className={styles.heroValue}>{formatNaira(stats.netRevenue)}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                  <span>Gross: {formatNaira(stats.grossRevenue)}</span>
                  <span style={{ color: '#e53e3e' }}>Fees: -{formatNaira(stats.totalFees)}</span>
                </div>
                
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
                    <div className={styles.statSub}>Net: {formatNaira(t.net)}</div>
                    
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
          </>
        )}

        {tab === 'tickets' && (
          <div className={styles.sectionsWrapper}>
            <section className={styles.section} id="tickets">
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Ticket Configuration</h2>
              </header>
              <div className={styles.sectionCard}>
                <TicketManager initialTiers={tiers} />
              </div>
            </section>
          </div>
        )}

        {tab === 'attendees' && (
          <div className={styles.sectionsWrapper}>
            <section className={styles.section} id="attendees">
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Attendee Roster</h2>
              </header>
              <div className={styles.sectionCard}>
                <AttendeeTable registrations={allRegistrations} />
              </div>
            </section>
          </div>
        )}

      </main>
    </div>
  );
}
