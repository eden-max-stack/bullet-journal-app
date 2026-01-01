import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Tracker {
  id: string;
  name: string;
  type: 'table' | 'calendar';
  metrics: string[];
  data: Record<string, Record<string, number | string>>;
  createdAt: number;
}

const STORAGE_KEY = 'journal_trackers';

function getTrackers(): Tracker[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTrackers(trackers: Tracker[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackers));
}

export default function TrackersPage() {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
  const [showNewTracker, setShowNewTracker] = useState(false);

  useEffect(() => {
    setTrackers(getTrackers());
  }, []);

  const selectedTracker = selectedTrackerId ? trackers.find(t => t.id === selectedTrackerId) : null;

  const handleCreateTracker = (name: string, type: 'table' | 'calendar', metrics: string[]) => {
    const newTracker: Tracker = {
      id: Date.now().toString(),
      name,
      type,
      metrics,
      data: {},
      createdAt: Date.now(),
    };
    const updated = [...trackers, newTracker];
    setTrackers(updated);
    saveTrackers(updated);
    setSelectedTrackerId(newTracker.id);
    setShowNewTracker(false);
  };

  const handleUpdateData = (date: string, metric: string, value: string | number) => {
    if (!selectedTracker) return;
    const updated = trackers.map(t => {
      if (t.id === selectedTracker.id) {
        return {
          ...t,
          data: {
            ...t.data,
            [date]: {
              ...(t.data[date] || {}),
              [metric]: value,
            },
          },
        };
      }
      return t;
    });
    setTrackers(updated);
    saveTrackers(updated);
  };

  const handleDeleteTracker = (id: string) => {
    const updated = trackers.filter(t => t.id !== id);
    setTrackers(updated);
    saveTrackers(updated);
    if (selectedTrackerId === id) {
      setSelectedTrackerId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Trackers</h1>
          <p className="text-muted-foreground">Build custom trackers for habits, exercise, gratitude, and more</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trackers list */}
          <div className="lg:col-span-1 space-y-2">
            {trackers.map((tracker) => (
              <button
                key={tracker.id}
                onClick={() => setSelectedTrackerId(tracker.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-150 ${
                  selectedTrackerId === tracker.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-sidebar-accent'
                }`}
              >
                <div className="font-medium text-sm">{tracker.name}</div>
                <div className="text-xs opacity-70 mt-0.5">{tracker.type === 'table' ? 'Table' : 'Calendar'}</div>
              </button>
            ))}
            <button
              onClick={() => setShowNewTracker(true)}
              className="w-full mt-4 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Tracker
            </button>
          </div>

          {/* Tracker display/editor */}
          <div className="lg:col-span-3">
            {showNewTracker ? (
              <NewTrackerForm onSave={handleCreateTracker} onCancel={() => setShowNewTracker(false)} />
            ) : selectedTracker ? (
              selectedTracker.type === 'table' ? (
                <TableTracker
                  tracker={selectedTracker}
                  onUpdateData={handleUpdateData}
                  onDelete={handleDeleteTracker}
                />
              ) : (
                <CalendarTracker
                  tracker={selectedTracker}
                  onUpdateData={handleUpdateData}
                  onDelete={handleDeleteTracker}
                />
              )
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center card-subtle">
                <p className="text-muted-foreground">Select or create a tracker to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function NewTrackerForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string, type: 'table' | 'calendar', metrics: string[]) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'table' | 'calendar'>('table');
  const [metrics, setMetrics] = useState<string[]>(['']);

  const handleAddMetric = () => {
    setMetrics([...metrics, '']);
  };

  const handleUpdateMetric = (index: number, value: string) => {
    const updated = [...metrics];
    updated[index] = value;
    setMetrics(updated);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (name.trim() && metrics.some(m => m.trim())) {
      onSave(name.trim(), type, metrics.filter(m => m.trim()));
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-7 card-subtle">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Tracker Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Gym Sessions"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Type</label>
        <div className="space-y-2.5">
          {[
            { value: 'table', label: 'Table (Excel-like rows and columns)' },
            { value: 'calendar', label: 'Calendar (Month view with dates)' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={(e) => setType(e.target.value as 'table' | 'calendar')}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Metrics / Columns
        </label>
        <div className="space-y-2.5">
          {metrics.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={metric}
                onChange={(e) => handleUpdateMetric(index, e.target.value)}
                placeholder="e.g., Completed, Duration"
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {metrics.length > 1 && (
                <button
                  onClick={() => handleRemoveMetric(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddMetric}
            className="text-sm text-primary font-medium hover:opacity-80 transition-opacity"
          >
            + Add metric
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Create Tracker
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border border-border text-foreground rounded-lg hover:bg-sidebar-accent transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TableTracker({
  tracker,
  onUpdateData,
  onDelete,
}: {
  tracker: Tracker;
  onUpdateData: (date: string, metric: string, value: string | number) => void;
  onDelete: (id: string) => void;
}) {
  const today = new Date();
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(today) }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6 card-subtle">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{tracker.name}</h2>
        <button
          onClick={() => onDelete(tracker.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-semibold text-foreground">Date</th>
              {tracker.metrics.map((metric) => (
                <th key={metric} className="text-left py-3 px-3 font-semibold text-foreground">
                  {metric}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((date) => (
              <tr key={date} className="border-b border-border hover:bg-sidebar-accent/50 transition-colors">
                <td className="py-3.5 px-3 text-muted-foreground text-xs font-medium">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </td>
                {tracker.metrics.map((metric) => (
                  <td key={`${date}-${metric}`} className="py-3.5 px-3">
                    <input
                      type="text"
                      value={tracker.data[date]?.[metric] ?? ''}
                      onChange={(e) => onUpdateData(date, metric, e.target.value)}
                      placeholder="—"
                      className="w-16 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarTracker({
  tracker,
  onUpdateData,
  onDelete,
}: {
  tracker: Tracker;
  onUpdateData: (date: string, metric: string, value: string | number) => void;
  onDelete: (id: string) => void;
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDay = getFirstDayOfMonth(new Date(year, month));
  const calendarDays = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6 card-subtle">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{tracker.name}</h2>
        <button
          onClick={() => onDelete(tracker.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="text-sm font-semibold text-muted-foreground mb-2">
        {new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const date = new Date(year, month, day).toISOString().split('T')[0];
          const hasData = tracker.data[date];
          const isToday = date === today.toISOString().split('T')[0];

          return (
            <div
              key={date}
              className={`aspect-square p-2 rounded-lg border transition-all duration-150 flex flex-col items-center justify-center ${
                hasData
                  ? 'border-primary/50 bg-sidebar-accent shadow-sm'
                  : isToday
                  ? 'border-primary/30 bg-sidebar-accent/30'
                  : 'border-border hover:bg-sidebar-accent/20'
              }`}
            >
              <div className="text-xs font-semibold text-foreground">{day}</div>
              {tracker.metrics.length === 1 && (
                <input
                  type="text"
                  value={tracker.data[date]?.[tracker.metrics[0]] ?? ''}
                  onChange={(e) => onUpdateData(date, tracker.metrics[0], e.target.value)}
                  maxLength={3}
                  placeholder="—"
                  className="w-full text-xs text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
