import type { ShippingLabelData } from './shipping-label.types.ts';

export const sampleShippingLabelData: ShippingLabelData = {
  carrier: 'UPS',
  dimensions: '12" x 8" x 6"',
  from: {
    address: '456 Industrial Blvd',
    city: 'Los Angeles',
    country: 'USA',
    name: 'ACME Corporation',
    state: 'CA',
    zip: '90001',
  },
  handlingLabels: ['FRAGILE', 'THIS SIDE UP'],
  packageCount: 1,
  postage: '$18.40',
  serviceLevel: 'Ground',
  to: {
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    country: 'USA',
    name: 'John Doe',
    phone: '(503) 555-0142',
    state: 'NY',
    zip: '10001',
  },
  trackingNumber: 'TRACK123456789US',
  weight: '2.5 kg',
};
