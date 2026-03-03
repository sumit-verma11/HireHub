'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../../../components/layout/AppShell';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import {
    ArrowLeft,
    Building2,
    MapPin,
    DollarSign,
    ExternalLink,
    Calendar,
    FileText,
    Plus,
    CheckCircle2,
    Circle,
    Trash2,
    Edit3,
    Save,
    Clock,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationDetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewForm, setInterviewForm] = useState({
        type: 'Phone',
        date: '',
        notes: '',
    });
    const [newChecklistItem, setNewChecklistItem] = useState('');

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            const res = await fetch(`/api/applications/${id}`);
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setApp(data);
            setEditForm(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const updated = await res.json();
                setApp(updated);
                setEditMode(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        try {
            await fetch(`/api/applications/${id}`, { method: 'DELETE' });
            router.push('/applications');
        } catch (error) {
            console.error(error);
        }
    };

    const addInterview = async () => {
        if (!interviewForm.date) return;
        const updatedInterviews = [...(app.interviews || []), interviewForm];
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviews: updatedInterviews }),
            });
            if (res.ok) {
                const updated = await res.json();
                setApp(updated);
                setShowInterviewModal(false);
                setInterviewForm({ type: 'Phone', date: '', notes: '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleChecklist = async (index) => {
        const updated = [...(app.checklist || [])];
        updated[index] = { ...updated[index], done: !updated[index].done };
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist: updated }),
            });
            if (res.ok) {
                const data = await res.json();
                setApp(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addChecklistItem = async () => {
        if (!newChecklistItem.trim()) return;
        const updated = [...(app.checklist || []), { item: newChecklistItem, done: false }];
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist: updated }),
            });
            if (res.ok) {
                const data = await res.json();
                setApp(data);
                setNewChecklistItem('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <AppShell title="Application">
                <div className="flex items-center justify-center py-20">
                    <div className="spinner spinner-lg" />
                </div>
            </AppShell>
        );
    }

    if (!app) {
        return (
            <AppShell title="Application">
                <div className="text-center py-20 text-[var(--muted)]">
                    Application not found.
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="Application Detail">
            <div className="max-w-4xl mx-auto animate-fade-in">
                {/* Back + Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push('/applications')}
                        className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Pipeline
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="btn-secondary"
                        >
                            <Edit3 className="w-4 h-4" />
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                        <button onClick={handleDelete} className="btn-danger">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            {editMode ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Company</label>
                                            <input
                                                className="input"
                                                value={editForm.company || ''}
                                                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Position</label>
                                            <input
                                                className="input"
                                                value={editForm.position || ''}
                                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Status</label>
                                            <select
                                                className="input"
                                                value={editForm.status || 'Saved'}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                {['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Location</label>
                                            <input
                                                className="input"
                                                value={editForm.location || ''}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Salary</label>
                                            <input
                                                className="input"
                                                value={editForm.salary || ''}
                                                onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">URL</label>
                                            <input
                                                className="input"
                                                value={editForm.url || ''}
                                                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Notes</label>
                                        <textarea
                                            className="input"
                                            rows={4}
                                            value={editForm.notes || ''}
                                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                        />
                                    </div>
                                    <button onClick={handleSave} className="btn-primary">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{app.position}</h2>
                                            <p className="text-[var(--muted)]">{app.company}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <Badge status={app.status} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {app.location && (
                                            <div className="flex items-center gap-2 text-[var(--muted)]">
                                                <MapPin className="w-4 h-4" /> {app.location}
                                            </div>
                                        )}
                                        {app.salary && (
                                            <div className="flex items-center gap-2 text-[var(--muted)]">
                                                <DollarSign className="w-4 h-4" /> {app.salary}
                                            </div>
                                        )}
                                        {app.appliedDate && (
                                            <div className="flex items-center gap-2 text-[var(--muted)]">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(app.appliedDate), 'MMM d, yyyy')}
                                            </div>
                                        )}
                                        {app.url && (
                                            <a
                                                href={app.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[var(--accent-light)] hover:text-[var(--accent)]"
                                            >
                                                <ExternalLink className="w-4 h-4" /> View Posting
                                            </a>
                                        )}
                                    </div>

                                    {app.notes && (
                                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-[var(--muted)]" />
                                                <span className="text-sm font-medium">Notes</span>
                                            </div>
                                            <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{app.notes}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>

                        {/* Interviews */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[var(--accent-light)]" />
                                    Interviews
                                </h3>
                                <button
                                    onClick={() => setShowInterviewModal(true)}
                                    className="btn-secondary"
                                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.813rem' }}
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>

                            {(!app.interviews || app.interviews.length === 0) ? (
                                <p className="text-sm text-[var(--muted)] text-center py-6">
                                    No interviews scheduled yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {app.interviews.map((interview, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)]">
                                            <div className="w-2 h-2 rounded-full" style={{
                                                backgroundColor: interview.status === 'Completed' ? 'var(--success)' : interview.status === 'Cancelled' ? 'var(--danger)' : 'var(--warning)'
                                            }} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{interview.type} Interview</p>
                                                <p className="text-xs text-[var(--muted)]">
                                                    {format(new Date(interview.date), 'MMM d, yyyy h:mm a')}
                                                </p>
                                            </div>
                                            <Badge status={interview.status === 'Scheduled' ? 'applied' : interview.status === 'Completed' ? 'offer' : 'rejected'}>
                                                {interview.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar — Checklist */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-semibold mb-4">Prep Checklist</h3>
                            <div className="space-y-2">
                                {(app.checklist || []).map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleChecklist(i)}
                                        className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                                    >
                                        {item.done ? (
                                            <CheckCircle2 className="w-5 h-5 text-[var(--success)] flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-[var(--muted)] flex-shrink-0" />
                                        )}
                                        <span className={`text-sm ${item.done ? 'line-through text-[var(--muted)]' : ''}`}>
                                            {item.item}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="text"
                                    className="input text-sm"
                                    placeholder="Add item..."
                                    value={newChecklistItem}
                                    onChange={(e) => setNewChecklistItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                                />
                                <button onClick={addChecklistItem} className="btn-primary">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Interview Modal */}
            <Modal
                isOpen={showInterviewModal}
                onClose={() => setShowInterviewModal(false)}
                title="Schedule Interview"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            className="input"
                            value={interviewForm.type}
                            onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                        >
                            {['Phone', 'Technical', 'Behavioral', 'Onsite', 'Other'].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            className="input"
                            value={interviewForm.date}
                            onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            className="input"
                            rows={3}
                            placeholder="Preparation notes..."
                            value={interviewForm.notes}
                            onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                        />
                    </div>
                    <button onClick={addInterview} className="btn-primary w-full">
                        <Plus className="w-4 h-4" /> Add Interview
                    </button>
                </div>
            </Modal>
        </AppShell>
    );
}
