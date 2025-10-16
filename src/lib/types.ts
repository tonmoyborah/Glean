export interface MentionItem {
  id: string;
  type: 'mention' | 'assignment' | 'thread_response';
  source: 'slack' | 'email' | 'jira';
  sender: {
    name: string;
    avatar?: string;
    email?: string;
  };
  timestamp: Date;
  title: string;
  content: string;
  context: string; // 2-3 line preview
  threadId?: string; // For grouping thread responses
  isThreadResponse: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'done' | 'snoozed';
  snoozeUntil?: Date;
  actions: {
    canReply: boolean;
    canMarkDone: boolean;
    canSnooze: boolean;
    sourceUrl: string;
  };
}

export interface Connector {
  id: string;
  name: string;
  type: 'slack' | 'email' | 'jira';
  isEnabled: boolean;
  priority: number; // 1-5, higher = more important
  isConnected: boolean;
  lastSync?: Date;
}

export interface FilterState {
  sources: string[];
  types: string[];
  users: string[];
  timeRange: 'today' | 'this_week' | 'this_month' | 'all';
  sortBy: 'recency' | 'priority' | 'manual';
}

export interface MentionsStore {
  mentions: MentionItem[];
  connectors: Connector[];
  filters: FilterState;
  selectedMention: MentionItem | null;
  
  // Actions
  setMentions: (mentions: MentionItem[]) => void;
  updateMentionStatus: (id: string, status: MentionItem['status']) => void;
  snoozeMention: (id: string, until: Date) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedMention: (mention: MentionItem | null) => void;
  updateConnector: (id: string, updates: Partial<Connector>) => void;
}
