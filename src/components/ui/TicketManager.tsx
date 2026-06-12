'use client';

import { useState } from 'react';
import { formatNaira } from '@/lib/paystack';
import styles from './TicketManager.module.css';

interface Tier {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  sold: number;
  isOpen: boolean;
  perks: string[];
}

interface TicketManagerProps {
  initialTiers: Tier[];
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  capacity: '',
  perks: '',
  isOpen: false,
};

export default function TicketManager({ initialTiers }: TicketManagerProps) {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError('');
  }

  function openEdit(tier: Tier) {
    setEditingId(tier.id);
    setForm({
      name: tier.name,
      description: tier.description,
      price: String(tier.price / 100),
      capacity: tier.capacity !== null ? String(tier.capacity) : '',
      perks: tier.perks.join('\n'),
      isOpen: tier.isOpen,
    });
    setShowForm(true);
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      capacity: form.capacity ? parseInt(form.capacity) : null,
      perks: form.perks.split('\n').map(p => p.trim()).filter(Boolean),
      isOpen: form.isOpen,
    };

    try {
      const url = editingId ? `/api/admin/tiers/${editingId}` : '/api/admin/tiers';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) { setError(data.error || 'Save failed.'); return; }

      if (editingId) {
        setTiers(tiers.map(t => t.id === editingId ? data.tier : t));
      } else {
        setTiers([...tiers, data.tier]);
      }
      setShowForm(false);
    } catch {
      setError('Unexpected error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleOpen(tier: Tier) {
    try {
      const res = await fetch(`/api/admin/tiers/${tier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tier, isOpen: !tier.isOpen }),
      });
      const data = await res.json();
      if (res.ok) setTiers(tiers.map(t => t.id === tier.id ? data.tier : t));
    } catch { /* silent */ }
  }

  async function deleteTier(id: string) {
    if (!confirm('Delete this ticket tier? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/tiers/${id}`, { method: 'DELETE' });
      if (res.ok) setTiers(tiers.filter(t => t.id !== id));
    } catch { /* silent */ }
  }

  return (
    <div className={styles.wrapper} id="tickets">
      <div className={styles.topBar}>
        <p className={styles.count}>{tiers.length} tier{tiers.length !== 1 ? 's' : ''} configured</p>
        <button className="btn btn-primary btn-sm" onClick={openCreate} id="create-tier-btn">
          + New Tier
        </button>
      </div>

      {/* Tier Cards */}
      <div className={styles.tiersGrid}>
        {tiers.map(tier => (
          <div key={tier.id} className={`glass-card ${styles.tierCard}`}>
            <div className={styles.tierHeader}>
              <div>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierPrice}>{formatNaira(tier.price)}</p>
              </div>
              <div className={`${styles.statusBadge} ${tier.isOpen ? styles.open : styles.closed}`}>
                {tier.isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
            <p className={styles.tierDesc}>{tier.description}</p>
            <div className={styles.tierMeta}>
              <span>Sold: <strong>{tier.sold}</strong>{tier.capacity ? ` / ${tier.capacity}` : ''}</span>
            </div>
            <div className={styles.tierActions}>
              <button className="btn btn-outline btn-sm" onClick={() => toggleOpen(tier)} id={`toggle-tier-${tier.id}`}>
                {tier.isOpen ? 'Close Registration' : 'Open Registration'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(tier)} id={`edit-tier-${tier.id}`}>Edit</button>
              <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => deleteTier(tier.id)} id={`delete-tier-${tier.id}`}>Delete</button>
            </div>
          </div>
        ))}

        {tiers.length === 0 && (
          <div className={styles.emptyState}>
            <p>No ticket tiers yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={editingId ? 'Edit Ticket Tier' : 'Create Ticket Tier'}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit' : 'Create'} Ticket Tier</h2>
              <button className={styles.closeBtn} onClick={() => setShowForm(false)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Tier Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. VIP" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short description of this tier" required />
              </div>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Price (₦) *</label>
                  <input className="form-input" type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 25000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity (blank = unlimited)</label>
                  <input className="form-input" type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="e.g. 100" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Perks (one per line)</label>
                <textarea className={`form-input ${styles.textarea}`} value={form.perks} onChange={e => setForm({...form, perks: e.target.value})} placeholder={"Arrival Party\nSymposium\nGrand Law Dinner"} rows={5} />
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.isOpen} onChange={e => setForm({...form, isOpen: e.target.checked})} />
                Open for registration immediately
              </label>
              {error && <p className="form-error">{error}</p>}
              <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} id="save-tier-btn">{saving ? 'Saving…' : 'Save Tier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
