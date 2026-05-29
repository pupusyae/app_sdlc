'use client';
import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import CriticalAlert from './sidebar/CriticalAlert';
import WarningAlert from './sidebar/WarningAlert';
import SuggestionAlert from './sidebar/SuggestionAlert';
import EpistemicHealth from './EpistemicHealth';
import CognitiveFatigueIndicator from './CognitiveFatigueIndicator';
import { useCognitiveStore } from '@/stores/cognitiveStore';
import type { SeverityAlert } from '@/stores/cognitiveStore';

export default function Sidebar() {
  const severityAlerts = useCognitiveStore((s) => s.severityAlerts);
  const updateAlertStatus = useCognitiveStore((s) => s.updateAlertStatus);
  const toggleAlertExpand = useCognitiveStore((s) => s.toggleAlertExpand);

  const criticals = severityAlerts.filter((a) => a.level === 'Critical' && !a.rejected);
  const warnings = severityAlerts.filter((a) => a.level === 'Warning' && !a.rejected);
  const suggestions = severityAlerts.filter((a) => a.level === 'Suggestion' && !a.rejected);

  const handleToggle = useCallback((id: number) => toggleAlertExpand(id), [toggleAlertExpand]);
  const handleApprove = useCallback((id: number) => updateAlertStatus(id, true), [updateAlertStatus]);
  const handleReject = useCallback((id: number) => updateAlertStatus(id, false), [updateAlertStatus]);

  const defaultCriticals: SeverityAlert[] = criticals.length > 0 ? criticals : [
    { id: 1, type: 'Missing Role', text: "Undefined authority detected in 'Payment Module'", level: 'Critical' },
    { id: 2, type: 'Security', text: 'Governance Violation: Bypassing Architecture Review', level: 'Critical' },
  ];

  const defaultWarnings: SeverityAlert[] = warnings.length > 0 ? warnings : [
    { id: 3, type: 'Semantic Drift', text: "Ambiguous terminology: 'Cache-Sync'", level: 'Warning' },
  ];

  const defaultSuggestions: SeverityAlert[] = suggestions.length > 0 ? suggestions : [
    { id: 4, type: 'Architecture', text: 'ADR Candidate: Microservices split for Ledger', level: 'Suggestion' },
    { id: 5, type: 'Terminology', text: "Glossary Candidate: 'Event-Sourcing'", level: 'Suggestion' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white tracking-wide">Governance Context</h2>
        <p className="text-xs text-gray-500 mt-1">Live extraction pipeline active</p>
      </div>

      <CognitiveFatigueIndicator />
      <EpistemicHealth />

      <div className="mt-6 flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Critical ({defaultCriticals.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {defaultCriticals.map((alert) => (
                <CriticalAlert
                  key={alert.id}
                  id={alert.id}
                  type={alert.type}
                  text={alert.text}
                  expanded={alert.expanded}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-yellow-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" /> Warning ({defaultWarnings.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {defaultWarnings.map((alert) => (
                <WarningAlert
                  key={alert.id}
                  id={alert.id}
                  type={alert.type}
                  text={alert.text}
                  expanded={alert.expanded}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-blue-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <span className="w-2 h-2 bg-blue-500 rounded-full" /> Suggestion ({defaultSuggestions.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {defaultSuggestions.map((alert) => (
                <SuggestionAlert
                  key={alert.id}
                  id={alert.id}
                  type={alert.type}
                  text={alert.text}
                  expanded={alert.expanded}
                  approved={alert.approved}
                  onToggle={handleToggle}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
