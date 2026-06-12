'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, Clock, AlertCircle, Download, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './success.module.css';

interface RegistrationDetails {
  fullName: string;
  ticketNumber: string;
  email: string;
  tierName: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const [status, setStatus] = useState<'loading' | 'success' | 'processing' | 'error'>('loading');
  const [details, setDetails] = useState<RegistrationDetails | null>(null);

  useEffect(() => {
    if (!ref) { setStatus('error'); return; }

    fetch(`/api/verify?ref=${ref}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'SUCCESS') {
          setDetails(data.registration);
          setStatus('success');
        } else if (data.status === 'PENDING') {
          setStatus('processing');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [ref]);

  if (status === 'loading') {
    return (
      <div className={styles.stateBox}>
        <div className={styles.spinner} />
        <h2>Verifying your payment…</h2>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.stateBox}>
        <span className={styles.stateIcon}><Clock size={48} color="var(--brand-gold)" /></span>
        <h2>Payment is being processed</h2>
        <p>Your payment was received and is being confirmed. You will receive your ticket via email within a few minutes.</p>
        <Link href="/" className="btn btn-outline">Return Home</Link>
      </div>
    );
  }

  if (status === 'error' || !details) {
    return (
      <div className={styles.stateBox}>
        <span className={styles.stateIcon}><AlertCircle size={48} color="#EF4444" /></span>
        <h2>Something went wrong</h2>
        <p>We couldn't verify your payment. If you were charged, please contact us with your reference: <strong>{ref}</strong></p>
        <a href="mailto:sezc2026@lawsansoutheast.org" className="btn btn-outline">Contact Support</a>
      </div>
    );
  }

  return (
    <div className={styles.successCard}>
      <div className={styles.successBadge}>
        <CheckCircle2 size={48} color="var(--brand-gold-dark)" />
      </div>
      <h1 className={styles.successTitle}>
        You're in, {details.fullName.split(' ')[0]}!
      </h1>
      <p className={styles.successSubtitle}>
        Your registration is confirmed. Welcome to SEZC 2026 — Owerri.
      </p>

      <div className={styles.ticketDetails}>
        <div className={styles.detailRow}>
          <span>Ticket Number</span>
          <span className={styles.detailValue}>{details.ticketNumber}</span>
        </div>
        <div className={styles.detailRow}>
          <span>Name</span>
          <span className={styles.detailValue}>{details.fullName}</span>
        </div>
        <div className={styles.detailRow}>
          <span>Ticket Tier</span>
          <span className={styles.detailValue}>{details.tierName}</span>
        </div>
        <div className={styles.detailRow}>
          <span>Email Sent To</span>
          <span className={styles.detailValue}>{details.email}</span>
        </div>
      </div>

      <p className={styles.emailNote}>
        <Mail size={16} style={{ marginRight: '6px', marginBottom: '-3px' }} />
        Your PDF ticket with QR code has been sent to <strong>{details.email}</strong>. Check your inbox (and spam folder).
      </p>

      <div className={styles.actions}>
        <a
          href={`/api/ticket/download?ref=${ref}`}
          className="btn btn-primary btn-lg"
          download
          id="download-ticket-btn"
        >
          <Download size={20} style={{ marginRight: '8px' }} /> Download PDF Ticket
        </a>
        <Link href="/" className="btn btn-outline btn-lg" id="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Suspense fallback={<div className={styles.stateBox}><div className={styles.spinner} /></div>}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
