'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Briefcase,
  Kanban,
  BarChart3,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Rocket,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Kanban Pipeline',
    description: 'Drag-and-drop your applications through stages — from Saved to Offer.',
    color: 'from-violet-500 to-fuchsia-500',
    glow: 'rgba(139, 92, 246, 0.15)',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize your job search with charts for status breakdown and response rate.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(0, 240, 255, 0.1)',
  },
  {
    icon: Calendar,
    title: 'Interview Calendar',
    description: 'Track all your upcoming interviews and follow-ups in a monthly view.',
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: Users,
    title: 'Contact Manager',
    description: 'Keep track of recruiters, hiring managers, and professional connections.',
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with encrypted passwords and secure sessions.',
    color: 'from-rose-400 to-pink-500',
    glow: 'rgba(244, 63, 94, 0.1)',
  },
  {
    icon: Zap,
    title: 'Fast & Modern',
    description: 'Built with Next.js for lightning-fast performance and seamless navigation.',
    color: 'from-yellow-400 to-lime-400',
    glow: 'rgba(163, 255, 18, 0.08)',
  },
];

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb-purple w-[700px] h-[700px] -top-64 left-1/4 animate-blob" />
      <div className="bg-orb bg-orb-pink w-[500px] h-[500px] top-1/3 -right-48 animate-blob" style={{ animationDelay: '4s' }} />
      <div className="bg-orb bg-orb-cyan w-[400px] h-[400px] -bottom-32 left-1/3 animate-blob" style={{ animationDelay: '8s' }} />
      <div className="bg-orb bg-orb-orange w-[300px] h-[300px] top-2/3 left-10 animate-blob" style={{ animationDelay: '6s' }} />

      {/* Floating particles */}
      <div className="absolute top-24 left-[15%] w-2 h-2 rounded-full bg-purple-400/40 animate-float" />
      <div className="absolute top-48 right-[20%] w-1.5 h-1.5 rounded-full bg-pink-400/40 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[60%] left-[10%] w-1 h-1 rounded-full bg-cyan-400/50 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[10%] w-2.5 h-2.5 rounded-full bg-fuchsia-400/20 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-32 right-[30%] w-1.5 h-1.5 rounded-full bg-orange-400/30 animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl gradient-accent shadow-lg shadow-purple-500/25 animate-neon-pulse">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold gradient-text">HireHub</span>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                <Rocket className="w-4 h-4" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-4 pb-12 lg:pt-8 lg:pb-24 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-6 animate-shimmer">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Your job search, organized ✨
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Track Applications.
            <br />
            <span className="gradient-text">Land Your Dream Job.</span>
          </h1>
          <p className="text-lg lg:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
            HireHub gives you a beautiful Kanban board, analytics dashboard, and interview
            calendar — everything you need to stay organized during your job search.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={session ? '/dashboard' : '/register'}
              className="btn-primary text-base group"
              style={{ padding: '1.1rem 2.5rem', fontSize: '1rem' }}
            >
              <Rocket className="w-5 h-5" />
              {session ? 'Go to Dashboard' : 'Start Tracking Free'}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base"
              style={{ padding: '1.1rem 2.5rem', fontSize: '1rem' }}
            >
              <Star className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-16 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/15 text-pink-300 text-xs font-semibold mb-6 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-5 tracking-tight">
            Everything you need to <span className="gradient-text">manage your job search</span>
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto text-base">
            Built by job seekers, for job seekers. Every feature designed to help you stay
            organized and land more interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-sm glass-hover p-7 animate-fade-in group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-5 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
                  style={{ boxShadow: `0 8px 30px ${feature.glow}` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center">
        <div className="glass p-14 animate-pulse-glow relative overflow-hidden">
          {/* Background gradient inside CTA */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight">
              Ready to organize your job search?
            </h2>
            <p className="text-[var(--muted)] mb-8 text-base">
              Join HireHub and start tracking your applications today.
            </p>
            <Link
              href={session ? '/dashboard' : '/register'}
              className="btn-primary text-base"
              style={{ padding: '1.1rem 3rem', fontSize: '1rem' }}
            >
              {session ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-color)] px-6 py-10 text-center text-sm text-[var(--muted)]">
        <p>© 2026 HireHub. Built with Next.js, MongoDB & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
