import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { getLogs, saveLog, deleteLog, LogEntry } from '@/lib/storage';
import { Plus, Trash2 } from 'lucide-react';

const LOG_TYPES = [
  { value: 'future', label: 'Future Log', description: 'High-level goals and plans' },
  { value: 'monthly', label: 'Monthly Log', description: 'Goals for a month' },
  { value: 'weekly', label: 'Weekly Log', description: 'Weekly plans and tasks' },
  { value: 'daily', label: 'Daily Log', description: 'Today\'s tasks and reflections' },
] as const;

type LogType = typeof LOG_TYPES[number]['value'];

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [logType, setLogType] = useState<LogType>('daily');

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const filteredLogs = logs.filter(l => l.type === logType);
  const selectedLog = selectedLogId ? logs.find(l => l.id === selectedLogId) : null;

  const handleCreateLog = () => {
    const title = prompt('Log title:');
    if (!title) return;

    let date = undefined;
    let month = undefined;
    let week = undefined;

    if (logType === 'daily') {
      date = new Date().toISOString().split('T')[0];
    } else if (logType === 'monthly') {
      const today = new Date();
      month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    } else if (logType === 'weekly') {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      week = weekStart.toISOString().split('T')[0];
    }

    const newLog: LogEntry = {
      id: Date.now().toString(),
      type: logType,
      title,
      content: '',
      date,
      month,
      week,
      createdAt: Date.now(),
    };

    saveLog(newLog);
    setLogs([...logs, newLog]);
    setSelectedLogId(newLog.id);
  };

  const handleUpdateLog = (updates: Partial<LogEntry>) => {
    if (!selectedLog) return;
    const updatedLog = { ...selectedLog, ...updates };
    saveLog(updatedLog);
    setLogs(logs.map(l => l.id === selectedLog.id ? updatedLog : l));
  };

  const handleDeleteLog = (id: string) => {
    deleteLog(id);
    setLogs(logs.filter(l => l.id !== id));
    if (selectedLogId === id) {
      setSelectedLogId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Logs</h1>
          <p className="text-muted-foreground">Write across different timeframes throughout your year</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Log type selector */}
          <div className="lg:col-span-1 space-y-3">
            {LOG_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setLogType(type.value as LogType);
                  setSelectedLogId(null);
                }}
                className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-150 ${
                  logType === type.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-sidebar-accent'
                }`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs opacity-70 mt-1">{type.description}</div>
              </button>
            ))}
          </div>

          {/* Logs list and editor */}
          <div className="lg:col-span-3">
            <div className="flex gap-6">
              {/* Logs list */}
              <div className="w-48 space-y-2">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLogId(log.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm truncate font-medium ${
                        selectedLogId === log.id
                          ? 'bg-sidebar-accent text-foreground'
                          : 'text-foreground hover:bg-sidebar-accent'
                      }`}
                    >
                      {log.title}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground p-3">No logs yet</p>
                )}
                <button
                  onClick={handleCreateLog}
                  className="w-full mt-4 px-3 py-2.5 rounded-lg border border-border text-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
              </div>

              {/* Log editor */}
              {selectedLog ? (
                <div className="flex-1 bg-card border border-border rounded-xl p-8 card-subtle">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <input
                        type="text"
                        value={selectedLog.title}
                        onChange={(e) => handleUpdateLog({ title: e.target.value })}
                        className="text-2xl font-semibold bg-transparent text-foreground outline-none"
                      />
                      {selectedLog.date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(selectedLog.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteLog(selectedLog.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={selectedLog.content}
                    onChange={(e) => handleUpdateLog({ content: e.target.value })}
                    placeholder="Write your thoughts..."
                    className="w-full h-96 p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
              ) : (
                <div className="flex-1 bg-card border border-border rounded-xl p-8 flex items-center justify-center card-subtle">
                  <p className="text-muted-foreground text-center">
                    {filteredLogs.length === 0
                      ? 'Create your first log to get started'
                      : 'Select a log to edit'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
