'use client';

import { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Building2,
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday,
} from 'date-fns';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/applications');
            const data = await res.json();
            if (Array.isArray(data)) setApplications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Get all events (interviews) for calendar
    const getEventsForDate = (date) => {
        const events = [];
        applications.forEach((app) => {
            (app.interviews || []).forEach((interview) => {
                if (isSameDay(new Date(interview.date), date)) {
                    events.push({
                        type: 'interview',
                        title: `${interview.type} — ${app.company}`,
                        time: format(new Date(interview.date), 'h:mm a'),
                        company: app.company,
                        position: app.position,
                        status: interview.status,
                    });
                }
            });

            // Show applied date
            if (app.appliedDate && isSameDay(new Date(app.appliedDate), date)) {
                events.push({
                    type: 'applied',
                    title: `Applied: ${app.company}`,
                    company: app.company,
                    position: app.position,
                });
            }
        });
        return events;
    };

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calStart = startOfWeek(monthStart);
        const calEnd = endOfWeek(monthEnd);

        const rows = [];
        let day = calStart;

        while (day <= calEnd) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const d = day;
                const events = getEventsForDate(d);
                const inMonth = isSameMonth(d, currentDate);
                const today = isToday(d);

                week.push(
                    <td
                        key={d.toISOString()}
                        className={`calendar-day p-2 border border-[var(--border-color)] align-top ${!inMonth ? 'opacity-30' : ''
                            } ${today ? 'calendar-day-today' : ''}`}
                    >
                        <div className={`text-xs font-medium mb-1 ${today ? 'text-[var(--accent-light)]' : 'text-[var(--muted)]'}`}>
                            {format(d, 'd')}
                        </div>
                        <div className="space-y-1">
                            {events.slice(0, 3).map((event, i) => (
                                <div
                                    key={i}
                                    className={`text-xs p-1 rounded truncate ${event.type === 'interview'
                                            ? 'bg-amber-500/15 text-amber-300'
                                            : 'bg-blue-500/15 text-blue-300'
                                        }`}
                                    title={event.title}
                                >
                                    {event.type === 'interview' && event.time && (
                                        <span className="font-medium">{event.time} </span>
                                    )}
                                    {event.title}
                                </div>
                            ))}
                            {events.length > 3 && (
                                <div className="text-xs text-[var(--muted)] pl-1">
                                    +{events.length - 3} more
                                </div>
                            )}
                        </div>
                    </td>
                );
                day = addDays(day, 1);
            }
            rows.push(<tr key={day.toISOString()}>{week}</tr>);
        }

        return rows;
    };

    return (
        <AppShell title="Calendar">
            <div className="animate-fade-in">
                {/* Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="btn-secondary"
                            style={{ padding: '0.5rem' }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold min-w-[180px] text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <button
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="btn-secondary"
                            style={{ padding: '0.5rem' }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="btn-secondary"
                    >
                        <CalendarIcon className="w-4 h-4" /> Today
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner spinner-lg" />
                    </div>
                ) : (
                    <Card className="overflow-hidden" style={{ padding: 0 }}>
                        <table className="w-full table-fixed border-collapse">
                            <thead>
                                <tr>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                        <th
                                            key={d}
                                            className="text-xs font-medium text-[var(--muted)] p-3 border-b border-[var(--border-color)] text-left"
                                        >
                                            {d}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>{renderCalendar()}</tbody>
                        </table>
                    </Card>
                )}

                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500/20" />
                        <span>Interview</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500/20" />
                        <span>Applied</span>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
