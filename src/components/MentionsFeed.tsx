'use client';

import { useMentionsStore } from '@/store/mentions-store';
import MentionItem from './MentionItem';
import { useMemo, useEffect } from 'react';
// import { formatDistanceToNow } from 'date-fns';

export default function MentionsFeed() {
  const { mentions, filters, selectedMention, setSelectedMention } = useMentionsStore();

  const filteredAndSortedMentions = useMemo(() => {
    const filtered = mentions.filter((mention) => {
      // Filter by source
      if (!filters.sources.includes(mention.source)) return false;
      
      // Filter by type
      if (!filters.types.includes(mention.type)) return false;
      
      // Filter by user
      if (filters.users.length > 0 && !filters.users.includes(mention.sender.name)) return false;
      
      // Filter by time range
      const now = new Date();
      const mentionTime = mention.timestamp;
      
      if (filters.timeRange === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (mentionTime < today) return false;
      } else if (filters.timeRange === 'this_week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (mentionTime < weekAgo) return false;
      } else if (filters.timeRange === 'this_month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (mentionTime < monthAgo) return false;
      }
      
      return true;
    });

    // Sort mentions
    filtered.sort((a, b) => {
      if (filters.sortBy === 'priority') {
        // First sort by connector priority, then by mention priority
        const { connectors } = useMentionsStore.getState();
        const aConnector = connectors.find(c => c.type === a.source);
        const bConnector = connectors.find(c => c.type === b.source);
        const aConnectorPriority = aConnector?.priority || 1;
        const bConnectorPriority = bConnector?.priority || 1;
        
        if (aConnectorPriority !== bConnectorPriority) {
          return bConnectorPriority - aConnectorPriority;
        }
        
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (filters.sortBy === 'manual') {
        // For manual sorting, we could implement drag-and-drop or pinning
        // For now, just sort by timestamp
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        // Default: recency
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    return filtered;
  }, [mentions, filters]);

  // Group mentions by thread
  const groupedMentions = useMemo(() => {
    const groups: { [key: string]: typeof filteredAndSortedMentions } = {};
    const standalone: typeof filteredAndSortedMentions = [];

    filteredAndSortedMentions.forEach((mention) => {
      if (mention.threadId) {
        if (!groups[mention.threadId]) {
          groups[mention.threadId] = [];
        }
        groups[mention.threadId].push(mention);
      } else {
        standalone.push(mention);
      }
    });

    // Sort groups by the earliest mention in each thread
    const sortedGroups = Object.values(groups).sort((a, b) => {
      const aTime = Math.min(...a.map(m => m.timestamp.getTime()));
      const bTime = Math.min(...b.map(m => m.timestamp.getTime()));
      return bTime - aTime;
    });

    return [...standalone, ...sortedGroups.flat()];
  }, [filteredAndSortedMentions]);

  const handleMentionClick = (mention: typeof mentions[0]) => {
    setSelectedMention(mention);
  };

  // Auto-select first mention when filtered mentions change and no selection exists
  useEffect(() => {
    if (groupedMentions.length > 0 && !selectedMention) {
      setSelectedMention(groupedMentions[0]);
    } else if (groupedMentions.length > 0 && selectedMention) {
      // Check if selected mention is still in filtered list
      const isStillVisible = groupedMentions.find(m => m.id === selectedMention.id);
      if (!isStillVisible) {
        // Select first mention if current selection is filtered out
        setSelectedMention(groupedMentions[0]);
      }
    } else if (groupedMentions.length === 0) {
      // Clear selection if no mentions
      setSelectedMention(null);
    }
  }, [groupedMentions, selectedMention, setSelectedMention]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-4">
        <div className="mb-4">
          <h2 className="text-[13px] font-medium tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>
            Inbox
          </h2>
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
            {filteredAndSortedMentions.length} {filteredAndSortedMentions.length === 1 ? 'item' : 'items'}
            {filters.sources.length < 3 && filters.sources.length > 0 && ` · ${filters.sources.join(', ')}`}
          </p>
        </div>

        <div className="space-y-1">
          {groupedMentions.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-3" style={{ color: 'var(--muted)' }}>
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-[14px] font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                No mentions found
              </h3>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                Try adjusting your filters to see more results
              </p>
            </div>
          ) : (
            groupedMentions.map((mention) => (
              <MentionItem
                key={mention.id}
                mention={mention}
                isSelected={selectedMention?.id === mention.id}
                onClick={() => handleMentionClick(mention)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
