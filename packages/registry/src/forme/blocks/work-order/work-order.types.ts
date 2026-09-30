export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type WorkOrderCustomer = {
  name: string;
  address: string;
  phone: string;
  email?: string | undefined;
  accountNumber?: string | undefined;
};

export type WorkOrderJobType =
  | 'Repair'
  | 'Installation'
  | 'Maintenance'
  | 'Inspection'
  | (string & {});

export type WorkOrderEquipment = {
  description: string;
  makeModel?: string | undefined;
  serialNumber?: string | undefined;
  location?: string | undefined;
};

export type WorkOrderPart = {
  partNumber: string;
  description: string;
  qty: number;
  unitPrice: number;
};

export type WorkOrderLabor = {
  description: string;
  technician: string;
  hours: number;
  rate: number;
};

export type WorkOrderData = {
  companyName: string;
  companyLogo?: string | undefined;
  workOrderNumber: string;
  date: string;
  priority: WorkOrderPriority;
  customer: WorkOrderCustomer;
  technician: string;
  jobType: WorkOrderJobType;
  equipment: WorkOrderEquipment;
  parts: WorkOrderPart[];
  labor: WorkOrderLabor[];
  taxRate?: number | undefined;
  technicianNotes?: string | undefined;
  customerNotes?: string | undefined;
  warrantyInfo?: string | undefined;
  accentColor?: string | undefined;
};
