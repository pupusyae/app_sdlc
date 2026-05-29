'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, FileSearch, Scale } from 'lucide-react';
import { useCognitiveStore } from '@/stores/cognitiveStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

const iconMap: Record<string, React.ReactNode> = {
  'Governance Clarity': <Scale className="w-4 h-4" />,
  'Semantic Stability': <ShieldCheck className="w-4 h-4" />,
  'Authority Definition': <Activity className="w-4 h-4 text-yellow-400" />,
  'Risk Visibility': <FileSearch className="w-4 h-4" />,
};

function mapApiKeys(apiData: Record<string, number>) {
  const keyMap: Record<string, string> = {
    governance_clarity: 'Governance Clarity',
    semantic_stability: 'Semantic Stability',
    authority_definition: 'Authority Definition',
    risk_visibility: 'Risk Visibility',
  };

  return Object.entries(keyMap).map(([apiKey, label]) => ({
    name: label,
    value: Math.round(apiData[apiKey] ?? 0),
  }));
}

export default function EpistemicHealth() {
  const metrics = useCognitiveStore((s) => s.epistemicMetrics);
  const setEpistemicMetrics = useCognitiveStore((s) => s.setEpistemicMetrics);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/telemetry/epistemic-health`);
        if (res.ok) {
          const data = await res.json();
          const mapped = mapApiKeys(data);
          if (mapped.length > 0 && mapped.some((m) => m.value > 0)) {
            setEpistemicMetrics(mapped);
          }
        }
      } catch {
        // Keep current values
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, [setEpistemicMetrics]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center uppercase tracking-wider">
        <Activity className="w-4 h-4 mr-2 text-blue-400" />
        Epistemic Health
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                {iconMap[metric.name] || <Activity className="w-4 h-4" />}
                {metric.name}
              </span>
              <span className="font-mono">{metric.value}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className={`h-1.5 rounded-full ${
                  metric.value > 80 ? 'bg-green-500' : metric.value > 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
