'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check, Bug } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

export default function TicketExporter({ adrId, adrTitle }: { adrId: string; adrTitle: string }) {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<{ title: string; body: string; labels: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const generateTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/execution/ticket/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adr_id: adrId, platform: 'github' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(`# ${ticket.title}\n\n${ticket.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGitHub = () => {
    if (!ticket) return;
    const title = encodeURIComponent(ticket.title);
    const body = encodeURIComponent(ticket.body);
    const labels = (ticket.labels || []).join(',');
    window.open(
      `https://github.com/issues/new?title=${title}&body=${body}&labels=${labels}`,
      '_blank',
    );
  };

  return (
    <div className="space-y-3">
      {!ticket ? (
        <button
          onClick={generateTicket}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-gray-200 rounded-lg text-sm font-medium transition-colors border border-gray-700"
        >
          <Bug className="w-4 h-4" />
          {loading ? 'Generating...' : 'Export to GitHub Issue'}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-200 mb-2">{ticket.title}</h4>
            <div className="flex gap-1 mb-2">
              {(ticket.labels || []).map((label) => (
                <span key={label} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                  {label}
                </span>
              ))}
            </div>
            <pre className="text-[10px] text-gray-400 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {ticket.body.slice(0, 600)}
              {ticket.body.length > 600 && '...'}
            </pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openInGitHub}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in GitHub
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
