export type InvoiceConsultantClient = {
  name: string;
  company: string;
  address: string;
  email: string;
};

export type InvoiceConsultantIdentity = {
  name: string;
  title: string;
  email: string;
};

export type InvoiceConsultantService = {
  description: string;
  hours: number;
  rate: number;
};

export type InvoiceConsultantSummary = {
  totalHours: number;
  subtotal: number;
  tax: number;
  total: number;
};

export type InvoiceConsultantPaymentTerms = {
  dueDate: string;
  method: string;
};

export type InvoiceConsultantData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  subtitle: string;
  companyAddress: string;
  consultant: InvoiceConsultantIdentity;
  client: InvoiceConsultantClient;
  services: InvoiceConsultantService[];
  summary: InvoiceConsultantSummary;
  paymentTerms: InvoiceConsultantPaymentTerms;
  projectRef?: string | undefined;
  notes?: string | undefined;
};
