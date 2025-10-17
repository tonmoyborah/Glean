import { create } from 'zustand';
import { MentionsStore, MentionItem } from '@/lib/types';
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
  selectedMention: mockMentions.length > 0 ? mockMentions[0] : null,

  setMentions: (mentions) => set({ mentions }),

  updateMentionStatus: (id, status) => {
    const mentions = get().mentions.map((mention) =>
      mention.id === id ? { ...mention, status } : mention
    );
    set({ mentions });
  },

  archiveMention: (id, until) => {
    const mentions = get().mentions.map((mention) =>
      mention.id === id 
        ? { ...mention, status: 'archived' as const, archiveUntil: until }
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

// Helper functions for section computation
export const getMentionsBySection = (mentions: MentionItem[]) => {
  const priority = mentions.filter(
    m => m.tagType === 'action_needed' || m.tagType === 'critical_info'
  );
  const later = mentions.filter(
    m => m.tagType === 'resolved' || m.tagType === 'others'
  );
  return { priority, later };
};

export const isPriorityMention = (mention: MentionItem): boolean => {
  return mention.tagType === 'action_needed' || mention.tagType === 'critical_info';
};