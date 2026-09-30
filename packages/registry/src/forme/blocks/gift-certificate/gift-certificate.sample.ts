import type { GiftCertificateData } from './gift-certificate.types.ts';

export const sampleGiftCertificateData: GiftCertificateData = {
  accentColor: '#0f766e',
  amount: 50,
  certificateCode: 'PDFCN-VUE-GC-2026-00891',
  companyName: 'Harbor Roasters',
  companyContact: 'hello@harborroasters.com · (555) 246-8100',
  currency: 'USD',
  expiryDate: 'March 31, 2027',
  message: 'Happy Birthday! Enjoy a coffee on us.',
  recipientName: 'Sarah',
  redemptionInstructions: 'Present this certificate at any Harbor Roasters location.',
  senderName: 'Mom & Dad',
  terms: 'No cash value. Non-refundable. One use per visit. Not valid with other offers.',
};
