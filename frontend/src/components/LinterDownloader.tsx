'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, FileJson, FileCode2, AlertTriangle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

export default function LinterDownloader() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadFile = async (endpoint: string, filename: string) => {
    setDownloading(filename);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
    setDownloading(null);
  };

  const exports = [
    {
      label: 'ESLint Rules',
      description: 'Cognitive governance plugin for ESLint',
      endpoint: '/api/v1/execution/linter/eslint/download',
      filename: 'cognitive-governance-eslint.json',
      icon: <FileCode2 className="w-4 h-4 text-yellow-400" />,
    },
    {
      label: 'Ruff Rules (TOML)',
      description: 'Python lint rules for Ruff',
      endpoint: '/api/v1/execution/linter/ruff/download',
      filename: 'cognitive-governance-ruff.toml',
      icon: <FileCode2 className="w-4 h-4 text-purple-400" />,
    },
    {
      label: 'Forbidden Actions',
      description: 'List of forbidden AI actions',
      endpoint: '/api/v1/execution/linter/forbidden-actions/download',
      filename: 'cognitive-forbidden-actions.json',
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          CI/CD Linter Rules
        </h3>
      </div>

      {exports.map((item) => (
        <motion.button
          key={item.filename}
          whileHover={{ scale: 1.01 }}
          onClick={() => downloadFile(item.endpoint, item.filename)}
          disabled={downloading !== null}
          className="w-full flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <div className="flex-shrink-0">{item.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200">{item.label}</p>
            <p className="text-[10px] text-gray-500">{item.description}</p>
          </div>
          <div className="flex-shrink-0">
            {downloading === item.filename ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
              />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </motion.button>
      ))}

      <p className="text-[10px] text-gray-600 text-center mt-2">
        Integrate these rules into your CI/CD pipeline to enforce cognitive governance at the code level.
      </p>
    </div>
  );
}
