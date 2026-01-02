import { ReactNode } from 'react';
import { Navigation } from './Navigation';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="flex-1 ml-64">
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
