'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

interface WarningAlertProps {
  id: number;
  type: string;
  text: string;
  expanded?: boolean;
  onToggle: (id: number) => void;
}

export default function WarningAlert({ id, type, text, expanded, onToggle }: WarningAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-3 bg-yellow-950/30 border border-yellow-800/50 rounded-lg hover:border-yellow-700 transition-colors cursor-pointer"
      onClick={() => onToggle(id)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-medium text-yellow-300 bg-yellow-900/60 px-1.5 py-0.5 rounded">
          {type}
        </span>
        <span className="text-yellow-400">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </div>
      <p className="text-xs text-yellow-200 leading-relaxed">{text}</p>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 pt-2 border-t border-yellow-800/30"
        >
          <p className="text-[10px] text-yellow-400 leading-relaxed">
            WARNING: Review required per Governance Rules (Warning Governance). Action can proceed but must be evaluated before merge.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
