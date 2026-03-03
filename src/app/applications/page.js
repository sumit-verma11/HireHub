'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AppShell from '../../components/layout/AppShell';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, Building2, MapPin, DollarSign, Kanban } from 'lucide-react';

const COLUMNS = [
    { id: 'Saved', label: 'Saved', color: '#94a3b8' },
    { id: 'Applied', label: 'Applied', color: '#60a5fa' },
    { id: 'Interview', label: 'Interview', color: '#fbbf24' },
    { id: 'Offer', label: 'Offer', color: '#34d399' },
    { id: 'Rejected', label: 'Rejected', color: '#f87171' },
];

export default function ApplicationsPage() {
    const router = useRouter();
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
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;

        // Optimistic update
        setApplications((prev) =>
            prev.map((app) =>
                app._id === draggableId ? { ...app, status: newStatus } : app
            )
        );

        try {
            await fetch(`/api/applications/${draggableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error('Failed to update status:', error);
            fetchApplications(); // Revert on error
        }
    };

    const getColumnApps = (status) =>
        applications.filter((app) => app.status === status);

    if (loading) {
        return (
            <AppShell title="Applications">
                <div className="flex items-center justify-center py-20">
                    <div className="spinner spinner-lg" />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="Applications">
            <div className="animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-[var(--muted)]">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
                    </p>
                    <button
                        onClick={() => router.push('/applications/new')}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        New Application
                    </button>
                </div>

                {applications.length === 0 ? (
                    <EmptyState
                        icon={Kanban}
                        title="No applications yet"
                        description="Start tracking your job applications by adding your first one."
                        action={
                            <button
                                onClick={() => router.push('/applications/new')}
                                className="btn-primary"
                            >
                                <Plus className="w-4 h-4" />
                                Add Application
                            </button>
                        }
                    />
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '500px' }}>
                            {COLUMNS.map((column) => {
                                const columnApps = getColumnApps(column.id);
                                return (
                                    <div
                                        key={column.id}
                                        className="flex-shrink-0"
                                        style={{ width: '280px' }}
                                    >
                                        {/* Column Header */}
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: column.color }}
                                            />
                                            <span className="text-sm font-semibold">{column.label}</span>
                                            <span className="text-xs text-[var(--muted)] ml-auto">
                                                {columnApps.length}
                                            </span>
                                        </div>

                                        <Droppable droppableId={column.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={`kanban-column glass-sm p-3 space-y-3 ${snapshot.isDraggingOver ? 'kanban-column-dragging-over' : ''
                                                        }`}
                                                >
                                                    {columnApps.map((app, index) => (
                                                        <Draggable
                                                            key={app._id}
                                                            draggableId={app._id}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => router.push(`/applications/${app._id}`)}
                                                                    className={`kanban-card glass-sm p-4 cursor-pointer ${snapshot.isDragging ? 'kanban-card-dragging' : ''
                                                                        }`}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                            <Building2 className="w-4 h-4 text-[var(--accent-light)]" />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="font-medium text-sm truncate">
                                                                                {app.position}
                                                                            </p>
                                                                            <p className="text-xs text-[var(--muted)] truncate">
                                                                                {app.company}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                                                                        {app.location && (
                                                                            <span className="flex items-center gap-1 truncate">
                                                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                                                {app.location}
                                                                            </span>
                                                                        )}
                                                                        {app.salary && (
                                                                            <span className="flex items-center gap-1 truncate ml-auto">
                                                                                <DollarSign className="w-3 h-3 flex-shrink-0" />
                                                                                {app.salary}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>
                    </DragDropContext>
                )}
            </div>
        </AppShell>
    );
}
