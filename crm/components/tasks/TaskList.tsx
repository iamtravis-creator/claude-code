'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { TaskWithRefs } from '@/lib/types';

function isOverdue(due_date?: string, status?: string): boolean {
  if (!due_date || status === 'done' || status === 'cancelled') return false;
  return new Date(due_date) < new Date(new Date().toDateString());
}

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskWithRefs[]>([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [modal, setModal] = useState<{ open: boolean; task?: TaskWithRefs }>({ open: false });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    const res = await fetch(`/api/tasks?${params}`);
    const json = await res.json();
    setTasks(json.data);
  }, [status, priority]);

  useEffect(() => { load(); }, [load]);

  async function toggleDone(task: TaskWithRefs) {
    const newStatus = task.status === 'done' ? 'open' : 'done';
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        action={<Button onClick={() => setModal({ open: true })}>+ New Task</Button>}
      />
      <TaskFilters status={status} priority={priority} onStatus={setStatus} onPriority={setPriority} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['', 'Task', 'Priority', 'Status', 'Due Date', 'Contact', 'Deal', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No tasks found</td></tr>
            )}
            {tasks.map(t => (
              <tr key={t.id} className={`hover:bg-gray-50 ${t.status === 'done' ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={t.status === 'done'}
                    onChange={() => toggleDone(t)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </td>
                <td className={`px-4 py-3 font-medium ${t.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                  {t.title}
                </td>
                <td className="px-4 py-3"><Badge value={t.priority} /></td>
                <td className="px-4 py-3"><Badge value={t.status} /></td>
                <td className={`px-4 py-3 ${isOverdue(t.due_date, t.status) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {t.due_date ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {t.contact_name ? (
                    <Link href={`/contacts/${t.contact_id}`} className="text-blue-600 hover:underline">{t.contact_name}</Link>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{t.deal_title ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, task: t })}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(t.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.task ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          initialData={modal.task}
          onSuccess={() => { setModal({ open: false }); load(); }}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
