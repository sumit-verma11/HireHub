'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

export default function Header({ title }) {
    const { data: session } = useSession();

    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-[var(--border-color)]">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>

            <div className="flex items-center gap-4">
                {session?.user && (
                    <>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="hidden sm:inline font-medium text-[var(--foreground)]">
                                {session.user.name}
                            </span>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="btn-secondary"
                            style={{ padding: '0.5rem 0.875rem', fontSize: '0.813rem' }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
