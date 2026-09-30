import type { InvoiceConsultantData } from './invoice-consultant.types.ts';

export const sampleInvoiceConsultantData: InvoiceConsultantData = {
  client: {
    address: '500 Tech Park, Suite 200',
    company: 'Acme Technologies',
    email: 'sarah.johnson@acmetech.com',
    name: 'Sarah Johnson',
  },
  companyAddress: 'Nagpur, IN · hello@pdfcn-vue.app',
  companyName: 'pdfcn-vue',
  consultant: {
    email: 'john.smith@pdfcn-vue.app',
    name: 'John Smith',
    title: 'Senior Technical Consultant',
  },
  dueDate: 'March 28, 2026',
  invoiceDate: 'February 26, 2026',
  invoiceNumber: 'INV-2026-006',
  notes: 'Services rendered for February 2026. All hours verified and approved by client.',
  paymentTerms: {
    dueDate: 'March 28, 2026',
    method: 'Bank Transfer / Check',
  },
  projectRef: 'PROJ-2026-ACME-001',
  services: [
    { description: 'Architecture Review & Planning', hours: 16, rate: 175 },
    { description: 'Code Review & Optimization', hours: 24, rate: 150 },
    { description: 'Technical Documentation', hours: 12, rate: 125 },
    { description: 'Team Training & Knowledge Transfer', hours: 8, rate: 200 },
  ],
  subtitle: 'Professional Consulting Services',
  summary: {
    subtotal: 9500,
    tax: 475,
    total: 9975,
    totalHours: 60,
  },
};
