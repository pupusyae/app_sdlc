'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatWorkspace from '@/components/ChatWorkspace';
import Sidebar from '@/components/Sidebar';
import GovernanceTimeline from '@/components/GovernanceTimeline';
import DecisionLineageGraph from '@/components/DecisionLineageGraph';
import ExecutionPanel from '@/components/ExecutionPanel';
import SessionSidebar from '@/components/SessionSidebar';
import SettingsModal from '@/components/SettingsModal';
import { History, GitBranch, LayoutList, Wrench } from 'lucide-react';
import { useCognitiveStore } from '@/stores/cognitiveStore';

type TabId = 'context' | 'timeline' | 'lineage' | 'build';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'context', label: 'Context', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'timeline', label: 'Timeline', icon: <History className="w-3.5 h-3.5" /> },
  { id: 'lineage', label: 'Lineage', icon: <GitBranch className="w-3.5 h-3.5" /> },
  { id: 'build', label: 'Build', icon: <Wrench className="w-3.5 h-3.5" /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('context');
  const token = useCognitiveStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full bg-gray-950 overflow-hidden font-sans">
      {/* Left Pane: Session History */}
      <SessionSidebar />

      {/* Center Pane: Chat Workspace */}
      <ChatWorkspace />

      {/* Right Pane: Governance Tools */}
      <div className="w-80 border-l border-gray-800 bg-gray-950 flex flex-col overflow-hidden">
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'context' && <Sidebar />}
          {activeTab === 'timeline' && <GovernanceTimeline />}
          {activeTab === 'lineage' && <DecisionLineageGraph />}
          {activeTab === 'build' && <ExecutionPanel />}
        </div>
      </div>
    </main>
  );
}
