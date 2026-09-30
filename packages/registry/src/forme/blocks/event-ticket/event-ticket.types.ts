export type EventTicketSeat = {
  number: string;
  row: string;
  section: string;
};

export type EventTicketSocialLink = {
  platform: string;
  url: string;
};

export type EventTicketData = {
  accentColor?: string | undefined;
  address: string;
  doorsOpen?: string | undefined;
  eventName: string;
  eventDate: string;
  eventTime: string;
  logoUrl?: string | undefined;
  organizer?: string | undefined;
  qrCodeUrl?: string | undefined;
  seat?: EventTicketSeat | undefined;
  socialLinks?: EventTicketSocialLink[] | undefined;
  terms?: string | undefined;
  ticketNumber: string;
  ticketType: string;
  venue: string;
};
