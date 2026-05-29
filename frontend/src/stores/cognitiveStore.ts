'use client';
import { create } from 'zustand';

interface UserInfo {
  id: string;
  email: string;
  has_api_key: boolean;
}

interface SessionInfo {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface SeverityAlert {
  id: number;
  type: string;
  text: string;
  level: 'Critical' | 'Warning' | 'Suggestion';
  approved?: boolean;
  rejected?: boolean;
  expanded?: boolean;
}

export interface EpistemicMetric {
  name: string;
  value: number;
}

export interface ChatMessage {
  id: number;
  sender: 'human' | 'ai';
  block: string;
  content: string;
  semanticBlock?: string;
  requiresApproval?: boolean;
}

export interface GovernanceApproval {
  id: number;
  type: string;
  text: string;
  approved: boolean;
}

interface CognitiveState {
  token: string | null;
  user: UserInfo | null;
  currentSessionId: string | null;
  sessions: SessionInfo[];
  activeBlock: string;
  severityAlerts: SeverityAlert[];
  epistemicMetrics: EpistemicMetric[];
  messages: ChatMessage[];
  isLoading: boolean;
  pendingApprovals: GovernanceApproval[];

  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
  setSessions: (sessions: SessionInfo[]) => void;
  setCurrentSessionId: (id: string) => void;
  setActiveBlock: (block: string) => void;
  setSeverityAlerts: (alerts: SeverityAlert[]) => void;
  addSeverityAlert: (alert: SeverityAlert) => void;
  updateAlertStatus: (id: number, approved: boolean) => void;
  toggleAlertExpand: (id: number) => void;
  setEpistemicMetrics: (metrics: EpistemicMetric[]) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearState: () => void;
  setLoading: (loading: boolean) => void;
  addPendingApproval: (item: GovernanceApproval) => void;
  resolveApproval: (id: number, approved: boolean) => void;
  setPendingApprovals: (items: GovernanceApproval[]) => void;
}

const getStoredAuth = () => {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const t = localStorage.getItem('cognitive_token');
    const u = localStorage.getItem('cognitive_user');
    return {
      token: t,
      user: u ? JSON.parse(u) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const { token: storedToken, user: storedUser } = getStoredAuth();

export const useCognitiveStore = create<CognitiveState>((set, get) => ({
  token: storedToken,
  user: storedUser,
  currentSessionId: null,
  sessions: [],
  activeBlock: 'Business Objective',
  severityAlerts: [],
  epistemicMetrics: [
    { name: 'Governance Clarity', value: 82 },
    { name: 'Semantic Stability', value: 91 },
    { name: 'Authority Definition', value: 64 },
    { name: 'Risk Visibility', value: 77 },
  ],
  messages: [
    {
      id: 1,
      sender: 'ai',
      block: 'System Boot',
      content: 'Cognitive Governance Infrastructure initialized. I am your Constitutional System Analyst. Let us define the architecture boundary.',
    },
  ],
  isLoading: false,
  pendingApprovals: [],

  setAuth: (token, user) => {
    localStorage.setItem('cognitive_token', token);
    localStorage.setItem('cognitive_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('cognitive_token');
    localStorage.removeItem('cognitive_user');
    set({ token: null, user: null, currentSessionId: null, sessions: [], messages: [], severityAlerts: [] });
  },
  setSessions: (sessions) => set({ sessions }),
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setActiveBlock: (block) => set({ activeBlock: block }),
  setSeverityAlerts: (alerts) => set({ severityAlerts: alerts }),
  addSeverityAlert: (alert) =>
    set((state) => ({ severityAlerts: [...state.severityAlerts, alert] })),
  updateAlertStatus: (id, approved) =>
    set((state) => ({
      severityAlerts: state.severityAlerts.map((a) =>
        a.id === id ? { ...a, approved, rejected: !approved } : a
      ),
    })),
  toggleAlertExpand: (id) =>
    set((state) => ({
      severityAlerts: state.severityAlerts.map((a) =>
        a.id === id ? { ...a, expanded: !a.expanded } : a
      ),
    })),
  setEpistemicMetrics: (metrics) => set({ epistemicMetrics: metrics }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  clearState: () =>
    set({
      messages: [{
        id: Date.now(),
        sender: 'ai',
        block: 'System Boot',
        content: 'Session loaded. I am your Constitutional System Analyst. Let us continue where we left off.',
      }],
      severityAlerts: [],
      activeBlock: 'Business Objective',
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  addPendingApproval: (item) =>
    set((state) => ({ pendingApprovals: [...state.pendingApprovals, item] })),
  resolveApproval: (id, approved) =>
    set((state) => ({
      pendingApprovals: state.pendingApprovals.filter((a) => a.id !== id),
    })),
  setPendingApprovals: (items) => set({ pendingApprovals: items }),
}));
