'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, Activity } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface FatigueState {
  level: number;
  totalWarnings: number;
  suppressionActive: boolean;
}

export default function CognitiveFatigueIndicator({ sessionId = 'default' }: { sessionId?: string }) {
  const [fatigue, setFatigue] = useState<FatigueState>({ level: 0, totalWarnings: 0, suppressionActive: false });
  const [visible, setVisible] = useState(false);

  const fetchFatigue = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/telemetry/fatigue/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setFatigue({
          level: data.fatigue_level,
          totalWarnings: data.total_warnings,
          suppressionActive: data.suppression_active,
        });
        setVisible(data.fatigue_level > 0);
      }
    } catch {
      // keep defaults
    }
  };

  useEffect(() => {
    fetchFatigue();
    const interval = setInterval(fetchFatigue, 15000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const getColor = () => {
    if (fatigue.level >= 3) return 'bg-red-500';
    if (fatigue.level >= 2) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getTextColor = () => {
    if (fatigue.level >= 3) return 'text-red-400';
    if (fatigue.level >= 2) return 'text-orange-400';
    return 'text-yellow-400';
  };

  const getLabel = () => {
    if (fatigue.level >= 3) return 'High Fatigue';
    if (fatigue.level >= 2) return 'Moderate Fatigue';
    return 'Elevated Fatigue';
  };

  return (
    <AnimatePresence>
      {fatigue.level > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`rounded-lg border p-3 mb-4 ${
            fatigue.level >= 3
              ? 'bg-red-950/30 border-red-800/50'
              : fatigue.level >= 2
              ? 'bg-orange-950/30 border-orange-800/50'
              : 'bg-yellow-950/20 border-yellow-800/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className={`w-4 h-4 ${getTextColor()}`} />
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${getTextColor()}`}>
              {getLabel()}
            </h4>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(fatigue.level * 33, 100)}%` }}
                className={`h-1.5 rounded-full ${getColor()}`}
              />
            </div>
            <span className={`text-[10px] font-mono ${getTextColor()}`}>
              {fatigue.totalWarnings}/{fatigue.level >= 3 ? 'HIGH' : fatigue.level >= 2 ? 'MED' : 'LOW'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            {fatigue.suppressionActive ? (
              <>
                <Zap className="w-3 h-3 text-red-400" />
                <span className="text-red-400">Minor warnings suppressed — High Fatigue Mode</span>
              </>
            ) : (
              <>
                <Activity className="w-3 h-3" />
                <span>Governance sensitivity: {fatigue.level >= 2 ? 'Reduced' : 'Normal'}</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
