export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface List {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: number;
}

const LISTS_STORAGE_KEY = 'journal_lists';
const TRACKERS_STORAGE_KEY = 'journal_trackers';
const WELLNESS_STORAGE_KEY = 'journal_wellness';
const LOGS_STORAGE_KEY = 'journal_logs';
const LETTER_STORAGE_KEY = 'journal_letter';

// Lists Storage
export function getLists(): List[] {
  try {
    const data = localStorage.getItem(LISTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveList(list: List): void {
  const lists = getLists();
  const index = lists.findIndex(l => l.id === list.id);
  if (index >= 0) {
    lists[index] = list;
  } else {
    lists.push(list);
  }
  localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
}

export function deleteList(id: string): void {
  const lists = getLists().filter(l => l.id !== id);
  localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
}

// Wellness Storage
export interface WellnessEntry {
  date: string;
  mood?: number;
  stress?: number;
  sleep?: number;
}

export function getWellnessEntries(): WellnessEntry[] {
  try {
    const data = localStorage.getItem(WELLNESS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWellnessEntry(entry: WellnessEntry): void {
  const entries = getWellnessEntries();
  const index = entries.findIndex(e => e.date === entry.date);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(WELLNESS_STORAGE_KEY, JSON.stringify(entries));
}

// Logs Storage
export interface LogEntry {
  id: string;
  type: 'future' | 'monthly' | 'weekly' | 'daily';
  title: string;
  content: string;
  date?: string;
  month?: string;
  week?: string;
  createdAt: number;
  domain?: string;
}

export function getLogs(): LogEntry[] {
  try {
    const data = localStorage.getItem(LOGS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLog(log: LogEntry): void {
  const logs = getLogs();
  const index = logs.findIndex(l => l.id === log.id);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}

export function deleteLog(id: string): void {
  const logs = getLogs().filter(l => l.id !== id);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}

// Letter Storage
export function getLetter(): string {
  try {
    const data = localStorage.getItem(LETTER_STORAGE_KEY);
    return data ? JSON.parse(data).content : '';
  } catch {
    return '';
  }
}

export function saveLetter(content: string): void {
  localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify({ content, updatedAt: Date.now() }));
}

export function isLetterUnlocked(): boolean {
  const today = new Date();
  return today.getMonth() === 11 && today.getDate() === 31;
}
