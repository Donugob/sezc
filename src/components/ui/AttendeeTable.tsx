'use client';

import { useState, useMemo } from 'react';
import { formatNaira } from '@/lib/paystack';
import { formatDate } from '@/lib/utils';
import { Download, Search, Filter } from 'lucide-react';
import styles from './AttendeeTable.module.css';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  ticketNumber: string;
  ticketTier: { name: string };
  paymentStatus: string;
  paystackAmount: number;
  createdAt: Date;
}

interface AttendeeTableProps {
  registrations: Registration[];
}

export default function AttendeeTable({ registrations }: AttendeeTableProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const tierNames = useMemo(() => {
    const unique = new Set(registrations.map(r => r.ticketTier.name));
    return Array.from(unique);
  }, [registrations]);

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      const q = search.toLowerCase();
      const matchesSearch = !q || r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.ticketNumber.toLowerCase().includes(q);
      const matchesTier = !tierFilter || r.ticketTier.name === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [registrations, search, tierFilter]);

  function exportCsv() {
    const header = ['Ticket No', 'Full Name', 'Email', 'Phone', 'Institution', 'Tier', 'Amount', 'Date'].join(',');
    const rows = filtered.map(r => [
      r.ticketNumber, r.fullName, r.email, r.phone, r.institution,
      r.ticketTier.name, (r.paystackAmount / 100).toString(), formatDate(r.createdAt)
    ].map(v => `"${v}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEZC-2026-Attendees-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getInitials(name: string) {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <div className={styles.wrapper}>
      {/* Top Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search attendees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className={styles.filterWrapper}>
          <Filter size={16} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
          >
            <option value="">All Tiers</option>
            {tierNames.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        <button className={styles.exportBtn} onClick={exportCsv}>
          <Download size={16} /> Export
        </button>
      </div>

      <p className={styles.resultCount}>Showing {filtered.length} attendees</p>

      {/* Desktop Table View */}
      <div className={styles.desktopTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Ticket No</th>
              <th>Institution</th>
              <th>Tier</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div className={styles.attendeeCell}>
                    <div className={styles.avatar}>{getInitials(r.fullName)}</div>
                    <div>
                      <div className={styles.attendeeName}>{r.fullName}</div>
                      <div className={styles.attendeeEmail}>{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.ticketNo}>{r.ticketNumber}</td>
                <td className={styles.institution}>{r.institution}</td>
                <td><span className={styles.badge}>{r.ticketTier.name}</span></td>
                <td className={styles.date}>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileList}>
        {filtered.map(r => (
          <div key={r.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.attendeeCell}>
                <div className={styles.avatar}>{getInitials(r.fullName)}</div>
                <div>
                  <div className={styles.attendeeName}>{r.fullName}</div>
                  <div className={styles.attendeeEmail}>{r.email}</div>
                </div>
              </div>
              <span className={styles.badge}>{r.ticketTier.name}</span>
            </div>
            <div className={styles.mobileCardDetails}>
              <div className={styles.detailRow}>
                <span>Ticket No:</span>
                <span className={styles.ticketNo}>{r.ticketNumber}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Institution:</span>
                <span className={styles.institution}>{r.institution}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Registered:</span>
                <span className={styles.date}>{formatDate(r.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          No registrations found.
        </div>
      )}
    </div>
  );
}
