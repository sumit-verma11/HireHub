'use client';

import { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Linkedin,
    FileText,
    Edit3,
    Trash2,
    Save,
} from 'lucide-react';

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', company: '', role: '', notes: '', linkedIn: '',
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/contacts');
            const data = await res.json();
            if (Array.isArray(data)) setContacts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const url = editingContact ? `/api/contacts/${editingContact._id}` : '/api/contacts';
            const method = editingContact ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                fetchContacts();
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this contact?')) return;
        try {
            await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            fetchContacts();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (contact) => {
        setEditingContact(contact);
        setForm({
            name: contact.name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            company: contact.company || '',
            role: contact.role || '',
            notes: contact.notes || '',
            linkedIn: contact.linkedIn || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingContact(null);
        setForm({ name: '', email: '', phone: '', company: '', role: '', notes: '', linkedIn: '' });
    };

    const filtered = contacts.filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            c.name?.toLowerCase().includes(q) ||
            c.company?.toLowerCase().includes(q) ||
            c.role?.toLowerCase().includes(q)
        );
    });

    return (
        <AppShell title="Contacts">
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={{ left: '16px' }} />
                        <input
                            type="text"
                            className="input"
                            style={{ paddingLeft: '48px' }}
                            placeholder="Search contacts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setEditingContact(null); setShowModal(true); }}
                        className="btn-primary ml-4"
                    >
                        <Plus className="w-4 h-4" /> Add Contact
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner spinner-lg" />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={search ? 'No contacts found' : 'No contacts yet'}
                        description={search ? 'Try a different search term.' : 'Start building your professional network.'}
                        action={
                            !search && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn-primary"
                                >
                                    <Plus className="w-4 h-4" /> Add Contact
                                </button>
                            )
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((contact, index) => (
                            <div
                                key={contact._id}
                                className="glass-sm glass-hover p-5 animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-white">
                                            {contact.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{contact.name}</p>
                                            {contact.role && (
                                                <p className="text-xs text-[var(--muted)]">{contact.role}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEdit(contact)}
                                            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                                        >
                                            <Edit3 className="w-3.5 h-3.5 text-[var(--muted)]" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs text-[var(--muted)]">
                                    {contact.company && (
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5" /> {contact.company}
                                        </div>
                                    )}
                                    {contact.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" />
                                            <a href={`mailto:${contact.email}`} className="hover:text-[var(--accent-light)] transition-colors">
                                                {contact.email}
                                            </a>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" /> {contact.phone}
                                        </div>
                                    )}
                                    {contact.linkedIn && (
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="w-3.5 h-3.5" />
                                            <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-light)] transition-colors truncate">
                                                LinkedIn
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={closeModal}
                    title={editingContact ? 'Edit Contact' : 'Add Contact'}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <input
                                className="input"
                                placeholder="Jane Smith"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="jane@company.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    className="input"
                                    placeholder="+1 234 567 890"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Company</label>
                                <input
                                    className="input"
                                    placeholder="Google"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <input
                                    className="input"
                                    placeholder="Recruiter"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">LinkedIn</label>
                            <input
                                className="input"
                                placeholder="https://linkedin.com/in/..."
                                value={form.linkedIn}
                                onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <textarea
                                className="input"
                                rows={3}
                                placeholder="Notes about this contact..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>
                        <button onClick={handleSubmit} className="btn-primary w-full">
                            <Save className="w-4 h-4" />
                            {editingContact ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </div>
                </Modal>
            </div>
        </AppShell>
    );
}
