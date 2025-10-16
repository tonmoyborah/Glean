import { MentionItem, Connector } from './types';

export const mockConnectors: Connector[] = [
  {
    id: 'slack-1',
    name: 'Slack',
    type: 'slack',
    isEnabled: true,
    priority: 5,
    isConnected: true,
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: 'email-1',
    name: 'Gmail',
    type: 'email',
    isEnabled: true,
    priority: 4,
    isConnected: true,
    lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: 'jira-1',
    name: 'Jira',
    type: 'jira',
    isEnabled: true,
    priority: 3,
    isConnected: true,
    lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
];

export const mockMentions: MentionItem[] = [
  // High priority Slack mentions
  {
    id: 'slack-1',
    type: 'mention',
    source: 'slack',
    sender: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      email: 'sarah.chen@company.com',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    title: 'Urgent: Database migration needs review',
    content: '@john can you review the database migration script? We need to deploy this by EOD.',
    context: 'We\'re planning to migrate the production database this weekend. The script has been tested in staging but needs your final approval before we proceed.',
    isThreadResponse: false,
    priority: 'high',
    status: 'unread',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.slack.com/archives/C1234567890/p1234567890123456',
    },
  },
  {
    id: 'slack-2',
    type: 'thread_response',
    source: 'slack',
    sender: {
      name: 'Mike Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      email: 'mike.rodriguez@company.com',
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    title: 'Re: Database migration needs review',
    content: 'I\'ve reviewed the script and it looks good. One small suggestion: add a rollback procedure.',
    context: 'The migration script looks solid. I\'ve tested it in our dev environment and everything works as expected. Just make sure we have a rollback plan.',
    threadId: 'slack-1',
    isThreadResponse: true,
    priority: 'medium',
    status: 'unread',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.slack.com/archives/C1234567890/p1234567890123457',
    },
  },
  // Email mentions
  {
    id: 'email-1',
    type: 'assignment',
    source: 'email',
    sender: {
      name: 'Lisa Wang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      email: 'lisa.wang@company.com',
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    title: 'Action Required: Q4 Budget Review',
    content: 'Hi John, I need you to review and approve the Q4 budget allocation for the engineering team.',
    context: 'The Q4 budget has been prepared and needs your review. Please review the attached spreadsheet and provide your feedback by Friday.',
    isThreadResponse: false,
    priority: 'high',
    status: 'unread',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://mail.google.com/mail/u/0/#inbox/1234567890abcdef',
    },
  },
  {
    id: 'email-2',
    type: 'mention',
    source: 'email',
    sender: {
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      email: 'david.kim@company.com',
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    title: 'FYI: New security policy update',
    content: 'Hi team, just wanted to let you know about the new security policy that goes into effect next week.',
    context: 'We\'ve updated our security policies to align with industry best practices. Please review the attached document and ensure your team is aware of the changes.',
    isThreadResponse: false,
    priority: 'medium',
    status: 'read',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://mail.google.com/mail/u/0/#inbox/1234567890abcdef',
    },
  },
  // Jira mentions
  {
    id: 'jira-1',
    type: 'assignment',
    source: 'jira',
    sender: {
      name: 'System',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System',
      email: 'system@company.com',
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    title: 'Bug: Login page not loading on mobile',
    content: 'You have been assigned to investigate and fix the login page issue on mobile devices.',
    context: 'Users are reporting that the login page is not loading properly on mobile devices. The issue appears to be related to the responsive design implementation.',
    isThreadResponse: false,
    priority: 'high',
    status: 'unread',
    actions: {
      canReply: false,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.atlassian.net/browse/BUG-1234',
    },
  },
  {
    id: 'jira-2',
    type: 'mention',
    source: 'jira',
    sender: {
      name: 'Alex Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      email: 'alex.thompson@company.com',
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    title: 'Feature Request: Dark mode support',
    content: 'Can we add dark mode support to the application? This would improve user experience significantly.',
    context: 'Users have been requesting dark mode support for the application. This would be a great addition to improve accessibility and user experience.',
    isThreadResponse: false,
    priority: 'medium',
    status: 'read',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.atlassian.net/browse/FEAT-5678',
    },
  },
  // More mentions for variety
  {
    id: 'slack-3',
    type: 'mention',
    source: 'slack',
    sender: {
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      email: 'emma.wilson@company.com',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    title: 'Meeting reminder: Sprint planning',
    content: '@john don\'t forget about our sprint planning meeting at 2 PM today.',
    context: 'We have our weekly sprint planning meeting scheduled for 2 PM today. Please prepare your user stories and be ready to discuss priorities.',
    isThreadResponse: false,
    priority: 'low',
    status: 'read',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.slack.com/archives/C1234567890/p1234567890123458',
    },
  },
  {
    id: 'email-3',
    type: 'assignment',
    source: 'email',
    sender: {
      name: 'HR Team',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR',
      email: 'hr@company.com',
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    title: 'Action Required: Performance review',
    content: 'Your annual performance review is due next week. Please complete the self-assessment form.',
    context: 'The annual performance review process has begun. Please complete your self-assessment form and submit it by the end of next week.',
    isThreadResponse: false,
    priority: 'medium',
    status: 'unread',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://mail.google.com/mail/u/0/#inbox/1234567890abcdef',
    },
  },
  {
    id: 'jira-3',
    type: 'thread_response',
    source: 'jira',
    sender: {
      name: 'Maria Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      email: 'maria.garcia@company.com',
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    title: 'Re: Feature Request: Dark mode support',
    content: 'I agree! Dark mode would be a great addition. I can help with the design mockups.',
    context: 'I completely agree with this feature request. Dark mode would significantly improve the user experience, especially for users who work in low-light environments.',
    threadId: 'jira-2',
    isThreadResponse: true,
    priority: 'low',
    status: 'read',
    actions: {
      canReply: true,
      canMarkDone: true,
      canSnooze: true,
      sourceUrl: 'https://company.atlassian.net/browse/FEAT-5678',
    },
  },
];
