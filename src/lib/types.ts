export interface MentionItem {
  id: string;
  type: 'mention' | 'assignment' | 'thread_response';
  source: 'slack' | 'email' | 'jira';
  sender: {
    name: string;
    avatar?: string;
    email?: string;
    role?: string; // For prioritization (CEO, Manager, etc.)
  };
  timestamp: Date;
  title: string;
  content: string;
  context: string; // 2-3 line preview
  threadId?: string; // For grouping thread responses
  isThreadResponse: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'done' | 'archived';
  archiveUntil?: Date;
  // New fields for smart tagging and context detection
  detectedContext: 'action_needed' | 'information' | 'resolved';
  tagType: 'action_needed' | 'critical_info' | 'resolved' | 'others';
  groupId?: string; // For grouping similar context mentions
  groupLabel?: string; // Display label for the group
  isNewInThread: boolean; // True if this is a new mention in an ongoing thread
  priorityFactors: {
    senderImportance?: boolean;
    urgencySignals?: string[]; // Array of detected phrases
    soloResponsibility?: boolean; // True if user is tagged alone
    contextUrgency?: boolean;
  };
  actions: {
    canReply: boolean;
    canMarkDone: boolean;
    canArchive: boolean;
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
  archiveMention: (id: string, until: Date) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedMention: (mention: MentionItem | null) => void;
  updateConnector: (id: string, updates: Partial<Connector>) => void;
}
