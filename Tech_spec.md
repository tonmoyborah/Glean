# Glean - Unified Mentions Feed Technical Specification

## Project Overview
Glean is a unified mentions feed that aggregates all @-mentions and assignments from core tools (Slack, Email, Jira) into a single chronological feed, enabling users to preview context, mark done, archive, or open the source without app-switching.

## Core Features

### 1. Unified Mentions Feed
- **Purpose**: Single chronological feed aggregating mentions and assignments from all connectors
- **Display Elements**: 
  - Status checkbox (mark as done)
  - Sender avatar (32x32px, rounded)
  - Sender information (name and role)
  - Timestamp
  - Source app (Slack, Email, Jira)
  - Brief context snippet (2-3 lines)
  - Thread state indicator (new in thread vs ongoing thread)
  - Smart tag badge (Action Needed, Critical Info, Resolved, Others)
  - Priority factor indicators (VIP sender badge)
  - Persistent actions on right side (archive, open)
- **Grouping**: Mentions with similar context are grouped together with visual labels
- **Feed Sections**: 
  - **Priority Section**: Contains Action Needed and Critical Info items
  - **Later Section**: Contains Resolved and Others items
- **Thread State Visualization**: UI distinguishes between new mentions in ongoing threads vs mentions in fresh threads

### 2. Context Preview
- **Purpose**: Provide 2-3 line preview of surrounding conversation/document
- **Implementation**: Always visible right panel with auto-selection
- **Default Behavior**: 
  - Always visible (384px fixed width)
  - Automatically selects first mention on load
  - Auto-updates selection when filters change
  - Shows empty state when no mentions available
- **Content**: Shows relevant context without full app switching
- **New Features**:
  - Manual context correction dropdown (allows users to override auto-detected context)
  - Priority factors display showing why an item was prioritized
  - Smart tag indicator with visual feedback

### 3. Smart Tagging & Context Detection
- **Auto Context Detection**: Analyzes message content using signal phrases
  - **Action Needed Signals**: "please check", "can you", "need you to", "review", "approve", "urgent", "action required", "asap", "by eod"
  - **Information Signals**: "fyi", "for your information", "just wanted to let you know", "heads up", "update:", "reminder:"
  - **Resolved Signals**: "resolved", "completed", "done", "fixed", "closed", "finished", "merged"
- **Smart Tag Types**:
  - **Action Needed**: Context = action_needed AND Priority = high (Red/orange accent)
  - **Critical Info**: Context = information AND Priority = high (Purple accent)
  - **Resolved**: Context = resolved (Green accent)
  - **Others**: All other combinations (Gray accent)
- **Manual Correction**: Users can manually override misclassified contexts via dropdown in Context Preview panel

### 4. Auto-Prioritization
- **Priority Factors** (computed for prototyping):
  - **Sender Importance**: Based on sender role (CEO, Manager, etc.)
  - **Urgency Signals**: Detected phrases indicating time sensitivity
  - **Solo Responsibility**: User is tagged alone vs. with others
  - **Context Urgency**: Message context indicates immediate action needed
- **Visual Indicators**: Priority factors displayed in Context Preview panel and as badges on mention cards

### 5. Quick Inline Actions
- **Mark as Done**: Mark item as completed
- **Archive**: Temporarily hide item with time-based return
- **Open in source app**: Deep link to original context
- **Reply directly**: If connector supports it (Slack, Email)

### 6. Filtering and Sorting
- **Filter by**:
  - Source app (Slack, Email, Jira) - Modern dropdown with checkboxes
  - User/Sender - Multi-select dropdown
  - Time (Today, This Week, This Month, All Time) - Dropdown selector
  - Type (Mention, Assignment, Thread Response)
- **Sort by**:
  - Recency (newest first)
  - Manual priority (pinned items)
  - Source app priority
- **Modern Filter UI**:
  - Dropdown-based filters with badges showing active filter count
  - Color-coded active states (purple accent)
  - Clear all filters button
  - Outside-click to close dropdowns

### 7. Connector Management
- **Connector Selection**: Choose which connectors to display
- **Priority Assignment**: Set priority levels for different connectors
- **Status Indicators**: Show connection status for each connector

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Images**: Next.js Image component with external domain support
  - Configured for api.dicebear.com (avatar generation)
  - Error handling with fallback to User icon
  - Unoptimized loading for external avatars
  - Object-cover for proper aspect ratio
- **Date Formatting**: date-fns library
  - Hydration warnings suppressed for dynamic timestamps

### Data Models

#### MentionItem
```typescript
interface MentionItem {
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
  // Smart tagging and context detection fields
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
```

#### Connector
```typescript
interface Connector {
  id: string;
  name: string;
  type: 'slack' | 'email' | 'jira';
  isEnabled: boolean;
  priority: number; // 1-5, higher = more important
  isConnected: boolean;
  lastSync?: Date;
}
```

#### FilterState
```typescript
interface FilterState {
  sources: string[];
  types: string[];
  users: string[];
  timeRange: 'today' | 'this_week' | 'this_month' | 'all';
  sortBy: 'recency' | 'priority' | 'manual';
}
```

### Context Detection Logic

The application uses signal phrase detection to automatically categorize mentions:

