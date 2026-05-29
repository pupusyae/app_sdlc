'use client';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

interface SuggestionAlertProps {
  id: number;
  type: string;
  text: string;
  expanded?: boolean;
  approved?: boolean;
  onToggle: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function SuggestionAlert({
  id,
  type,
  text,
  expanded,
  approved,
  onToggle,
  onApprove,
  onReject,
}: SuggestionAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
        approved !== undefined
          ? 'bg-green-950/20 border-green-800/50'
          : 'bg-blue-950/20 border-blue-800/50 hover:border-blue-700'
      }`}
      onClick={() => onToggle(id)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
          approved !== undefined
            ? 'text-green-300 bg-green-900/60'
            : 'text-blue-300 bg-blue-900/60'
        }`}>
          {type}
        </span>
        <div className="flex items-center gap-1">
          {approved === undefined && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(id); }}
                className="text-gray-500 hover:text-green-400 transition-colors"
                title="Approve & Freeze"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <span className={approved !== undefined ? 'text-green-400' : 'text-blue-400'}>
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed">
        {approved !== undefined && <span className="text-green-400 mr-1">[APPROVED]</span>}
        {text}
      </p>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 pt-2 border-t border-gray-700/30"
        >
          <p className="text-[10px] text-blue-400 leading-relaxed">
            SUGGESTION: Advisory recommendation per Governance Rules (Advisory Governance). Optional best-practice enhancement.
          </p>
          {approved === undefined && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(id); }}
                className="text-[10px] px-2 py-1 bg-green-600/30 text-green-300 rounded hover:bg-green-600/50 transition-colors"
              >
                Approve & Freeze
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(id); }}
                className="text-[10px] px-2 py-1 bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors"
              >
                Reject & Re-reason
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
