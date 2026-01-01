import { Layout } from '@/components/Layout';

export function Placeholder({ name }: { name: string }) {
  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold text-foreground mb-4">{name}</h1>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">
            This feature is coming soon. Let us know what you'd like to build here!
          </p>
          <p className="text-sm text-muted-foreground">
            Continue prompting to build out this page.
          </p>
        </div>
      </div>
    </Layout>
  );
}
