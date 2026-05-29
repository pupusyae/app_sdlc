'use client';
import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Trash2, LogOut, Settings } from 'lucide-react';
import { useCognitiveStore } from '@/stores/cognitiveStore';
import SettingsModal from './SettingsModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface SessionGroup {
  label: string;
  sessions: SessionInfo[];
}

interface SessionInfo {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

function groupSessionsByDate(sessions: SessionInfo[]): SessionGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: SessionGroup[] = [
    { label: 'Today', sessions: [] },
    { label: 'Yesterday', sessions: [] },
    { label: 'Previous 7 Days', sessions: [] },
    { label: 'Older', sessions: [] },
  ];

  sessions.forEach((s) => {
    const d = new Date(s.created_at);
    if (d >= today) groups[0].sessions.push(s);
    else if (d >= yesterday) groups[1].sessions.push(s);
    else if (d >= sevenDaysAgo) groups[2].sessions.push(s);
    else groups[3].sessions.push(s);
  });

  return groups.filter((g) => g.sessions.length > 0);
}

export default function SessionSidebar() {
  const token = useCognitiveStore((s) => s.token);
  const user = useCognitiveStore((s) => s.user);
  const sessions = useCognitiveStore((s) => s.sessions);
  const currentSessionId = useCognitiveStore((s) => s.currentSessionId);
  const setSessions = useCognitiveStore((s) => s.setSessions);
  const setCurrentSessionId = useCognitiveStore((s) => s.setCurrentSessionId);
  const clearState = useCognitiveStore((s) => s.clearState);
  const logout = useCognitiveStore((s) => s.logout);

  const fetchSessions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/sessions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch {
      // keep
    }
  }, [token, setSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: `New Session ${new Date().toLocaleTimeString()}` }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions([data, ...sessions]);
        setCurrentSessionId(data.id);
        clearState();
      }
    } catch {
      // silently fail
    }
  };

  const deleteSession = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/v1/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessions.filter((s) => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId('');
        clearState();
      }
    } catch {
      // silently fail
    }
  };

  const selectSession = (id: string) => {
    setCurrentSessionId(id);
    clearState();
  };

  const grouped = groupSessionsByDate(sessions);

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-950 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-indigo-400">
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-300 truncate">{user?.email || 'User'}</p>
          </div>
        </div>

        <button
          onClick={createSession}
          className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Session
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2">
        {grouped.length === 0 ? (
          <p className="text-xs text-gray-600 text-center mt-8">No sessions yet</p>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
              {group.sessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ backgroundColor: 'rgba(99,102,241,0.1)' }}
                  onClick={() => selectSession(session.id)}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-indigo-600/20 border border-indigo-500/30'
                      : 'border border-transparent'
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${
                    currentSessionId === session.id ? 'text-indigo-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-xs truncate flex-1 ${
                    currentSessionId === session.id ? 'text-gray-200' : 'text-gray-400'
                  }`}>
                    {session.title}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800 space-y-1">
        <SettingsModal />
        <a
          href="/login"
          onClick={(e) => { e.preventDefault(); logout(); window.location.href = '/login'; }}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </a>
      </div>
    </div>
  );
}
