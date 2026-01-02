"use client";

import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { getLists, saveList, deleteList, List, ListItem } from '@/lib/storage';
import { Plus, Trash2 } from 'lucide-react';

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    setLists(getLists());
  }, []);

  useEffect(() => {
    if (selectedListId && !lists.find(l => l.id === selectedListId)) {
      setSelectedListId(null);
    }
  }, [lists, selectedListId]);

  const selectedList = selectedListId ? lists.find(l => l.id === selectedListId) : null;

  const handleCreateList = (name: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: Date.now(),
    };
    saveList(newList);
    setLists([...lists, newList]);
    setSelectedListId(newList.id);
  };

  const handleAddItem = (text: string) => {
    if (!selectedList) return;
    const newItem: ListItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem],
    };
    saveList(updatedList);
    setLists(lists.map(l => l.id === selectedList.id ? updatedList : l));
  };

  const handleToggleItem = (itemId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    };
    saveList(updatedList);
    setLists(lists.map(l => l.id === selectedList.id ? updatedList : l));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId),
    };
    saveList(updatedList);
    setLists(lists.map(l => l.id === selectedList.id ? updatedList : l));
  };

  const handleDeleteList = (id: string) => {
    deleteList(id);
    setLists(lists.filter(l => l.id !== id));
    if (selectedListId === id) {
      setSelectedListId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Lists</h1>
          <p className="text-muted-foreground">Create simple lists for anything worth tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lists sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-150 font-medium ${
                    selectedListId === list.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  {list.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const name = prompt('List name:');
                if (name) handleCreateList(name);
              }}
              className="w-full mt-4 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New List
            </button>
          </div>

          {/* List items */}
          <div className="lg:col-span-3">
            {selectedList ? (
              <div className="bg-card border border-border rounded-xl p-8 card-subtle">
                <div className="flex items-center justify-between mb-7">
                  <h2 className="text-2xl font-semibold text-foreground">{selectedList.name}</h2>
                  <button
                    onClick={() => handleDeleteList(selectedList.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  {selectedList.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3.5 rounded-lg bg-background hover:bg-sidebar-accent transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.completed
                            ? 'item-completed'
                            : 'text-foreground'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <ListItemInput onAdd={handleAddItem} />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center card-subtle">
                <p className="text-muted-foreground">Select or create a list to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ListItemInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add item..."
        className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <Plus className="w-4 h-4" />
      </button>
    </form>
  );
}
