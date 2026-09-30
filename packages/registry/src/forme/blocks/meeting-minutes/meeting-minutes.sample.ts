import type { MeetingMinutesProps } from './meeting-minutes.types.ts';

export const sampleMeetingMinutesData: MeetingMinutesProps = {
  absent: [{ name: 'Casey Wu', role: 'QA Lead' }],
  accentColor: '#0891b2',
  actionItems: [
    {
      dueDate: 'Sep 19, 2026',
      owner: 'Jordan Lee',
      status: 'In Progress',
      task: 'Create pdfme integration RFC',
    },
    {
      dueDate: 'Sep 22, 2026',
      owner: 'Sam Patel',
      status: 'Not Started',
      task: 'Design community page wireframes',
    },
    {
      dueDate: 'Sep 26, 2026',
      owner: 'Alex Kim',
      status: 'Complete',
      task: 'Share Q2 outcomes deck with stakeholders',
    },
  ],
  agenda: [
    'Review Q2 outcomes',
    'Q3 feature priorities',
    'Resource allocation',
    'Timeline and milestones',
  ],
  attendees: [
    { name: 'Alex Kim', role: 'Product Lead' },
    { name: 'Jordan Lee', role: 'Engineering Lead' },
    { name: 'Sam Patel', role: 'Design Lead' },
  ],
  date: 'September 12, 2026',
  decisions: [
    {
      decision: 'Proceed with pdfme as second rendering base',
      number: 1,
      rationale: 'Better JSX support',
    },
    {
      decision: 'Allocate 2 engineers to PDF module full-time',
      number: 2,
    },
  ],
  discussions: [
    {
      notes: ['Shipped 4 of 5 planned features', 'Customer satisfaction up 12%'],
      speaker: 'Alex Kim',
      topic: 'Q2 Outcomes',
    },
    {
      notes: ['PDF generation module is top priority', 'Community page scheduled for late Q3'],
      speaker: 'Jordan Lee',
      topic: 'Q3 Feature Priorities',
    },
  ],
  distributionList: ['product-team@acme.com', 'eng-leads@acme.com'],
  guests: ['Riya Shah (Advisor)'],
  location: 'Conference Room B / Zoom',
  meetingTitle: 'Q3 Product Roadmap Review',
  nextMeeting: {
    agenda: ['Review action items', 'pdfme RFC walkthrough'],
    date: 'September 19, 2026',
    time: '2:00 PM',
  },
  organizer: 'Alex Kim',
  preparedBy: 'Alex Kim',
  time: '2:00 PM - 3:30 PM',
};
