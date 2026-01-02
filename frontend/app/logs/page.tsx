"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Clock, ArrowRight, X } from 'lucide-react';
import { Layout } from '@/components/Layout'; 
interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD or 'future'
  createdAt: number;
}

type ViewMode = 'month' | 'week' | 'year' | 'future';

export default function CalendarLogsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [yearViewOffset, setYearViewOffset] = useState(0);

  const handleAddTask = (text: string, date: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      date,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handlePostponeTask = (taskId: string, newDate: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, date: newDate } : t));
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(t => t.date === date);
  };

  const getFutureTasks = () => {
    return tasks.filter(t => t.date === 'future');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Logs</h1>
            <p className="text-muted-foreground">Organize your tasks across time</p>
          </div>

          {/* View Mode Toggles */}
          <div className="flex gap-2 bg-card border border-border rounded-lg p-1">
            {(['month', 'week', 'year', 'future'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  setSelectedDate(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-sidebar-accent'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Calendar Views */}
          <div className={`${selectedDate && viewMode !== 'future' ? 'flex-1' : 'w-full'}`}>
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                tasks={tasks}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                tasks={tasks}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
            {viewMode === 'year' && (
              <YearView
                currentDate={currentDate}
                tasks={tasks}
                yearViewOffset={yearViewOffset}
                setYearViewOffset={setYearViewOffset}
              />
            )}
            {viewMode === 'future' && (
              <FutureView
                tasks={getFutureTasks()}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onPostpone={handlePostponeTask}
                onAdd={handleAddTask}
              />
            )}
          </div>

          {/* Day Sidebar */}
          {selectedDate && viewMode !== 'future' && (
            <DaySidebar
              date={selectedDate}
              tasks={getTasksForDate(selectedDate)}
              onClose={() => setSelectedDate(null)}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onPostponeTask={handlePostponeTask}
            />
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}

// Month View Component
function MonthView({ currentDate, setCurrentDate, tasks, selectedDate, setSelectedDate }: any) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const weeks = [];
  let currentWeek = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    currentWeek.push(new Date(current));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    current.setDate(current.getDate() + 1);
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.map((week, weekIdx) => (
          week.map((date, dayIdx) => {
            const dateKey = formatDateKey(date);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = dateKey === formatDateKey(new Date());
            const isSelected = dateKey === selectedDate;
            const dayTasks = tasks.filter((t: Task) => t.date === dateKey);

            return (
              <button
                key={`${weekIdx}-${dayIdx}`}
                onClick={() => setSelectedDate(dateKey)}
                className={`aspect-square p-2 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : isToday
                    ? 'bg-sidebar-accent border-2 border-primary text-foreground'
                    : isCurrentMonth
                    ? 'hover:bg-sidebar-accent text-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-medium">{date.getDate()}</span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((task: Task) => (
                        <div
                          key={task.id}
                          className={`w-1 h-1 rounded-full ${
                            task.completed ? 'bg-muted-foreground' : isSelected ? 'bg-primary-foreground' : 'bg-primary'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({ currentDate, setCurrentDate, tasks, selectedDate, setSelectedDate }: any) {
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const sunday = new Date(date);
    sunday.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Week Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={goToPrevWeek} className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={goToNextWeek} className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          const isToday = dateKey === formatDateKey(new Date());
          const isSelected = dateKey === selectedDate;
          const dayTasks = tasks.filter((t: Task) => t.date === dateKey);

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className={`p-4 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : isToday
                  ? 'border-primary bg-sidebar-accent'
                  : 'border-border hover:bg-sidebar-accent'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-xs font-medium opacity-70">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-2xl font-semibold mt-1">{date.getDate()}</div>
              </div>
              
              <div className="space-y-1 text-left">
                {dayTasks.slice(0, 3).map((task: Task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1.5 rounded truncate ${
                      isSelected
                        ? 'bg-primary-foreground/20'
                        : 'bg-background'
                    }`}
                  >
                    <span className={task.completed ? 'line-through opacity-60' : ''}>
                      {task.text}
                    </span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs opacity-60 px-1.5">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Year View Component
function YearView({ currentDate, tasks, yearViewOffset, setYearViewOffset }: any) {
  const year = currentDate.getFullYear();
  const startMonth = yearViewOffset * 6;
  const months = Array.from({ length: 6 }, (_, i) => startMonth + i).filter(m => m < 12);

  const goToPrevSet = () => {
    if (yearViewOffset > 0) setYearViewOffset(yearViewOffset - 1);
  };

  const goToNextSet = () => {
    if (yearViewOffset < 1) setYearViewOffset(yearViewOffset + 1);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">{year}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevSet}
            disabled={yearViewOffset === 0}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={goToNextSet}
            disabled={yearViewOffset === 1}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {months.map((monthIdx) => (
          <MonthMiniCalendar key={monthIdx} year={year} month={monthIdx} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}

function MonthMiniCalendar({ year, month, tasks }: any) {
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);
  for (let i = 0; i < 35; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const monthTasks = tasks.filter((t: Task) => {
    if (t.date === 'future') return false;
    const taskDate = new Date(t.date);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  });

  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {new Date(year, month).toLocaleDateString('en-US', { month: 'long' })}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground">
            {d}
          </div>
        ))}
        {days.map((date, i) => {
          const dateKey = date.toISOString().split('T')[0];
          const isCurrentMonth = date.getMonth() === month;
          const hasTasks = tasks.some((t: Task) => t.date === dateKey);

          return (
            <div
              key={i}
              className={`text-center text-xs py-1 ${
                !isCurrentMonth ? 'text-muted-foreground/40' : 'text-foreground'
              }`}
            >
              <div className="relative">
                {date.getDate()}
                {hasTasks && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {monthTasks.length > 0 ? (
          monthTasks.map((task: Task) => (
            <div key={task.id} className="text-xs p-1.5 bg-background rounded truncate">
              <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                {new Date(task.date).getDate()}: {task.text}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No tasks</p>
        )}
      </div>
    </div>
  );
}

// Future View Component
function FutureView({ tasks, onToggle, onDelete, onPostpone, onAdd }: any) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAdd = () => {
    if (newTaskText.trim()) {
      onAdd(newTaskText.trim(), 'future');
      setNewTaskText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Future Log</h2>
      <p className="text-sm text-muted-foreground mb-6">Tasks without a specific date</p>

      <div className="space-y-2 mb-6">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-sidebar-accent transition-colors group"
          >
            <button
              onClick={() => onToggle(task.id)}
              className="flex-shrink-0"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.completed ? 'border-primary bg-primary' : 'border-muted-foreground'
              }`}>
                {task.completed && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.text}
            </span>
            <button
              onClick={() => {
                const date = prompt('Enter date (YYYY-MM-DD):');
                if (date) onPostpone(task.id, date);
              }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-all"
            >
              <Clock className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add task to future log..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Day Sidebar Component
function DaySidebar({ date, tasks, onClose, onAddTask, onToggleTask, onDeleteTask, onPostponeTask }: any) {
  const [newTaskText, setNewTaskText] = useState('');

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleAdd = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), date);
      setNewTaskText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="w-96 bg-card border border-border rounded-xl p-6 flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Daily Tasks</h3>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task: Task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-background group"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="flex-shrink-0 mt-0.5"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {task.completed && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
              <span className={`flex-1 text-sm leading-relaxed ${
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.text}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    const newDate = prompt('Postpone to date (YYYY-MM-DD) or type "future":');
                    if (newDate) onPostponeTask(task.id, newDate);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                  title="Postpone"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No tasks for this day</p>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a task..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}