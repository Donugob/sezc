'use client';

import { useState, useMemo } from 'react';
import { formatNaira } from '@/lib/paystack';
import { formatDate } from '@/lib/utils';
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
      r.ticketTier.name, koboToNaira(r.paystackAmount), formatDate(r.createdAt)
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

  function koboToNaira(kobo: number) { return kobo / 100; }

  return (
    <div className={styles.wrapper} id="attendees">
      {/* Controls */}
      <div className={styles.controls}>
        <input
          type="search"
          className={`form-input ${styles.searchInput}`}
          placeholder="Search by name, email, or ticket no…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="attendee-search"
        />
        <select
          className={`form-input ${styles.filterSelect}`}
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          id="tier-filter"
        >
          <option value="">All Tiers</option>
          {tierNames.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={exportCsv} id="export-csv-btn">
          ⬇ Export CSV
        </button>
      </div>

      <p className={styles.resultCount}>{filtered.length} attendee{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} role="table">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Name</th>
              <th>Institution</th>
              <th>Tier</th>
              <th>Amount</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td className={styles.ticketNo}>{r.ticketNumber}</td>
                <td>
                  <div className={styles.nameCell}>
                    <span>{r.fullName}</span>
                    <span className={styles.emailSub}>{r.email}</span>
                  </div>
                </td>
                <td className={styles.institution}>{r.institution}</td>
                <td><span className="badge badge-gold">{r.ticketTier.name}</span></td>
                <td>{formatNaira(r.paystackAmount)}</td>
                <td className={styles.date}>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p>No registrations found{search ? ` for "${search}"` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
