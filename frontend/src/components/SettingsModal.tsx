'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Key, Shield } from 'lucide-react';
import { useCognitiveStore } from '@/stores/cognitiveStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useCognitiveStore((s) => s.token);

  const handleSave = async () => {
    if (!token || !apiKey.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/me/api-key`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => { setSaved(false); setIsOpen(false); }, 1500);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors w-full"
      >
        <Settings className="w-3.5 h-3.5" />
        API Settings
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">API Key Settings</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Your API key is encrypted and stored securely on the server. It is never exposed to the browser.
              </p>

              <div className="space-y-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... (OpenAI / Anthropic API Key)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                />

                <button
                  onClick={handleSave}
                  disabled={loading || !apiKey.trim()}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white'
                  }`}
                >
                  {saved ? 'Saved & Encrypted' : loading ? 'Saving...' : 'Save API Key'}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-600">
                <Shield className="w-3 h-3" />
                Encrypted with Fernet (AES-128). Stored in PostgreSQL.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
