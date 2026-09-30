export type MeetingMinutesAttendee = {
  name: string;
  role?: string | undefined;
};

export type MeetingMinutesDiscussion = {
  topic: string;
  notes: string[];
  speaker?: string | undefined;
};

export type MeetingMinutesDecision = {
  number: number;
  decision: string;
  rationale?: string | undefined;
};

export type MeetingMinutesActionStatus = 'Not Started' | 'In Progress' | 'Complete';

export type MeetingMinutesActionItem = {
  task: string;
  owner: string;
  dueDate: string;
  status: MeetingMinutesActionStatus;
};

export type MeetingMinutesNextMeeting = {
  date: string;
  time: string;
  agenda?: string[] | undefined;
};

export type MeetingMinutesProps = {
  meetingTitle: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: MeetingMinutesAttendee[];
  absent?: MeetingMinutesAttendee[] | undefined;
  guests?: string[] | undefined;
  agenda: string[];
  discussions: MeetingMinutesDiscussion[];
  decisions: MeetingMinutesDecision[];
  actionItems: MeetingMinutesActionItem[];
  nextMeeting?: MeetingMinutesNextMeeting | undefined;
  preparedBy: string;
  distributionList?: string[] | undefined;
  accentColor?: string | undefined;
};
