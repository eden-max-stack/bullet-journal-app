import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Lists', href: '/lists' },
  { label: 'Logs', href: '/logs' },
  { label: 'Trackers', href: '/trackers' },
  { label: 'Wellness', href: '/wellness' },
  { label: 'Letter to Myself', href: '/letter' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-sidebar-foreground tracking-tight">Journal</h1>
        <p className="text-xs text-muted-foreground mt-2 font-medium">2026</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'block px-4 py-2.5 text-sm rounded-md transition-colors duration-150',
              location.pathname === item.href
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
        <p className="text-center">A personal system</p>
      </div>
    </aside>
  );
}