```typescript
// Context detection analyzes title and content for signal phrases
function detectContext(title: string, content: string): 'action_needed' | 'information' | 'resolved' {
  const text = (title + ' ' + content).toLowerCase();
  
  // Action needed signals
  const actionSignals = [
    'please check', 'can you', 'need you to', 'review', 'approve', 'urgent', 
    'action required', 'needs your', 'asap', 'by eod', 'assigned to', 'can you confirm'
  ];
  
  // Resolved signals
  const resolvedSignals = [
    'resolved', 'completed', 'done', 'fixed', 'closed', 'finished', 'merged'
  ];
  
  // Information signals
  const infoSignals = [
    'fyi', 'for your information', 'just wanted to let you know', 'heads up', 
    'update:', 'reminder:', 'note:'
  ];
  
  // Check for resolved first, then action needed, then information
  // Default to information if no clear signals
}

// Tag type is computed based on context + priority
function computeTagType(
  detectedContext: 'action_needed' | 'information' | 'resolved',
  priority: 'high' | 'medium' | 'low'
): 'action_needed' | 'critical_info' | 'resolved' | 'others' {
  // Action Needed: context = action_needed AND priority = high
  // Critical Info: context = information AND priority = high
  // Resolved: context = resolved (any priority)
  // Others: all other combinations
}
```

### Component Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (Radix UI components)
│   ├── MentionItem.tsx - Smart tags, thread state indicators
│   ├── MentionsFeed.tsx - Priority/Later sections, grouping
│   ├── FilterControls.tsx
│   ├── ConnectorSettings.tsx
│   └── ContextPreview.tsx - Manual correction, priority factors
├── lib/
│   ├── types.ts - Updated with new fields
│   ├── mock-data.ts - Context detection logic, mock data
│   └── utils.ts
└── store/
    └── mentions-store.ts - Section computation helpers
```

## Implementation Status

### ✅ Phase 1: Core Setup - COMPLETED
1. ✅ Initialize Next.js project with TypeScript
2. ✅ Set up Tailwind CSS and Radix UI
3. ✅ Create basic project structure
4. ✅ Implement data models and mock data

### ✅ Phase 2: UI Components - COMPLETED
1. ✅ Create MentionItem component with all display elements
2. ✅ Build MentionsFeed component with chronological display
3. ✅ Implement FilterControls for filtering and sorting
4. ✅ Add ContextPreview component

### ✅ Phase 3: Functionality - COMPLETED
1. ✅ Implement quick inline actions
2. ✅ Add filtering and sorting logic
3. ✅ Create connector management interface
4. ✅ Add state management with Zustand

### ✅ Phase 4: Polish - COMPLETED
1. ✅ Add animations and transitions
2. ✅ Implement responsive design
3. ✅ Add loading states and error handling
4. ✅ Performance optimization

## Current Implementation

The application is fully functional with all core features implemented:

- **Unified Mentions Feed**: Displays mentions split into Priority and Later sections
  - Smart tag badges (Action Needed, Critical Info, Resolved, Others)
  - Visual grouping for mentions with similar context
  - Thread state indicators (new in thread vs ongoing thread)
  - Sender role display
  - Priority factor badges (VIP indicator)
- **Context Preview**: Right sidebar (always visible, 384px width) shows detailed mention information and actions
  - Auto-selects first mention on page load
  - Maintains selection when filtering unless filtered out
  - Updates to first available mention when current selection is filtered out
  - Shows empty state when no mentions are available
  - Manual context correction dropdown (UI only for prototyping)
  - Priority factors display with detailed explanations
- **Smart Tagging & Context Detection**: Auto-detects context using signal phrase analysis
  - Action needed, information, and resolved contexts
  - Computed tag types based on context and priority
  - Mock implementation suitable for prototyping
- **Auto-Prioritization**: Displays priority factors including:
  - Sender importance (based on role)
  - Urgency signals (detected phrases)
  - Solo responsibility indicators
- **Filtering & Sorting**: Complete filtering by source, type, time, and sorting options
- **Quick Actions**: Mark as done, archive, and open source functionality
- **Connector Management**: Priority assignment and enable/disable toggles
- **State Management**: Zustand store for all application state with smart default selection
- **Responsive Design**: Works on desktop and mobile devices

### Design System

The UI follows a Linear-inspired design aesthetic:

- **Color Palette**: 
  - Background: `#0d0d0d` (dark mode)
  - Foreground: `#e4e4e7`
  - Accent: `#5e6ad2` (purple)
  - Muted: `#a1a1aa`
  - Borders: `#27272a` and `#1c1c1f`
  - Card Background: `#18181b`

- **Typography**:
  - Font: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
  - Base size: 14px with precise sizing (`text-[13px]`, `text-[12px]`)
  - Font smoothing enabled for crisp text

- **Components**:
  - Minimal borders with subtle shadows
  - Smooth transitions (150ms cubic-bezier)
  - Clean hover states with subtle background changes
  - Consistent spacing using Tailwind's spacing scale
  - Custom scrollbars matching the design aesthetic
  - Custom styled checkboxes with proper dark mode visibility
    - 16px × 16px size with 1.5px borders
    - Gray border (#52525b) on unchecked state with dark background (#18181b)
    - Purple background (#5e6ad2) when checked
    - Smooth hover states with purple tint
    - White checkmark icon on checked state
    - Full toggle functionality (check/uncheck)

- **Interactions**:
  - Checkbox-based task completion (Linear-style)
  - Hover-reveal actions on mention items
  - Smooth animations on all interactive elements
  - Backdrop blur effects on headers and modals

## Mock Data Strategy
- Create realistic mock data for all three connectors
- Include various mention types (direct mentions, assignments, thread responses)
- Simulate different priority levels and timestamps
- Include diverse content types and contexts
- **Context Detection**: Mock data uses signal phrase detection to auto-assign contexts
- **Priority Factors**: Mock data simulates various priority factors (VIP senders, urgency signals, solo responsibility)
- **Grouping**: Mock mentions are grouped by similar topics (e.g., "Database Migration Project", "Feature Requests")
- **Thread States**: Mix of new mentions in ongoing threads vs fresh thread mentions

## Future Considerations
- Real-time updates via WebSocket
- Advanced filtering options
- Bulk actions
- Integration with actual APIs
- Mobile responsiveness
- Offline support
