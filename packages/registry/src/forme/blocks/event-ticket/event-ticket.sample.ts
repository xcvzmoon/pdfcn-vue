import type { EventTicketData } from './event-ticket.types.ts';

export const sampleEventTicketData: EventTicketData = {
  accentColor: '#52525b',
  address: '123 Main St, Las Vegas, NV',
  doorsOpen: '8:00 AM',
  eventDate: 'May 15, 2026',
  eventName: 'ShadCN Labs Conf',
  eventTime: '9:00 AM',
  organizer: 'ShadCN Labs',
  seat: { number: '12', row: '3', section: 'A' },
  socialLinks: [
    { platform: 'X', url: 'x.com/shadcn' },
    { platform: 'Instagram', url: 'instagram.com/shadcn' },
  ],
  terms: 'Ticket is non-transferable. All sales final. No re-entry.',
  ticketNumber: 'TKT-00142',
  ticketType: 'VIP',
  venue: 'Convention Center',
};
