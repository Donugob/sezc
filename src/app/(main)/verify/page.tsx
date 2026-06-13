import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Force dynamic rendering since we are checking live DB states
export const dynamic = 'force-dynamic';

async function VerifyContent({ searchParams }: { searchParams: { ticket?: string } }) {
  const ticketNumber = searchParams.ticket;

  if (!ticketNumber) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <ShieldAlert size={64} color="var(--danger, #e53e3e)" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Invalid Request</h1>
        <p style={{ color: 'var(--text-muted)' }}>No ticket number was provided for verification.</p>
      </div>
    );
  }

  const registration = await prisma.registration.findUnique({
    where: { ticketNumber },
    include: { ticketTier: true }
  });

  if (!registration || registration.paymentStatus !== 'SUCCESS') {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <ShieldAlert size={64} color="var(--danger, #e53e3e)" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '32px' }}>INVALID TICKET</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
          This ticket number ({ticketNumber}) does not exist or has not been paid for.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px', 
        padding: '40px', 
        width: '100%', 
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <ShieldCheck size={80} color="var(--success, #38a169)" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ color: 'var(--success, #38a169)', marginBottom: '8px', fontSize: '32px', letterSpacing: '1px' }}>VALID TICKET</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>SEZC 2026 AUTHORIZATION</p>

        <div style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '8px', textAlign: 'left' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delegate Name</p>
          <p style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }}>{registration.fullName}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ticket Number</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: 'var(--brand-gold)' }}>{registration.ticketNumber}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tier</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>{registration.ticketTier.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage({ searchParams }: { searchParams: { ticket?: string } }) {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ marginTop: '80px' }}>
        <Suspense fallback={<div style={{ padding: '120px', textAlign: 'center' }}>Loading verification...</div>}>
          <VerifyContent searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
