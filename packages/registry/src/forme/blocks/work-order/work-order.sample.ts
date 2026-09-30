import type { WorkOrderData } from './work-order.types.ts';

export const sampleWorkOrderData: WorkOrderData = {
  accentColor: '#ea580c',
  companyName: 'FixIt Pro Services',
  customer: {
    accountNumber: 'ACC-10234',
    address: '789 Elm St, Austin, TX 78701',
    name: 'Riverside Apartments',
    phone: '(512) 555-0199',
  },
  customerNotes: 'Please service before end of month lease inspection.',
  date: 'September 10, 2026',
  equipment: {
    description: 'Commercial Dishwasher',
    location: 'Kitchen — Unit 4B',
    makeModel: 'Bosch SHP878ZD5N',
    serialNumber: 'BSH-2024-88712',
  },
  jobType: 'Repair',
  labor: [
    {
      description: 'Diagnosis and repair',
      hours: 2.5,
      rate: 95,
      technician: 'Mike Torres',
    },
  ],
  parts: [
    {
      description: 'Drain Pump Assembly',
      partNumber: 'PUMP-001',
      qty: 1,
      unitPrice: 89.99,
    },
    {
      description: 'Drain Hose Kit',
      partNumber: 'HOSE-012',
      qty: 1,
      unitPrice: 24.5,
    },
  ],
  priority: 'High',
  taxRate: 0.0825,
  technician: 'Mike Torres',
  technicianNotes: 'Found clogged drain pump. Replaced pump and hose. Unit tested OK.',
  warrantyInfo: '90-day warranty on parts and labor.',
  workOrderNumber: 'WO-2026-0452',
};
