'use client';

import { MentionItem as MentionItemType } from '@/lib/types';
import { useMentionsStore } from '@/store/mentions-store';
import { 
  CheckCircle2, 
  Timer, 
  ExternalLink, 
  MessageSquare,
  Mail,
  AlertCircle,
  Circle,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

interface MentionItemProps {
  mention: MentionItemType;
  isSelected?: boolean;
  onClick?: () => void;
}

const sourceIcons = {
  slack: MessageSquare,
  email: Mail,
  jira: AlertCircle,
};

const priorityConfig = {
  high: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: AlertCircle },
  medium: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: Circle },
  low: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', icon: Circle },
};

export default function MentionItem({ mention, isSelected, onClick }: MentionItemProps) {
  const { updateMentionStatus, snoozeMention, connectors } = useMentionsStore();
  const [imageError, setImageError] = useState(false);
  
  const SourceIcon = sourceIcons[mention.source];
  const timeAgo = formatDistanceToNow(mention.timestamp, { addSuffix: true });
  const priorityConf = priorityConfig[mention.priority];
  const PriorityIcon = priorityConf.icon;
  
  // Get connector priority for highlighting
  const connector = connectors.find(c => c.type === mention.source);
  const isHighPriorityConnector = connector?.priority && connector.priority >= 4;
  
  const handleMarkDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateMentionStatus(mention.id, 'done');
  };

  const handleSnooze = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    snoozeMention(mention.id, tomorrow);
  };

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(mention.actions.sourceUrl, '_blank');
  };

  const isDone = mention.status === 'done';

  return (
    <div
      className={`
        group relative px-3 py-2.5 rounded-md cursor-pointer transition-smooth
        ${isSelected ? 'shadow-sm' : 'hover:shadow-sm'}
        ${isDone ? 'opacity-60' : ''}
      `}
      style={{ 
        background: isSelected ? 'var(--selected-bg)' : 
                   (mention.status === 'unread' && isHighPriorityConnector) ? 'rgba(94, 106, 210, 0.05)' : 
                   'transparent',
        border: isSelected ? '1px solid #d4d4e8' : '1px solid transparent',
      }}
      onClick={onClick}
    >
      {/* Left accent bar for unread status */}
      {mention.status === 'unread' && !isSelected && (
        <div 
          className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full"
          style={{ background: isHighPriorityConnector ? '#5e6ad2' : '#e5e5e5' }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Status Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <button
            onClick={handleMarkDone}
            className="w-4 h-4 rounded border transition-smooth flex items-center justify-center"
            style={{
              borderColor: isDone ? '#22c55e' : 'var(--border)',
              background: isDone ? '#22c55e' : 'transparent',
            }}
          >
            {isDone && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          {mention.sender.avatar && !imageError ? (
            <Image
              src={mention.sender.avatar}
              alt={mention.sender.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--muted-bg)' }}
            >
              <User className="w-4 h-4" style={{ color: 'var(--muted)' }} strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className="text-[13px] font-medium line-clamp-1"
              style={{ color: isDone ? 'var(--muted)' : 'var(--foreground)' }}
            >
              {mention.title}
            </h3>
          </div>

          {/* Content */}
          <p className="text-[13px] mb-1.5 line-clamp-2" style={{ color: 'var(--muted)' }}>
            {mention.content}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--muted)' }}>
            <div className="flex items-center gap-1">
              <SourceIcon className="w-3 h-3" strokeWidth={2} />
              <span className="capitalize">{mention.source}</span>
            </div>
            <span>·</span>
            <span>{mention.sender.name}</span>
            <span>·</span>
            <span suppressHydrationWarning>{timeAgo}</span>
            {mention.isThreadResponse && (
              <>
                <span>·</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: 'var(--muted-bg)', color: 'var(--muted)' }}>
                  ↳ Thread
                </span>
              </>
            )}
          </div>

          {/* Tags and Status */}
          <div className="flex items-center gap-1.5 mt-2">
            {/* Priority Badge */}
            <div 
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium"
              style={{ 
                color: priorityConf.color,
                background: priorityConf.bgColor,
              }}
            >
              <PriorityIcon className="w-3 h-3" strokeWidth={2} />
              <span className="capitalize">{mention.priority}</span>
            </div>

            {mention.status === 'snoozed' && mention.snoozeUntil && (
              <div 
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium"
                style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}
              >
                <Timer className="w-3 h-3" strokeWidth={2} />
                <span>Snoozed</span>
              </div>
            )}
          </div>

          {/* Hover Actions */}
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-smooth">
            {mention.actions.canSnooze && mention.status !== 'snoozed' && mention.status !== 'done' && (
              <button
                onClick={handleSnooze}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-smooth"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Timer className="w-3 h-3" strokeWidth={2} />
                Snooze
              </button>
            )}
            
            <button
              onClick={handleOpenSource}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-smooth"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ExternalLink className="w-3 h-3" strokeWidth={2} />
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
