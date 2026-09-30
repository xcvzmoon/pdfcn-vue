export type GiftCertificateData = {
  companyName: string;
  companyLogo?: string | undefined;
  amount: number;
  currency?: string | undefined;
  recipientName: string;
  senderName: string;
  message?: string | undefined;
  certificateCode: string;
  expiryDate: string;
  redemptionInstructions?: string | undefined;
  terms?: string | undefined;
  companyContact?: string | undefined;
  accentColor?: string | undefined;
};
