'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { InvoiceWithRefs } from '@/lib/types';
import InvoiceDetail from '@/components/invoices/InvoiceDetail';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceWithRefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) {
        setError('Invoice not found.');
        return;
      }
      const json = await res.json();
      setInvoice(json.data);
    } catch {
      setError('Failed to load invoice.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-4xl">
      <div className="mb-6 no-print">
        <Link href="/invoices" className="text-sm text-blue-600 hover:underline">
          ← Invoices
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12 text-sm text-gray-500">Loading invoice…</div>
      )}

      {error && (
        <div className="text-center py-12 text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && invoice && (
        <InvoiceDetail invoice={invoice} />
      )}
    </div>
  );
}
