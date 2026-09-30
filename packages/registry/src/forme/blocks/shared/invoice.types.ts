export type InvoiceParty = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceSummary = {
  subtotal: number;
  tax: number;
  total: number;
};

export type InvoicePaymentTerms = {
  dueDate: string;
  method: string;
  gst: string;
};

export type InvoiceBaseData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  subtitle: string;
  companyAddress: string;
  companyEmail: string;
  billTo: InvoiceParty;
  items: InvoiceLineItem[];
  summary: InvoiceSummary;
  paymentTerms: InvoicePaymentTerms;
  notes?: string | undefined;
};
