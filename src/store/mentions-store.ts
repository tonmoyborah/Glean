import { create } from 'zustand';
import { MentionsStore } from '@/lib/types';
import { mockMentions, mockConnectors } from '@/lib/mock-data';

export const useMentionsStore = create<MentionsStore>((set, get) => ({
  mentions: mockMentions,
  connectors: mockConnectors,
  filters: {
    sources: ['slack', 'email', 'jira'],
    types: ['mention', 'assignment', 'thread_response'],
    users: [],
    timeRange: 'all',
    sortBy: 'recency',
  },
  selectedMention: null,

  setMentions: (mentions) => set({ mentions }),

  updateMentionStatus: (id, status) => {
    const mentions = get().mentions.map((mention) =>
      mention.id === id ? { ...mention, status } : mention
    );
    set({ mentions });
  },

  snoozeMention: (id, until) => {
    const mentions = get().mentions.map((mention) =>
      mention.id === id 
        ? { ...mention, status: 'snoozed' as const, snoozeUntil: until }
        : mention
    );
    set({ mentions });
  },

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...newFilters } });
  },

  setSelectedMention: (mention) => set({ selectedMention: mention }),

  updateConnector: (id, updates) => {
    const connectors = get().connectors.map((connector) =>
      connector.id === id ? { ...connector, ...updates } : connector
    );
    set({ connectors });
  },
}));
