'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';

interface GovernanceApproval {
  id: number;
  type: string;
  text: string;
  approved: boolean;
}

interface ApprovalModalProps {
  isOpen: boolean;
  items: GovernanceApproval[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onClose: () => void;
}

export default function ApprovalModal({ isOpen, items, onApprove, onReject, onClose }: ApprovalModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Human Approval Required</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            The AI has proposed the following governance items. Per Constitutional AI Principle III, these require explicit human authorization before freezing.
          </p>

          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <span className="text-[10px] font-medium text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded mb-1 inline-block">
                  {item.type}
                </span>
                <p className="text-sm text-gray-200 mt-1">{item.text}</p>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-gray-500 text-center">No pending approvals.</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => items.forEach((item) => onApprove(item.id))}
              disabled={items.length === 0}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Approve All & Freeze
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              Review Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
