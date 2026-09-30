export type EventAgendaSession = {
  description?: string | undefined;
  endTime?: string | undefined;
  isBreak?: boolean | undefined;
  room?: string | undefined;
  speaker?: string | undefined;
  time: string;
  title: string;
  track?: string | undefined;
};

export type EventAgendaDaySchedule = {
  date: string;
  label: string;
  sessions: EventAgendaSession[];
};

export type EventAgendaTrack = {
  color: string;
  name: string;
};

export type EventAgendaProps = {
  accentColor?: string | undefined;
  date: string;
  days: EventAgendaDaySchedule[];
  emergencyContact?: string | undefined;
  endDate?: string | undefined;
  eventName: string;
  tracks?: EventAgendaTrack[] | undefined;
  venue: string;
  wifiInfo?: string | undefined;
};
