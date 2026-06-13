'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Return to Public Site
          </Link>
          
          <div className={styles.brandWrapper}>
            <Image 
              src="/lawsan-se-logo.png" 
              alt="LAWSAN SE Logo" 
              width={80} 
              height={80} 
              className={styles.logoMark} 
            />
            <h1 className={styles.title}>SEZC 2026</h1>
            <p className={styles.subtitle}>Administrative Portal</p>
          </div>
          
          <p className={styles.description}>
            Secure access for authorized organizers. All authentication attempts and subsequent activities are logged for auditing purposes.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          
          <div className={styles.mobileBrand}>
            <Link href="/" className={styles.backLinkMobile}>
              <ArrowLeft size={16} /> Public Site
            </Link>
            <Image 
              src="/lawsan-se-logo.png" 
              alt="LAWSAN SE Logo" 
              width={60} 
              height={60} 
              className={styles.mobileLogoMark} 
            />
            <h1 className={styles.mobileTitle}>SEZC 2026</h1>
            <p className={styles.mobileSubtitle}>Admin Portal</p>
          </div>

          <div className={styles.formHeader}>
            <h2>Sign In</h2>
            <p>Enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputContainer}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@lawsansoutheast.org"
                  autoComplete="username"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="current-password">Password</label>
              <div className={styles.inputContainer}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="current-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div id="login-error" className={styles.errorAlert} role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
