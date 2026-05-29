'use client';
import { useState, useEffect } from 'react';
import BlueprintViewer from './BlueprintViewer';
import TicketExporter from './TicketExporter';
import LinterDownloader from './LinterDownloader';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface ADRItem {
  id: string;
  title: string;
  status: string;
}

export default function ExecutionPanel() {
  const [adrs, setAdrs] = useState<ADRItem[]>([]);
  const [selectedAdrId, setSelectedAdrId] = useState<string | null>(null);
  const [showBlueprint, setShowBlueprint] = useState(false);

  useEffect(() => {
    const fetchAdrs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/governance/adr`);
        if (res.ok) {
          const data = await res.json();
          setAdrs(data);
          const approved = data.find((a: ADRItem) => a.status === 'Approved');
          if (approved) setSelectedAdrId(approved.id);
        }
      } catch {
        // keep empty
      }
    };
    fetchAdrs();
  }, []);

  const selectedAdr = adrs.find((a) => a.id === selectedAdrId);

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* ADR Selector */}
      <div>
        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Select ADR</label>
        <select
          value={selectedAdrId || ''}
          onChange={(e) => { setSelectedAdrId(e.target.value); setShowBlueprint(false); }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
        >
          <option value="" disabled>Select an ADR...</option>
          {adrs.map((adr) => (
            <option key={adr.id} value={adr.id}>
              [{adr.status}] {adr.title}
            </option>
          ))}
        </select>
      </div>

      {selectedAdr && (
        <>
          {/* Blueprint Section */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
            <BlueprintViewer
              adrId={selectedAdr.id}
              onClose={() => setShowBlueprint(false)}
            />
          </div>

          {/* Ticket Export Section */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Export to Ticketing
            </h3>
            <TicketExporter adrId={selectedAdr.id} adrTitle={selectedAdr.title} />
          </div>
        </>
      )}

      {/* Linter Rules Section */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
        <LinterDownloader />
      </div>
    </div>
  );
}
