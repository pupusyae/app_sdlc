'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Shield, BookOpen, Anchor, Camera, Check } from 'lucide-react';
import { useCognitiveStore } from '@/stores/cognitiveStore';
import type { SeverityAlert } from '@/stores/cognitiveStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

const blocks = [
  { name: 'Business Objective', icon: <Anchor className="w-3 h-3" /> },
  { name: 'Operational Constraint', icon: <Shield className="w-3 h-3" /> },
  { name: 'Governance Concern', icon: <BookOpen className="w-3 h-3" /> },
];

export default function ChatWorkspace() {
  const activeBlock = useCognitiveStore((s) => s.activeBlock);
  const setActiveBlock = useCognitiveStore((s) => s.setActiveBlock);
  const messages = useCognitiveStore((s) => s.messages);
  const addMessage = useCognitiveStore((s) => s.addMessage);
  const severityAlerts = useCognitiveStore((s) => s.severityAlerts);
  const setSeverityAlerts = useCognitiveStore((s) => s.setSeverityAlerts);
  const setLoading = useCognitiveStore((s) => s.setLoading);
  const isLoading = useCognitiveStore((s) => s.isLoading);

  const [input, setInput] = useState('');
  const [snapshotCreated, setSnapshotCreated] = useState(false);

  const handleSnapshot = useCallback(async () => {
    const state = useCognitiveStore.getState();
    const snapshot = {
      activeBlock: state.activeBlock,
      messages: state.messages,
      severityAlerts: state.severityAlerts,
      epistemicMetrics: state.epistemicMetrics,
      pendingApprovals: state.pendingApprovals,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/v1/governance/checkpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: '00000000-0000-0000-0000-000000000001',
          label: `Snapshot: ${new Date().toLocaleString()}`,
          snapshot,
        }),
      });
      if (res.ok) {
        setSnapshotCreated(true);
        setTimeout(() => setSnapshotCreated(false), 3000);
      }
    } catch {
      // silently fail
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'human' as const,
      block: activeBlock,
      content: input,
      semanticBlock: activeBlock,
    };

    addMessage(userMessage);
    const sentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/extract/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block: activeBlock,
          content: sentInput,
          stage: 'deep',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (res.status === 403) {
          addMessage({
            id: Date.now() + 1,
            sender: 'ai',
            block: 'Security Block',
            content: `Cognitive Firewall blocked input: ${errData?.reason || 'Security violation detected'}`,
            requiresApproval: false,
          });
          setSeverityAlerts([{
            id: Date.now(),
            type: 'Security Block',
            text: errData?.reason || 'Input blocked by Cognitive Firewall',
            level: 'Critical',
          }]);
          setLoading(false);
          return;
        }
      }

      const data = await res.json();
      const extraction = data.extraction || {};

      const aiResponse = `I have analyzed your input under [${activeBlock}]. ${data.requires_human_approval ? 'This requires human approval.' : ''} Governance analysis complete.`;

      addMessage({
        id: Date.now() + 1,
        sender: 'ai',
        block: 'Governance Validation',
        content: aiResponse,
        requiresApproval: data.requires_human_approval,
      });

      const newAlerts: SeverityAlert[] = [];
      let alertId = Date.now() + 2;

      (extraction.critical || []).forEach((c: { id: number; type: string; text: string }) => {
        newAlerts.push({ id: alertId++, type: c.type, text: c.text, level: 'Critical' });
      });
      (extraction.warnings || []).forEach((w: { id: number; type: string; text: string }) => {
        newAlerts.push({ id: alertId++, type: w.type, text: w.text, level: 'Warning' });
      });
      (extraction.suggestions || []).forEach((s: { id: number; type: string; text: string }) => {
        newAlerts.push({ id: alertId++, type: s.type, text: s.text, level: 'Suggestion' });
      });

      if (newAlerts.length > 0) {
        setSeverityAlerts(newAlerts);
      }
    } catch {
      addMessage({
        id: Date.now() + 1,
        sender: 'ai',
        block: 'System',
        content: 'Unable to reach Governance Engine. Please check your connection and try again.',
        requiresApproval: false,
      });
    } finally {
      setLoading(false);
    }
  }, [input, isLoading, activeBlock, addMessage, setSeverityAlerts, setLoading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950 text-gray-200">
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h1 className="font-semibold tracking-wide text-gray-100">SDLC Cognitive Workspace</h1>
        </div>
        <button
          onClick={handleSnapshot}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            snapshotCreated
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
          title="Create Snapshot — freeze current cognitive state"
        >
          {snapshotCreated ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Camera className="w-3.5 h-3.5" />
          )}
          {snapshotCreated ? 'Snapshot Created' : 'Create Snapshot'}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col max-w-3xl ${msg.sender === 'human' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                msg.sender === 'human' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-blue-900/60 text-blue-300'
              }`}>
                [{msg.semanticBlock || msg.block}]
              </span>
              <span className="text-xs text-gray-500">
                {msg.sender === 'human' ? 'Architect' : 'Constitution Engine'}
              </span>
              {msg.requiresApproval && (
                <span className="text-[10px] text-yellow-400 bg-yellow-900/40 px-1.5 py-0.5 rounded">Awaiting Approval</span>
              )}
            </div>
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.sender === 'human'
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-none'
                : 'bg-gray-800 border border-gray-700 text-gray-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-indigo-500 rounded-full"
            />
            Constitution Engine is analyzing...
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-3">
            {blocks.map((b) => (
              <button
                key={b.name}
                onClick={() => setActiveBlock(b.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                  activeBlock === b.name
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {b.icon}
                {b.name}
              </button>
            ))}
          </div>

          <div className="relative flex items-end bg-gray-900 border border-gray-700 focus-within:border-indigo-500/50 rounded-xl overflow-hidden transition-colors shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Define ${activeBlock}...`}
              className="w-full max-h-32 min-h-[56px] bg-transparent resize-none p-4 text-sm text-gray-200 focus:outline-none placeholder:text-gray-600"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 m-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Cognitive Security Scanner is active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
