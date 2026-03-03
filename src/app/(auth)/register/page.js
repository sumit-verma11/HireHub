'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ArrowRight, Briefcase, Sparkles } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            const signInResult = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (signInResult?.error) {
                setError('Account created but sign in failed. Please try logging in.');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const iconStyle = { left: '16px' };
    const inputStyle = { paddingLeft: '48px' };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="bg-orb bg-orb-pink w-[500px] h-[500px] -top-40 -right-40 animate-blob" />
            <div className="bg-orb bg-orb-purple w-[400px] h-[400px] -bottom-32 -left-32 animate-blob" style={{ animationDelay: '4s' }} />
            <div className="bg-orb bg-orb-orange w-[300px] h-[300px] top-1/3 left-1/4 animate-blob" style={{ animationDelay: '8s' }} />

            {/* Floating particles */}
            <div className="absolute top-32 right-20 w-2 h-2 rounded-full bg-pink-400/30 animate-float" />
            <div className="absolute bottom-40 left-24 w-1.5 h-1.5 rounded-full bg-purple-400/30 animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 right-40 w-1 h-1 rounded-full bg-orange-400/30 animate-float" style={{ animationDelay: '2.5s' }} />

            <div className="w-full max-w-md relative z-10 mx-auto">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-accent mb-5 shadow-xl shadow-purple-500/30 animate-float">
                        <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold gradient-text mb-2">HireHub</h1>
                    <p className="text-[var(--muted)] text-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        Create your account to get started.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="glass p-8 space-y-5 animate-scale-in neon-glow-purple"
                    style={{ animationDelay: '150ms', animationFillMode: 'both' }}
                >
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">Name</label>
                        <div className="relative">
                            <User className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                            <input
                                type="text"
                                className="input"
                                style={inputStyle}
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">Email</label>
                        <div className="relative">
                            <Mail className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                            <input
                                type="email"
                                className="input"
                                style={inputStyle}
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">Password</label>
                        <div className="relative">
                            <Lock className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                            <input
                                type="password"
                                className="input"
                                style={inputStyle}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2.5 text-[var(--foreground)]">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--muted)]" style={iconStyle} />
                            <input
                                type="password"
                                className="input"
                                style={inputStyle}
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                                minLength={6}
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
                                <UserPlus className="w-4 h-4" />
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-[var(--muted)]">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-[var(--accent-light)] hover:text-pink-400 font-semibold transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
