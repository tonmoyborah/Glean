# Glean - Unified Mentions Feed

A unified mentions feed that aggregates all @-mentions and assignments from core tools (Slack, Email, Jira) into a single chronological feed, enabling users to preview context, mark done, snooze, or open the source without app-switching.

## Features

### ✅ Unified Mentions Feed
- **Single chronological feed** aggregating mentions and assignments from all connectors
- **Rich display elements**: sender, timestamp, source app, context snippet
- **Thread response grouping** with visual indicators
- **Priority highlighting** for high-priority connectors

### ✅ Context Preview
- **2-3 line preview** of surrounding conversation/document
- **Expandable details** in right sidebar
- **Full context** without app switching

### ✅ Quick Inline Actions
- **Mark as Done**: Mark item as completed
- **Snooze for later**: Temporarily hide item with time-based return
- **Open in source app**: Deep link to original context
- **Reply directly**: If connector supports it (Slack, Email)

### ✅ Filtering and Sorting
- **Filter by**:
  - Source app (Slack, Email, Jira)
  - Type (Mention, Assignment, Thread Response)
  - Time (Today, This Week, All)
- **Sort by**:
  - Recency (newest first)
  - Priority (connector + mention priority)
  - Manual (for future drag-and-drop)

### ✅ Connector Management
- **Connector selection**: Choose which connectors to display
- **Priority assignment**: Set priority levels (1-5) for different connectors
- **Status indicators**: Show connection status for each connector
- **Enable/disable**: Toggle connectors on/off

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd glean
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── MentionItem.tsx     # Individual mention component
│   ├── MentionsFeed.tsx    # Main feed component
│   ├── FilterControls.tsx  # Filtering and sorting controls
│   ├── ContextPreview.tsx  # Right sidebar context preview
│   └── ConnectorSettings.tsx # Connector management modal
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   └── mock-data.ts       # Mock data for development
└── store/
    └── mentions-store.ts  # Zustand state management
```

## Data Models

### MentionItem
```typescript
interface MentionItem {
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
```

### Connector
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

## Key Features Implementation

### 1. Unified Feed
- Chronological display of all mentions
- Visual grouping of thread responses
- Priority-based highlighting
- Real-time status updates

### 2. Context Preview
- Right sidebar with detailed mention information
- Full context without leaving the app
- Quick action buttons
- Source app integration

### 3. Filtering & Sorting
- Multi-criteria filtering
- Priority-based sorting
- Time-based filtering
- Connector-specific filtering

### 4. Connector Management
- Priority assignment (1-5 scale)
- Enable/disable toggles
- Connection status monitoring
- Last sync timestamps

## Future Enhancements

- **Real-time updates** via WebSocket
- **Advanced filtering** options (sender, keywords)
- **Bulk actions** (mark multiple as done)
- **Drag-and-drop** manual sorting
- **Mobile responsiveness** improvements
- **Offline support** with sync
- **Integration with actual APIs** (Slack, Gmail, Jira)
- **Advanced snooze options** (custom times, recurring)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Functional components with hooks
- Zustand for state management
- Lucide React for icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.