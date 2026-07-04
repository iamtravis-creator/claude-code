'use client';
import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { InvoiceWithRefs, Invoice, PaymentMethod } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface InvoiceDetailProps {
  invoice: InvoiceWithRefs;
}

interface PaymentForm {
  payment_date: string;
  payment_method: PaymentMethod | '';
  amount_paid: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod | ''; label: string }[] = [
  { value: '', label: 'Select method…' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
];

const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  cash: 'bg-green-100 text-green-700',
  check: 'bg-teal-100 text-teal-700',
  card: 'bg-blue-100 text-blue-700',
  bank_transfer: 'bg-indigo-100 text-indigo-700',
  venmo: 'bg-purple-100 text-purple-700',
  zelle: 'bg-yellow-100 text-yellow-700',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

// ── Component ─────────────────────────────────────────────────────────────────

export default function InvoiceDetail({ invoice: initialInvoice }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<InvoiceWithRefs>(initialInvoice);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payForm, setPayForm] = useState<PaymentForm>({
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: invoice.payment_method ?? '',
    amount_paid: invoice.amount_paid != null ? String(invoice.amount_paid) : String(invoice.total),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPaid = invoice.status === 'paid';
  const amountPaid = invoice.amount_paid ?? 0;
  const balance = Math.round((invoice.total - amountPaid) * 100) / 100;

  // ── Record payment ──────────────────────────────────────────────────────────
  async function handlePaymentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!payForm.payment_method) {
      setError('Please select a payment method.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      payment_date: payForm.payment_date,
      payment_method: payForm.payment_method,
      amount_paid: parseFloat(payForm.amount_paid) || 0,
      status: 'paid',
    };

    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to record payment.');
      } else {
        setInvoice(prev => ({ ...prev, ...json.data }));
        setPaymentModalOpen(false);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-container { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="no-print flex items-center justify-between mb-6">
        <Badge value={invoice.status} />
        <div className="flex gap-2">
          {!isPaid && (
            <Button variant="secondary" size="sm" onClick={() => setPaymentModalOpen(true)}>
              Record Payment
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="print-container bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
        {/* Company header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CleanCo Services</h1>
            <p className="text-sm text-gray-500 mt-1">Professional Cleaning Solutions</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">INVOICE</p>
            <p className="text-sm text-gray-600 mt-1">{invoice.invoice_number}</p>
          </div>
        </div>

        {/* Invoice meta + client info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Bill To</p>
            <p className="text-sm font-semibold text-gray-900">{invoice.contact_name ?? '—'}</p>
            {invoice.job_title && (
              <p className="text-sm text-gray-500 mt-0.5">Re: {invoice.job_title}</p>
            )}
          </div>
          <div className="text-right space-y-1">
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-gray-500">Issue Date</span>
              <span className="font-medium text-gray-800 w-32">{fmtDate(invoice.issue_date)}</span>
            </div>
            {invoice.due_date && (
              <div className="flex justify-end gap-4 text-sm">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium text-gray-800 w-32">{fmtDate(invoice.due_date)}</span>
              </div>
            )}
            <div className="flex justify-end gap-4 text-sm items-center">
              <span className="text-gray-500">Status</span>
              <span className="w-32 flex justify-end">
                <Badge value={invoice.status} />
              </span>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 pr-4">Description</th>
              <th className="text-center py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 w-16">Qty</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Unit Price</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-800">{item.description}</td>
                  <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{fmt(item.unit_price)}</td>
                  <td className="py-3 text-right font-medium text-gray-800">{fmt(item.total)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-gray-400">No line items</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800">{fmt(invoice.subtotal)}</span>
            </div>
            {(invoice.tax_rate ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax ({invoice.tax_rate}%)</span>
                <span className="font-medium text-gray-800">{fmt(invoice.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1.5">
              <span>Total</span>
              <span>{fmt(invoice.total)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-700">
                  <span>Amount Paid</span>
                  <span className="font-medium">{fmt(amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-200 pt-1.5">
                  <span>Balance Due</span>
                  <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>{fmt(balance)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment info */}
        {invoice.payment_method && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <span>Paid via</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_METHOD_COLORS[invoice.payment_method]}`}>
              {invoice.payment_method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            {invoice.payment_date && (
              <span>on {fmtDate(invoice.payment_date)}</span>
            )}
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 mt-6 text-center text-xs text-gray-400">
          Thank you for your business — CleanCo Services
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => { setPaymentModalOpen(false); setError(null); }}
        title="Record Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <Input
            label="Payment Date *"
            id="payment_date"
            type="date"
            value={payForm.payment_date}
            onChange={e => setPayForm(f => ({ ...f, payment_date: e.target.value }))}
            required
          />
          <Select
            label="Payment Method *"
            id="payment_method"
            value={payForm.payment_method}
            onChange={e => setPayForm(f => ({ ...f, payment_method: e.target.value as PaymentMethod | '' }))}
            options={PAYMENT_METHOD_OPTIONS}
          />
          <Input
            label="Amount Paid ($) *"
            id="amount_paid"
            type="number"
            min="0"
            step="0.01"
            value={payForm.amount_paid}
            onChange={e => setPayForm(f => ({ ...f, amount_paid: e.target.value }))}
            required
          />

          <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-600">
            Invoice total: <span className="font-semibold text-gray-900">{fmt(invoice.total)}</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setPaymentModalOpen(false); setError(null); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
