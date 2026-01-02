import React from 'react';
import Link from 'next/link';
import { CheckCircle2, BookOpen, BarChart3, Heart, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation Bar */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Aura</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Link
              href="/lists"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">🚀 Plan. Track. Reflect. Grow.</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Productivity, 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Redesigned</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                A powerful yet minimalist system for organizing your life, tracking habits, and reflecting on your progress. No notifications. No distractions. Just clarity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/lists"
                className="group px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              >
                Start Organizing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/letter"
                className="px-8 py-4 rounded-lg border-2 border-primary/30 text-foreground font-semibold hover:bg-primary/10 transition-colors"
              >
                Write to Yourself
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Fully Local" value="Your Data" />
              <StatCard icon={<Zap className="w-5 h-5" />} label="Lightning Fast" value="No Lag" />
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="space-y-4">
              {/* Feature Preview Cards */}
              <div className="space-y-3">
                <div className="bg-card border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-foreground">Lists & Collections</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Track books, goals, and everything on your mind</p>
                </div>

                <div className="bg-card border border-accent/20 rounded-xl p-4 hover:border-accent/40 transition-all duration-200 transform hover:-translate-y-1 ml-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-sm font-medium text-foreground">Habit Trackers</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Monitor habits and see your progress unfold</p>
                </div>

                <div className="bg-card border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-foreground">Wellness Dashboard</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Track mood, stress, and sleep patterns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/50">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you stay organized and track what matters most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Lists"
            description="Create collections for anything worth tracking. Books to read, movies to watch, bucket list items—keep everything organized."
            href="/lists"
            color="from-primary"
          />

          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Trackers"
            description="Build custom trackers for habits, exercise, meditation, or any metric that drives your growth."
            href="/trackers"
            color="from-accent"
          />

          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Wellness"
            description="Monitor your mental and physical health. Track mood, stress, and sleep to understand your patterns."
            href="/wellness"
            color="from-destructive"
          />

          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Logs & Reflections"
            description="Write across different timeframes—daily reflections, weekly plans, and aspirations for your future."
            href="/logs"
            color="from-secondary"
          />
        </div>

        {/* Special Feature */}
        <div className="bg-gradient-to-r from-card to-card border border-primary/20 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Letter to Myself</h3>
              <p className="text-muted-foreground mb-4">
                Write letters to yourself throughout 2026. They unlock on December 31st—reflecting on your year with fresh perspective and gratitude.
              </p>
              <Link
                href="/letter"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Start Writing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Local First</h3>
            <p className="text-muted-foreground">Everything stays on your device. No cloud servers, no data collection. Your privacy is paramount.</p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Distraction Free</h3>
            <p className="text-muted-foreground">No notifications, no streaks, no gamification. Pure focus on what matters—your growth and reflection.</p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground">For 2026</h3>
            <p className="text-muted-foreground">Built specifically for one year of structured growth. A framework for tracking, reflecting, and evolving.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/50">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Transform Your Year?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start organizing, tracking, and reflecting today. No credit card required.
          </p>
          <Link
            href="/lists"
            className="inline-flex px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 gap-2 group"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Aura 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">Built for clarity, focus, and growth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="group bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 h-full">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} to-accent/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Explore <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-lg p-4 space-y-2">
      <div className="text-primary">{icon}</div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
