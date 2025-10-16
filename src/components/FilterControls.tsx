'use client';

import { useMentionsStore } from '@/store/mentions-store';
import { Filter, X, ChevronDown, MessageSquare, Mail, AlertCircle, User } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';

const sourceIcons = {
  slack: MessageSquare,
  email: Mail,
  jira: AlertCircle,
};

export default function FilterControls() {
  const { filters, setFilters, mentions } = useMentionsStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique users from mentions
  const uniqueUsers = useMemo(() => {
    const users = new Set(mentions.map(m => m.sender.name));
    return Array.from(users).sort();
  }, [mentions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    setFilters({ sources: newSources });
  };

  const handleUserToggle = (user: string) => {
    const newUsers = filters.users.includes(user)
      ? filters.users.filter(u => u !== user)
      : [...filters.users, user];
    setFilters({ users: newUsers });
  };

  const handleTimeRangeChange = (timeRange: 'today' | 'this_week' | 'this_month' | 'all') => {
    setFilters({ timeRange });
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    setFilters({
      sources: ['slack', 'email', 'jira'],
      types: ['mention', 'assignment', 'thread_response'],
      users: [],
      timeRange: 'all',
    });
  };

  const hasActiveFilters = filters.sources.length < 3 || filters.types.length < 3 || filters.users.length > 0 || filters.timeRange !== 'all';

  const getTimeRangeLabel = () => {
    switch (filters.timeRange) {
      case 'today': return 'Today';
      case 'this_week': return 'This week';
      case 'this_month': return 'This month';
      default: return 'All time';
    }
  };

  return (
    <div className="border-b px-6 py-2.5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 flex-wrap" ref={dropdownRef}>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} strokeWidth={2} />
          <span className="text-[12px] font-medium" style={{ color: 'var(--muted)' }}>Filters</span>
        </div>

        {/* Source Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'source' ? null : 'source')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-smooth border"
            style={{ 
              borderColor: filters.sources.length < 3 ? 'var(--accent)' : 'var(--border)',
              background: filters.sources.length < 3 ? 'rgba(94, 106, 210, 0.05)' : 'var(--card-bg)',
              color: filters.sources.length < 3 ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
            Source
            {filters.sources.length < 3 && (
              <span className="px-1.5 py-0.5 rounded text-[11px]" style={{ background: 'var(--accent)', color: 'white' }}>
                {filters.sources.length}
              </span>
            )}
            <ChevronDown className="w-3 h-3" strokeWidth={2} />
          </button>
          
          {openDropdown === 'source' && (
            <div 
              className="absolute top-full left-0 mt-1 min-w-[180px] rounded-md shadow-xl border z-50"
              style={{ background: 'var(--muted-bg)', borderColor: 'var(--border)' }}
            >
              <div className="p-1.5">
                {(['slack', 'email', 'jira'] as const).map((source) => {
                  const Icon = sourceIcons[source];
                  return (
                    <button
                      key={source}
                      onClick={() => handleSourceToggle(source)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-smooth"
                      style={{ color: 'var(--foreground)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--selected-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div 
                        className="w-4 h-4 rounded border flex items-center justify-center"
                        style={{ 
                          borderColor: filters.sources.includes(source) ? 'var(--accent)' : 'var(--border)',
                          background: filters.sources.includes(source) ? 'var(--accent)' : 'transparent',
                        }}
                      >
                        {filters.sources.includes(source) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} strokeWidth={2} />
                      <span className="capitalize">{source}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-smooth border"
            style={{ 
              borderColor: filters.users.length > 0 ? 'var(--accent)' : 'var(--border)',
              background: filters.users.length > 0 ? 'rgba(94, 106, 210, 0.05)' : 'var(--card-bg)',
              color: filters.users.length > 0 ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            <User className="w-3.5 h-3.5" strokeWidth={2} />
            User
            {filters.users.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[11px]" style={{ background: 'var(--accent)', color: 'white' }}>
                {filters.users.length}
              </span>
            )}
            <ChevronDown className="w-3 h-3" strokeWidth={2} />
          </button>
          
          {openDropdown === 'user' && (
            <div 
              className="absolute top-full left-0 mt-1 min-w-[200px] max-h-[300px] overflow-y-auto rounded-md shadow-xl border z-50"
              style={{ background: 'var(--muted-bg)', borderColor: 'var(--border)' }}
            >
              <div className="p-1.5">
                {uniqueUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => handleUserToggle(user)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-smooth"
                    style={{ color: 'var(--foreground)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--selected-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div 
                      className="w-4 h-4 rounded border flex items-center justify-center"
                      style={{ 
                        borderColor: filters.users.includes(user) ? 'var(--accent)' : 'var(--border)',
                        background: filters.users.includes(user) ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      {filters.users.includes(user) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{user}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-smooth border"
            style={{ 
              borderColor: filters.timeRange !== 'all' ? 'var(--accent)' : 'var(--border)',
              background: filters.timeRange !== 'all' ? 'rgba(94, 106, 210, 0.05)' : 'var(--card-bg)',
              color: filters.timeRange !== 'all' ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {getTimeRangeLabel()}
            <ChevronDown className="w-3 h-3" strokeWidth={2} />
          </button>
          
          {openDropdown === 'time' && (
            <div 
              className="absolute top-full left-0 mt-1 min-w-[150px] rounded-md shadow-xl border z-50"
              style={{ background: 'var(--muted-bg)', borderColor: 'var(--border)' }}
            >
              <div className="p-1.5">
                {[
                  { value: 'today' as const, label: 'Today' },
                  { value: 'this_week' as const, label: 'This week' },
                  { value: 'this_month' as const, label: 'This month' },
                  { value: 'all' as const, label: 'All time' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeRangeChange(option.value)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[13px] transition-smooth"
                    style={{ 
                      background: filters.timeRange === option.value ? 'var(--selected-bg)' : 'transparent',
                      color: filters.timeRange === option.value ? 'var(--accent)' : 'var(--foreground)',
                    }}
                    onMouseEnter={(e) => {
                      if (filters.timeRange !== option.value) {
                        e.currentTarget.style.background = 'var(--selected-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.timeRange !== option.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {filters.timeRange === option.value && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[12px] font-medium transition-smooth"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X className="w-3 h-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
