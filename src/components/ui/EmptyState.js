import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-[var(--muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--muted)] max-w-sm mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}
