'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Lock, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './register.module.css';

interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  sold: number;
  perks: string[];
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  ticketTierId: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  institution?: string;
  ticketTierId?: string;
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get('tier');

  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<{ id: string, tierName: string, name: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    ticketTierId: preselectedTier || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetch('/api/tickets')
      .then((r) => r.json())
      .then((data) => {
        setTiers(data.tiers || []);
        if (!preselectedTier && data.tiers?.length > 0) {
          setFormData((f) => ({ ...f, ticketTierId: data.tiers[0].id }));
        }
      })
      .catch(() => setError('Could not load ticket information. Please try again.'))
      .finally(() => setLoading(false));
  }, [preselectedTier]);

  function validateStep1(): boolean {
    const errs: FormErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (at least 3 characters).';
    }
    if (!formData.institution.trim()) {
      errs.institution = 'Please enter your university or institution.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!/^(\+234|0)[789][01]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errs.phone = 'Please enter a valid Nigerian phone number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3(): boolean {
    const errs: FormErrors = {};
    if (!formData.ticketTierId) {
      errs.ticketTierId = 'Please select a ticket tier.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setCheckingEmail(true);
      setError('');
      try {
        const res = await fetch('/api/register/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();

        if (data.status === 'SUCCESS') {
          setError(`You are already successfully registered for the ${data.tierName} tier as ${data.name}! Check your email for your ticket.`);
          setCheckingEmail(false);
          return;
        } else if (data.status === 'PENDING') {
          setPendingRegistration({ id: data.id, tierName: data.tierName, name: data.name });
          setCheckingEmail(false);
          return;
        }

        setStep(3);
      } catch {
        // Proceed normally if check fails
        setStep(3);
      }
      setCheckingEmail(false);
    }
  }

  async function handleResume() {
    if (!pendingRegistration) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/register/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: pendingRegistration.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to resume payment.');
        setSubmitting(false);
        setPendingRegistration(null);
        return;
      }
      window.location.href = data.authorizationUrl;
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
      setPendingRegistration(null);
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedTier = tiers.find((t) => t.id === formData.ticketTierId);

  return (
    <>
      <Navbar />
      
      {pendingRegistration && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Incomplete Registration Found</h3>
            <p>We found an unfinished registration for <strong>{pendingRegistration.name}</strong> ({pendingRegistration.tierName} Tier) using this email.</p>
            <p>Would you like to resume your payment, or start fresh?</p>
            <div className={styles.buttonGroup}>
              <button 
                type="button"
                onClick={() => { setPendingRegistration(null); setStep(3); }} 
                className="btn btn-secondary" 
                disabled={submitting}
              >
                Start Fresh
              </button>
              <button 
                type="button"
                onClick={handleResume} 
                className="btn btn-primary" 
                disabled={submitting}
              >
                {submitting ? 'Resuming...' : 'Resume Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.main} id="main-content">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>
              Secure Your <span className="gradient-text">Delegate Pass</span>
            </h1>
            <p className={styles.subtitle}>
              Complete the steps below to register for the South East Zonal Convention 2026.
            </p>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} aria-label="Loading ticket information" />
              <p>Loading ticket information…</p>
            </div>
          ) : tiers.length === 0 ? (
            <div className={styles.closedState}>
              <span className={styles.closedIcon}><Lock size={48} color="var(--brand-navy)" /></span>
              <h2>Registration is Currently Closed</h2>
              <p>Ticket sales have not yet opened. Check back soon or follow our social media for updates.</p>
            </div>
          ) : (
            <div className={`${styles.formWrapper} ${step === 3 && selectedTier ? styles.formWrapperWithSidebar : styles.formWrapperCentered}`}>
              {/* Left: Form */}
              <div className={styles.formContainer}>
                
                {/* Progress Indicators */}
                <div className={styles.progressTracker}>
                  <div className={`${styles.progressStep} ${step >= 1 ? styles.activeStep : ''}`}>1. Identity</div>
                  <div className={`${styles.progressStep} ${step >= 2 ? styles.activeStep : ''}`}>2. Contact</div>
                  <div className={`${styles.progressStep} ${step >= 3 ? styles.activeStep : ''}`}>3. Ticket</div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate id="registration-form">
                  {step === 1 && (
                    <div className={styles.stepContent}>
                      <h2 className={styles.formSection}>Personal Details</h2>
                      <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name *</label>
                        <input
                          id="fullName"
                          type="text"
                          className={`form-input ${errors.fullName ? styles.inputError : ''}`}
                          placeholder="e.g. Chukwuemeka Okafor"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          autoComplete="name"
                        />
                        {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="institution">University / Institution *</label>
                        <input
                          id="institution"
                          type="text"
                          className={`form-input ${errors.institution ? styles.inputError : ''}`}
                          placeholder="e.g. University of Nigeria, Enugu Campus"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          autoComplete="organization"
                        />
                        {errors.institution && <p className="form-error">{errors.institution}</p>}
                      </div>
                      <div className={styles.buttonGroupRight}>
                        <button type="button" onClick={handleNext} className="btn btn-primary">
                          Continue to Contact Info →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className={styles.stepContent}>
                      <h2 className={styles.formSection}>Contact Information</h2>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address *</label>
                        <input
                          id="email"
                          type="email"
                          className={`form-input ${errors.email ? styles.inputError : ''}`}
                          placeholder="e.g. you@university.edu.ng"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          autoComplete="email"
                        />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number *</label>
                        <input
                          id="phone"
                          type="tel"
                          className={`form-input ${errors.phone ? styles.inputError : ''}`}
                          placeholder="e.g. 08012345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          autoComplete="tel"
                        />
                        {errors.phone && <p className="form-error">{errors.phone}</p>}
                      </div>
                      <div className={styles.buttonGroup}>
                        <button type="button" onClick={handleBack} className="btn btn-secondary">
                          ← Back
                        </button>
                        <button type="button" onClick={handleNext} className="btn btn-primary" disabled={checkingEmail}>
                          {checkingEmail ? 'Checking...' : 'Choose Ticket →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className={styles.stepContent}>
                      <h2 className={styles.formSection}>Select Ticket</h2>
                      <div className={styles.tierOptions}>
                        {tiers.map((tier) => {
                          const soldOut = tier.capacity !== null && tier.sold >= tier.capacity;
                          return (
                            <label
                              key={tier.id}
                              className={`${styles.tierOption} ${formData.ticketTierId === tier.id ? styles.tierSelected : ''} ${soldOut ? styles.tierSoldOut : ''}`}
                              htmlFor={`tier-${tier.id}`}
                            >
                              <input
                                id={`tier-${tier.id}`}
                                type="radio"
                                name="ticketTierId"
                                value={tier.id}
                                checked={formData.ticketTierId === tier.id}
                                onChange={() => setFormData({ ...formData, ticketTierId: tier.id })}
                                disabled={soldOut}
                                className={styles.tierRadio}
                              />
                              <div className={styles.tierInfo}>
                                <span className={styles.tierName}>{tier.name}</span>
                                <span className={styles.tierPrice}>{formatNaira(tier.price)}</span>
                              </div>
                              {soldOut && <span className={styles.soldOutBadge}>Sold Out</span>}
                            </label>
                          );
                        })}
                      </div>
                      {errors.ticketTierId && <p className="form-error">{errors.ticketTierId}</p>}

                      {error && (
                        <div className={styles.errorAlert} role="alert">
                          <AlertTriangle size={18} style={{ marginRight: '8px', marginBottom: '-4px' }} /> {error}
                        </div>
                      )}

                      <div className={styles.buttonGroup}>
                        <button type="button" onClick={handleBack} className="btn btn-secondary" disabled={submitting}>
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={submitting}
                          id="submit-registration-btn"
                        >
                          {submitting ? 'Processing…' : `Proceed to Payment`}
                        </button>
                      </div>

                      <p className={styles.secureNote}>
                        <Shield size={14} style={{ marginRight: '4px', marginBottom: '-2px' }} /> Payments are securely processed by Paystack. Your card details are never stored on our servers.
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Right: Order Summary */}
              {selectedTier && step === 3 && (
                <div className={styles.summary}>
                  <div className="glass-card">
                    <div className={styles.summaryHeader}>
                      <h3>Order Summary</h3>
                    </div>
                    <div className={styles.summaryBody}>
                      <div className={styles.summaryRow}>
                        <span>Ticket</span>
                        <span className={styles.summaryValue}>{selectedTier.name}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Event</span>
                        <span className={styles.summaryValue}>SEZC 2026, Owerri</span>
                      </div>
                      <div className={styles.summaryDivider} />
                      <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                        <span>Total</span>
                        <span className={styles.summaryTotalPrice}>{formatNaira(selectedTier.price)}</span>
                      </div>
                    </div>
                    <div className={styles.summaryPerks}>
                      <p className={styles.perksLabel}>What's included:</p>
                      <ul className={styles.perksList}>
                        {selectedTier.perks.map((p) => (
                          <li key={p} className={styles.perkItem}>
                            <CheckCircle size={16} color="var(--brand-gold-dark)" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '120px', textAlign: 'center' }}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
