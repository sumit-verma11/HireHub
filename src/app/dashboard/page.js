'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
    Briefcase,
    TrendingUp,
    Award,
    Clock,
    Plus,
    ArrowRight,
    Building2,
    MapPin,
} from 'lucide-react';

const statCards = [
    { key: 'total', label: 'Total Applications', icon: Briefcase, color: 'stat-card-purple' },
    { key: 'interviews', label: 'Interviews', icon: Clock, color: 'stat-card-amber' },
    { key: 'offers', label: 'Offers', icon: Award, color: 'stat-card-green' },
    { key: 'responseRate', label: 'Response Rate', icon: TrendingUp, color: 'stat-card-blue' },
];

export default function DashboardPage() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ total: 0, interviews: 0, offers: 0, responseRate: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appsRes, analyticsRes] = await Promise.all([
                fetch('/api/applications'),
                fetch('/api/analytics'),
            ]);

            const apps = await appsRes.json();
            const analytics = await analyticsRes.json();

            if (Array.isArray(apps)) {
                setApplications(apps.slice(0, 5));
            }

            const statusMap = {};
            (analytics.statusBreakdown || []).forEach((s) => {
                statusMap[s._id] = s.count;
            });

            setStats({
                total: analytics.total || 0,
                interviews: statusMap['Interview'] || 0,
                offers: statusMap['Offer'] || 0,
                responseRate: analytics.responseRate || 0,
            });
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell title="Dashboard">
            <div className="space-y-8 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const value = stat.key === 'responseRate' ? `${stats[stat.key]}%` : stats[stat.key];
                        return (
                            <div
                                key={stat.key}
                                className={`glass-sm p-5 stat-card ${stat.color} animate-fade-in`}
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-[var(--muted)]">{stat.label}</span>
                                    <Icon className="w-5 h-5 text-[var(--muted)]" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {loading ? '—' : value}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions + Recent Applications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Add */}
                    <div className="lg:col-span-1">
                        <Card className="h-full">
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/applications/new')}
                                    className="btn-primary w-full"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Application
                                </button>
                                <button
                                    onClick={() => router.push('/applications')}
                                    className="btn-secondary w-full"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    View Pipeline
                                </button>
                                <button
                                    onClick={() => router.push('/contacts')}
                                    className="btn-secondary w-full"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Contact
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Applications */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Recent Applications</h2>
                                <button
                                    onClick={() => router.push('/applications')}
                                    className="text-sm text-[var(--accent-light)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
                                >
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="spinner" />
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="text-center py-12 text-[var(--muted)]">
                                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                    <p>No applications yet. Start tracking!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <div
                                            key={app._id}
                                            onClick={() => router.push(`/applications/${app._id}`)}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-5 h-5 text-[var(--accent-light)]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{app.position}</p>
                                                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                                                        <span>{app.company}</span>
                                                        {app.location && (
                                                            <>
                                                                <span>·</span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {app.location}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge status={app.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
