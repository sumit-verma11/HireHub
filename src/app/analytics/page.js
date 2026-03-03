'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    Target,
    Briefcase,
    Award,
    Clock,
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
);

const STATUS_COLORS = {
    Saved: '#94a3b8',
    Applied: '#60a5fa',
    Interview: '#fbbf24',
    Offer: '#34d399',
    Rejected: '#f87171',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics');
            const data = await res.json();
            setAnalytics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AppShell title="Analytics">
                <div className="flex items-center justify-center py-20">
                    <div className="spinner spinner-lg" />
                </div>
            </AppShell>
        );
    }

    const statusBreakdown = analytics?.statusBreakdown || [];
    const applicationsOverTime = analytics?.applicationsOverTime || [];

    // Doughnut data
    const doughnutData = {
        labels: statusBreakdown.map((s) => s._id),
        datasets: [
            {
                data: statusBreakdown.map((s) => s.count),
                backgroundColor: statusBreakdown.map((s) => STATUS_COLORS[s._id] || '#64748b'),
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    padding: 16,
                    usePointStyle: true,
                    font: { size: 12 },
                },
            },
        },
        cutout: '65%',
    };

    // Line chart data
    const lineLabels = applicationsOverTime.map(
        (d) => `${MONTHS[d._id.month - 1]} ${d._id.year}`
    );
    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: 'Applications',
                data: applicationsOverTime.map((d) => d.count),
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#7c3aed',
                pointRadius: 4,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { size: 11 } },
                grid: { color: 'rgba(100,120,180,0.1)' },
            },
            y: {
                ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
                grid: { color: 'rgba(100,120,180,0.1)' },
                beginAtZero: true,
            },
        },
    };

    // Bar chart — response rate breakdown
    const responded = statusBreakdown
        .filter((s) => ['Interview', 'Offer', 'Rejected'].includes(s._id))
        .reduce((sum, s) => sum + s.count, 0);
    const noResponse = (analytics?.total || 0) - responded;

    const barData = {
        labels: ['Responded', 'No Response'],
        datasets: [
            {
                data: [responded, noResponse],
                backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(100, 116, 139, 0.3)'],
                borderColor: ['#10b981', '#64748b'],
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { size: 11 } },
                grid: { display: false },
            },
            y: {
                ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
                grid: { color: 'rgba(100,120,180,0.1)' },
                beginAtZero: true,
            },
        },
    };

    const stats = [
        {
            label: 'Total Applications',
            value: analytics?.total || 0,
            icon: Briefcase,
            color: 'stat-card-purple',
        },
        {
            label: 'Response Rate',
            value: `${analytics?.responseRate || 0}%`,
            icon: Target,
            color: 'stat-card-green',
        },
        {
            label: 'Interviews',
            value: statusBreakdown.find((s) => s._id === 'Interview')?.count || 0,
            icon: Clock,
            color: 'stat-card-amber',
        },
        {
            label: 'Offers',
            value: statusBreakdown.find((s) => s._id === 'Offer')?.count || 0,
            icon: Award,
            color: 'stat-card-blue',
        },
    ];

    return (
        <AppShell title="Analytics">
            <div className="space-y-6 animate-fade-in">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className={`glass-sm p-5 stat-card ${stat.color} animate-fade-in`}
                                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-[var(--muted)]">{stat.label}</span>
                                    <Icon className="w-5 h-5 text-[var(--muted)]" />
                                </div>
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Breakdown */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <PieChart className="w-5 h-5 text-[var(--accent-light)]" />
                            <h3 className="font-semibold">Status Breakdown</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {statusBreakdown.length > 0 ? (
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
                                    No data yet
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Applications Over Time */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-[var(--accent-light)]" />
                            <h3 className="font-semibold">Applications Over Time</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {applicationsOverTime.length > 0 ? (
                                <Line data={lineData} options={lineOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
                                    No data yet
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Response Rate */}
                    <Card className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-[var(--accent-light)]" />
                            <h3 className="font-semibold">Response Rate</h3>
                        </div>
                        <div style={{ height: '240px' }}>
                            {(analytics?.total || 0) > 0 ? (
                                <Bar data={barData} options={barOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
                                    No data yet
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
