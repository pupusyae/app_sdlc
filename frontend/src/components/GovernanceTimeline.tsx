'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Circle, CheckCircle2, Archive, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  status: string;
  type: string;
  approved_by: string | null;
  predecessor_id: string | null;
  deprecated_at: string | null;
}

export default function GovernanceTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/governance/timeline`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch {
        // Keep empty
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'deprecated':
        return <Archive className="w-4 h-4 text-gray-500" />;
      case 'draft':
        return <Circle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'border-green-500/50 bg-green-500/10';
      case 'deprecated': return 'border-gray-600/50 bg-gray-800/30';
      case 'draft': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-700/50 bg-gray-800/30';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
          <History className="w-4 h-4 text-indigo-400" />
          Governance Timeline
        </h3>
        <p className="text-xs text-gray-500 mt-1">Chronological history of Architecture Decision Records</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-indigo-500 rounded-full"
          />
        </div>
      ) : events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-600 text-center">
            No governance events recorded yet.<br />
            Start a conversation to create ADRs.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-800" />

            <AnimatePresence>
              {events.map((event, idx) => {
                const date = new Date(event.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative pl-8 pb-5 last:pb-2 ${getStatusColor(event.status)} rounded-lg p-3 mb-2 border`}
                  >
                    <div className="absolute left-[5px] top-3">
                      {getStatusIcon(event.status)}
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 leading-snug truncate">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            event.status.toLowerCase() === 'approved'
                              ? 'bg-green-900/60 text-green-300'
                              : event.status.toLowerCase() === 'deprecated'
                              ? 'bg-gray-700/60 text-gray-400'
                              : 'bg-yellow-900/60 text-yellow-300'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-[10px] text-gray-500">{formattedDate}</span>
                        </div>
                        {event.approved_by && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            Approved by: {event.approved_by}
                          </p>
                        )}
                        {event.deprecated_at && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Deprecated: {new Date(event.deprecated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-1" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
