'use client';
import { motion } from 'framer-motion';
import { AlertOctagon, ChevronDown, ChevronRight } from 'lucide-react';

interface CriticalAlertProps {
  id: number;
  type: string;
  text: string;
  expanded?: boolean;
  onToggle: (id: number) => void;
}

export default function CriticalAlert({ id, type, text, expanded, onToggle }: CriticalAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg hover:border-red-700 transition-colors cursor-pointer"
      onClick={() => onToggle(id)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-medium text-red-300 bg-red-900/60 px-1.5 py-0.5 rounded">
          {type}
        </span>
        <span className="text-red-400">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </div>
      <p className="text-xs text-red-200 leading-relaxed">{text}</p>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 pt-2 border-t border-red-800/30"
        >
          <p className="text-[10px] text-red-400 leading-relaxed">
            CRITICAL: This item requires immediate human intervention. The system is blocked until this is resolved per Governance Rules (Blocking Governance).
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
