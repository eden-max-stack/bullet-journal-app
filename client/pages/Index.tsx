import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-14">
          <h1 className="text-4xl font-semibold text-foreground mb-4 leading-tight">
            Your Year, Structured
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A minimalist bullet journal for 2026. Track what matters,
            organize your life, and capture your growth—without the noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          <FeatureCard
            title="Lists"
            description="Simple collections for books to read, shows to watch, bucket list items, and anything else worth tracking."
            href="/lists"
          />

          <FeatureCard
            title="Logs"
            description="Write across different timeframes—future aspirations, monthly goals, weekly plans, and daily reflections."
            href="/logs"
          />

          <FeatureCard
            title="Trackers"
            description="Build custom trackers for habits, exercise, gratitude, or any metric that matters to you."
            href="/trackers"
          />

          <FeatureCard
            title="Wellness"
            description="Track mood, stress, and sleep together. See correlations and patterns across your year."
            href="/wellness"
          />
        </div>

        <div className="border-t border-border pt-10 mb-10">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Special Feature
          </h2>
          <FeatureCard
            title="Letter to Myself"
            description="Write to yourself throughout 2026. Unlocks on December 31st to reflect on the year."
            href="/letter"
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-8 card-subtle">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            About This App
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              • <span className="font-medium text-foreground">Local-first</span> – Everything stays on your device
            </p>
            <p>
              • <span className="font-medium text-foreground">Distraction-free</span> – No notifications, no streaks, no pressure
            </p>
            <p>
              • <span className="font-medium text-foreground">Data-driven</span> – Tools for understanding yourself better
            </p>
            <p>
              • <span className="font-medium text-foreground">Built for one year</span> – Focus and structure for 2026
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href}>
      <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-150 h-full card-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
