'use client';

import { useMentionsStore } from '@/store/mentions-store';
import { ExternalLink, MessageSquare, Mail, AlertCircle, CheckCircle2, Timer, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const sourceIcons = {
  slack: MessageSquare,
  email: Mail,
  jira: AlertCircle,
};

export default function ContextPreview() {
  const { selectedMention, updateMentionStatus, snoozeMention } = useMentionsStore();

  // Component only renders when selectedMention exists (checked in parent)
  if (!selectedMention) return null;

  const SourceIcon = sourceIcons[selectedMention.source];
  const timeAgo = formatDistanceToNow(selectedMention.timestamp, { addSuffix: true });

  const handleMarkDone = () => {
    updateMentionStatus(selectedMention.id, 'done');
  };

  const handleSnooze = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    snoozeMention(selectedMention.id, tomorrow);
  };

  return (
    <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            {selectedMention.sender.avatar ? (
              <img
                src={selectedMention.sender.avatar}
                alt={selectedMention.sender.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--muted-bg)' }}
              >
                <User className="w-5 h-5" style={{ color: 'var(--muted)' }} strokeWidth={2} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>
                {selectedMention.sender.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--muted)' }}>
                <SourceIcon className="w-3 h-3" strokeWidth={2} />
                <span className="capitalize">{selectedMention.source}</span>
                <span>·</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          <h2 className="text-[16px] font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            {selectedMention.title}
          </h2>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h4 className="text-[12px] font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Message
          </h4>
          <div className="rounded-md p-3 text-[13px] leading-relaxed" style={{ background: 'var(--muted-bg)', color: 'var(--foreground)' }}>
            {selectedMention.content}
          </div>
        </div>

        {/* Context */}
        <div className="mb-6">
          <h4 className="text-[12px] font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Context
          </h4>
          <div className="rounded-md p-3 text-[13px] leading-relaxed" style={{ background: 'rgba(94, 106, 210, 0.15)', color: 'var(--foreground)' }}>
            {selectedMention.context}
          </div>
        </div>

        {/* Details */}
        <div className="mb-6">
          <h4 className="text-[12px] font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Details
          </h4>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Type</span>
              <span className="text-[13px] font-medium capitalize" style={{ color: 'var(--foreground)' }}>
                {selectedMention.type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Priority</span>
              <span 
                className="text-[13px] font-medium capitalize"
                style={{ 
                  color: selectedMention.priority === 'high' ? '#ef4444' :
                         selectedMention.priority === 'medium' ? '#f59e0b' : '#a1a1aa'
                }}
              >
                {selectedMention.priority}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Status</span>
              <span 
                className="text-[13px] font-medium capitalize"
                style={{ 
                  color: selectedMention.status === 'unread' ? '#7c84db' :
                         selectedMention.status === 'done' ? '#22c55e' :
                         selectedMention.status === 'snoozed' ? '#f59e0b' : '#a1a1aa'
                }}
              >
                {selectedMention.status}
              </span>
            </div>
            {selectedMention.isThreadResponse && (
              <div className="flex justify-between items-center">
                <span className="text-[13px]" style={{ color: 'var(--muted)' }}>Thread</span>
                <span className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>Yes</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="text-[12px] font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Actions
          </h4>
          
          <button
            onClick={() => window.open(selectedMention.actions.sourceUrl, '_blank')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium text-white transition-smooth"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >
            <ExternalLink className="w-4 h-4" strokeWidth={2} />
            Open in {selectedMention.source}
          </button>

          {selectedMention.actions.canReply && (
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium transition-smooth"
              style={{ background: 'var(--muted-bg)', color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--selected-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              Reply
            </button>
          )}

          {selectedMention.status !== 'done' && selectedMention.actions.canMarkDone && (
            <button 
              onClick={handleMarkDone}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium transition-smooth"
              style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'}
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              Mark as Done
            </button>
          )}

          {selectedMention.actions.canSnooze && selectedMention.status !== 'snoozed' && selectedMention.status !== 'done' && (
            <button 
              onClick={handleSnooze}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium transition-smooth"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'}
            >
              <Timer className="w-4 h-4" strokeWidth={2} />
              Snooze
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
