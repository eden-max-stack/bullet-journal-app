import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { getLetter, saveLetter, isLetterUnlocked } from '@/lib/storage';

export default function LetterPage() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const unlocked = isLetterUnlocked();

  useEffect(() => {
    setContent(getLetter());
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    saveLetter(content);
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  };

  const daysUntilNew = () => {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const diff = endOfYear.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Letter to Myself
          </h1>
          {unlocked ? (
            <p className="text-lg text-accent font-medium">
              🔓 Unlocked! Reflect on your year.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Write to yourself throughout 2026. Unlocks on December 31st.
            </p>
          )}
        </div>

        {!unlocked ? (
          <div className="bg-card border border-border rounded-xl p-10 space-y-8 card-subtle">
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-border">
                <div className="text-6xl font-bold text-primary">
                  {daysUntilNew()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Days until</p>
                  <p className="text-muted-foreground">December 31st, 2026</p>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, hopes, and goals for the year. This will be locked until December 31st..."
                className="w-full h-96 p-5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  {lastSaved ? (
                    <>
                      Last saved {lastSaved.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  ) : (
                    'Auto-saves as you write'
                  )}
                </p>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-150 font-medium ${
                    isSaving
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="bg-sidebar-accent p-6 rounded-lg border border-border/50">
              <p className="text-sm text-foreground mb-3 font-semibold">
                ✨ Why write a letter to yourself?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Capture your aspirations, fears, and hopes at the beginning of the year.
                On December 31st, revisit these words and reflect on your growth and changes.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-10 space-y-8 card-subtle">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <span className="text-5xl">🔓</span>
              <div>
                <p className="text-xl font-semibold text-foreground">Year Complete</p>
                <p className="text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="bg-sidebar-accent p-5 rounded-lg border border-border/50">
              <p className="text-sm text-foreground font-semibold">
                What has changed? What have you learned?
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-background p-6 rounded-lg border border-border min-h-96">
                <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                  {content || 'No letter written.'}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Read-only view. Your letter remains unchanged.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
