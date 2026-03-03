'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children, title = 'Dashboard' }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner spinner-lg mx-auto mb-4" />
                    <p className="text-[var(--muted)]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="flex min-h-screen gradient-bg overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-0">
                <Header title={title} />
                <main className="flex-1 p-6 lg:p-8 overflow-x-hidden overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
