'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight, Briefcase, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="bg-orb bg-orb-purple w-[500px] h-[500px] -top-40 -left-40 animate-blob" />
            <div className="bg-orb bg-orb-pink w-[400px] h-[400px] -bottom-32 -right-32 animate-blob" style={{ animationDelay: '4s' }} />
            <div className="bg-orb bg-orb-cyan w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob" style={{ animationDelay: '8s' }} />

            {/* Floating particles */}
            <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-purple-400/30 animate-float" />
            <div className="absolute top-40 right-32 w-1.5 h-1.5 rounded-full bg-pink-400/30 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-32 left-40 w-1 h-1 rounded-full bg-cyan-400/40 animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-md relative z-10 mx-auto">
                {/* Logo */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-accent mb-5 shadow-xl shadow-purple-500/30 animate-float">
                        <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold gradient-text mb-2">HireHub</h1>
                    <p className="text-[var(--muted)] text-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        Welcome back! Sign in to continue.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="glass p-8 space-y-6 animate-scale-in neon-glow-purple"
                    style={{ animationDelay: '150ms', animationFillMode: 'both' }}
                >
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={{ left: '16px' }} />
                            <input
                                type="email"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={{ left: '16px' }} />
                            <input
                                type="password"
                                className="input"
                                style={{ paddingLeft: '48px' }}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                        style={{ padding: '1rem' }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Sign In
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-[var(--muted)]">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            className="text-[var(--accent-light)] hover:text-pink-400 font-semibold transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
