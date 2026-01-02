"use client";

import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { getWellnessEntries, saveWellnessEntry } from '@/lib/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WellnessEntry {
  date: string;
  mood?: number;
  stress?: number;
  sleep?: number;
}

export default function WellnessPage() {
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setEntries(getWellnessEntries());
  }, []);

  const today = new Date();
  today.setDate(today.getDate() - 30);
  const thirtyDaysAgo = today.toISOString().split('T')[0];
  const chartData = entries
    .filter(e => e.date >= thirtyDaysAgo)
    .sort((a, b) => a.date.localeCompare(b.date));

  const selectedEntry = entries.find(e => e.date === selectedDate) || { date: selectedDate };

  const handleUpdate = (key: keyof WellnessEntry, value: number | undefined) => {
    const updated = {
      ...selectedEntry,
      [key]: value,
    } as WellnessEntry;
    saveWellnessEntry(updated);
    setEntries(entries.map(e => e.date === selectedDate ? updated : e).concat(
      entries.every(e => e.date !== selectedDate) ? [updated] : []
    ));
  };

  const getScaleLabel = (key: string, value?: number) => {
    if (!value) return '—';
    const scales = {
      mood: ['Terrible', 'Bad', 'Neutral', 'Good', 'Excellent'],
      stress: ['Minimal', 'Light', 'Moderate', 'High', 'Severe'],
      sleep: ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'],
    } as const;
    return scales[key as keyof typeof scales]?.[value - 1] || '—';
  };

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Wellness Tracker</h1>
          <p className="text-muted-foreground">Track mood, stress, and sleep to see patterns throughout your year</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-8 space-y-7 card-subtle">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <WellnessInput
                label="Mood"
                description="How did you feel?"
                value={selectedEntry.mood}
                onChange={(value) => handleUpdate('mood', value)}
              />

              <WellnessInput
                label="Stress"
                description="Your stress level"
                value={selectedEntry.stress}
                onChange={(value) => handleUpdate('stress', value)}
              />

              <WellnessInput
                label="Sleep"
                description="Quality of your sleep"
                value={selectedEntry.sleep}
                onChange={(value) => handleUpdate('sleep', value)}
              />
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-8 card-subtle">
            <h2 className="text-lg font-semibold text-foreground mb-6">Last 30 Days</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value + 'T00:00:00');
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis
                    domain={[1, 5]}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.375rem',
                      color: 'hsl(var(--foreground))',
                    }}
                    formatter={(value) => value ? Math.round(value as number * 10) / 10 : '—'}
                  />
                  <Legend
                    wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                    iconType="line"
                  />
                  {selectedEntry.mood !== undefined && chartData.some(d => d.mood !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {selectedEntry.stress !== undefined && chartData.some(d => d.stress !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {selectedEntry.sleep !== undefined && chartData.some(d => d.sleep !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <p className="text-muted-foreground">Add entries to see your wellness patterns</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['mood', 'stress', 'sleep'] as const).map((key) => {
              const values = chartData
                .map(d => d[key])
                .filter((v): v is number => v !== undefined);
              if (values.length === 0) return null;

              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              const labels = {
                mood: ['Terrible', 'Bad', 'Neutral', 'Good', 'Excellent'],
                stress: ['Minimal', 'Light', 'Moderate', 'High', 'Severe'],
                sleep: ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'],
              };

              return (
                <div key={key} className="bg-card border border-border rounded-xl p-5 card-subtle">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {key} Average
                  </div>
                  <div className="text-3xl font-semibold text-foreground">
                    {avg.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {labels[key][Math.round(avg) - 1]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

function WellnessInput({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value?: number;
  onChange: (value?: number) => void;
}) {
  const options = [
    { emoji: '😢', label: 'Terrible', value: 1 },
    { emoji: '😕', label: 'Bad', value: 2 },
    { emoji: '😐', label: 'Neutral', value: 3 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😄', label: 'Excellent', value: 5 },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(value === option.value ? undefined : option.value)}
            className={`flex-1 py-3 rounded-lg transition-all duration-150 text-xl font-medium ${
              value === option.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border hover:bg-sidebar-accent/50'
            }`}
            title={option.label}
          >
            {option.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
