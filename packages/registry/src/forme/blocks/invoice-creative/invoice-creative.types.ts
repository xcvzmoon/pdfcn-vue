import type {
  InvoiceLineItem,
  InvoiceParty,
  InvoicePaymentTerms,
  InvoiceSummary,
} from '../shared/invoice.types.ts';

export type InvoiceCreativeData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  subtitle: string;
  companyAddress: string;
  billTo: InvoiceParty;
  items: InvoiceLineItem[];
  summary: InvoiceSummary;
  paymentTerms: InvoicePaymentTerms;
  notes?: string | undefined;
};
