'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Download, X, Layers, FileText, Code2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface BlueprintFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

const fileIcons: Record<string, React.ReactNode> = {
  tsx: <Code2 className="w-3.5 h-3.5 text-blue-400" />,
  ts: <Code2 className="w-3.5 h-3.5 text-cyan-400" />,
  default: <FileText className="w-3.5 h-3.5 text-gray-400" />,
};

export default function BlueprintViewer({ adrId, onClose }: { adrId: string; onClose: () => void }) {
  const [files, setFiles] = useState<BlueprintFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchBlueprint = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/execution/blueprint/${adrId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.files) {
          setFiles(data.files);
          if (data.files.length > 0) setActiveFile(data.files[0].path);
        }
      }
    } catch {
      // keep empty
    }
    setLoading(false);
    setLoaded(true);
  };

  const downloadAll = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/execution/blueprint/${adrId}/download`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blueprint-${adrId.slice(0, 8)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // silently fail
    }
  };

  const activeContent = files.find((f) => f.path === activeFile);

  if (!loaded) {
    return (
      <div className="p-4 text-center">
        <button
          onClick={fetchBlueprint}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors mx-auto"
        >
          <Layers className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Blueprint'}
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No blueprint files generated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Blueprint
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadAll}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-3 overflow-x-auto">
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => setActiveFile(file.path)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] whitespace-nowrap transition-colors ${
              activeFile === file.path
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            {fileIcons[file.language] || fileIcons.default}
            {file.path.split('/').pop()}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-gray-700 bg-gray-950">
        {activeContent && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-b border-gray-700">
                <span className="text-[10px] text-gray-500">{activeContent.path}</span>
                <span className="text-[10px] text-gray-600">{activeContent.language}</span>
              </div>
              <pre className="flex-1 overflow-auto p-3 text-xs font-mono text-gray-300 leading-relaxed">
                <code>{activeContent.content}</code>
              </pre>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
