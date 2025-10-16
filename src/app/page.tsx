'use client';

import FilterControls from '@/components/FilterControls';
import MentionsFeed from '@/components/MentionsFeed';
import ContextPreview from '@/components/ContextPreview';
import ConnectorSettings from '@/components/ConnectorSettings';
import { Inbox, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}>
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Inbox className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>Glean Work Center</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-md transition-smooth"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Settings className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Filter Controls */}
      <FilterControls />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-106px)]">
        {/* Mentions Feed */}
        <MentionsFeed />
        
        {/* Context Preview - Always visible */}
        <ContextPreview />
      </div>

      {/* Connector Settings Modal */}
      <ConnectorSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}