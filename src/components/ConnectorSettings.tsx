'use client';

import { useMentionsStore } from '@/store/mentions-store';
import { X, Settings, AlertCircle, MessageSquare, Mail } from 'lucide-react';

interface ConnectorSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const sourceIcons = {
  slack: MessageSquare,
  email: Mail,
  jira: AlertCircle,
};

export default function ConnectorSettings({ isOpen, onClose }: ConnectorSettingsProps) {
  const { connectors, updateConnector } = useMentionsStore();

  if (!isOpen) return null;

  const handlePriorityChange = (connectorId: string, priority: number) => {
    updateConnector(connectorId, { priority });
  };

  const handleToggleEnabled = (connectorId: string, isEnabled: boolean) => {
    console.log('Toggle enabled:', connectorId, isEnabled);
    updateConnector(connectorId, { isEnabled });
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ background: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden"
        style={{ background: 'var(--card-bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--header-bg)' }}>
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4" style={{ color: 'var(--muted)' }} strokeWidth={2} />
            <h2 className="text-[15px] font-semibold" style={{ color: 'var(--foreground)' }}>
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-smooth"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Status Overview */}
        <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)' }}>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium" style={{ color: 'var(--muted)' }}>Status</span>
            {connectors.map((connector) => (
              <div 
                key={connector.id} 
                className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                style={{ background: 'var(--card-bg)' }}
              >
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${connector.isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} 
                />
                <span className="text-[12px] capitalize" style={{ color: 'var(--foreground)' }}>
                  {connector.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-130px)]" style={{ background: 'var(--card-bg)' }}>
          <div className="space-y-3">
            {connectors.map((connector) => {
              const SourceIcon = sourceIcons[connector.type];
              return (
                <div
                  key={connector.id}
                  className="border rounded-lg p-4 transition-smooth hover:shadow-sm"
                  style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-md flex items-center justify-center"
                        style={{ 
                          background: connector.isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' 
                        }}
                      >
                        <SourceIcon 
                          className="w-4 h-4" 
                          strokeWidth={2}
                          style={{ color: connector.isConnected ? '#22c55e' : '#ef4444' }}
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-medium capitalize mb-0.5" style={{ color: 'var(--foreground)' }}>
                          {connector.name}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: connector.isConnected ? '#22c55e' : '#ef4444' }}
                          />
                          <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                            {connector.isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                          {connector.lastSync && (
                            <>
                              <span className="text-[12px]" style={{ color: 'var(--muted)' }}>·</span>
                              <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                                {new Date(connector.lastSync).toLocaleTimeString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Enable/Disable Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={connector.isEnabled}
                        onChange={(e) => handleToggleEnabled(connector.id, e.target.checked)}
                        className="cursor-pointer"
                        aria-label={`Enable ${connector.name}`}
                      />
                      <span className="text-[13px]" style={{ color: 'var(--foreground)' }}>Enabled</span>
                    </label>

                    {/* Priority Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]" style={{ color: 'var(--foreground)' }}>Priority</span>
                      <select
                        value={connector.priority}
                        onChange={(e) => handlePriorityChange(connector.id, parseInt(e.target.value))}
                        className="text-[13px] border rounded-md px-2 py-1 transition-smooth cursor-pointer"
                        style={{ 
                          borderColor: 'var(--border)',
                          background: 'var(--card-bg)',
                          color: 'var(--foreground)'
                        }}
                      >
                        <option value={1}>Low (1)</option>
                        <option value={2}>Medium-Low (2)</option>
                        <option value={3}>Medium (3)</option>
                        <option value={4}>High (4)</option>
                        <option value={5}>Critical (5)</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority Description */}
                  {connector.priority && (
                    <div className="mt-3 pt-3 border-t text-[12px]" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                      {connector.priority === 5 && 'Critical: Highest priority, always shown first'}
                      {connector.priority === 4 && 'High: Important mentions, shown prominently'}
                      {connector.priority === 3 && 'Medium: Standard priority, normal display'}
                      {connector.priority === 2 && 'Medium-Low: Lower priority, less prominent'}
                      {connector.priority === 1 && 'Low: Lowest priority, shown last'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)' }}>
          <div className="rounded-md p-3" style={{ background: 'rgba(94, 106, 210, 0.15)' }}>
            <h4 className="text-[12px] font-medium mb-1.5" style={{ color: '#7c84db' }}>
              How Priority Works
            </h4>
            <ul className="text-[12px] space-y-0.5" style={{ color: 'var(--foreground)' }}>
              <li>• Higher priority connectors appear first in the feed</li>
              <li>• Mentions from higher priority connectors are highlighted</li>
              <li>• You can disable connectors to hide their mentions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
