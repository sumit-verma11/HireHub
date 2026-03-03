'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../../../components/layout/AppShell';
import Card from '../../../components/ui/Card';
import {
    Building2,
    Briefcase,
    MapPin,
    DollarSign,
    Link2,
    FileText,
    Save,
    ArrowLeft,
} from 'lucide-react';

export default function NewApplicationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        company: '',
        position: '',
        status: 'Saved',
        salary: '',
        location: '',
        url: '',
        notes: '',
        appliedDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create application');
            }

            router.push('/applications');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const iconStyle = { left: '16px' };
    const inputStyle = { paddingLeft: '48px' };

    return (
        <AppShell title="New Application">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <Card>
                    <h2 className="text-xl font-semibold mb-6">Add New Application</h2>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company *</label>
                                <div className="relative">
                                    <Building2 className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                                    <input
                                        type="text"
                                        className="input"
                                        style={inputStyle}
                                        placeholder="Google"
                                        value={form.company}
                                        onChange={(e) => updateField('company', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Position *</label>
                                <div className="relative">
                                    <Briefcase className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                                    <input
                                        type="text"
                                        className="input"
                                        style={inputStyle}
                                        placeholder="Software Engineer"
                                        value={form.position}
                                        onChange={(e) => updateField('position', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    className="input"
                                    value={form.status}
                                    onChange={(e) => updateField('status', e.target.value)}
                                >
                                    <option value="Saved">Saved</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Applied Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={form.appliedDate}
                                    onChange={(e) => updateField('appliedDate', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                                    <input
                                        type="text"
                                        className="input"
                                        style={inputStyle}
                                        placeholder="San Francisco, CA"
                                        value={form.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Salary</label>
                                <div className="relative">
                                    <DollarSign className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                                    <input
                                        type="text"
                                        className="input"
                                        style={inputStyle}
                                        placeholder="120k - 150k"
                                        value={form.salary}
                                        onChange={(e) => updateField('salary', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Job URL</label>
                            <div className="relative">
                                <Link2 className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                                <input
                                    type="url"
                                    className="input"
                                    style={inputStyle}
                                    placeholder="https://careers.google.com/..."
                                    value={form.url}
                                    onChange={(e) => updateField('url', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Notes</label>
                            <div className="relative">
                                <FileText className="absolute w-[16px] h-[16px] text-[var(--muted)]" style={{ left: '16px', top: '16px' }} />
                                <textarea
                                    className="input"
                                    style={inputStyle}
                                    placeholder="Any notes about this application..."
                                    value={form.notes}
                                    onChange={(e) => updateField('notes', e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? (
                                    <div className="spinner" style={{ width: 18, height: 18 }} />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Application
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppShell>
    );
}
