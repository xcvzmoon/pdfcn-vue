import type { PackingSlipProps } from './packing-slip.types.ts';

export const samplePackingSlipData: PackingSlipProps = {
  accentColor: '#059669',
  companyName: 'Acme Store',
  customerService: 'support@acme-store.com',
  items: [
    {
      name: 'Widget Pro',
      qtyOrdered: 2,
      qtyPacked: 2,
      sku: 'WP-001',
      unitPrice: 49.99,
    },
    {
      name: 'Gadget Lite',
      qtyOrdered: 1,
      qtyPacked: 1,
      sku: 'GL-010',
      unitPrice: 29.99,
    },
    {
      name: 'Cable Kit',
      qtyOrdered: 3,
      qtyPacked: 2,
      sku: 'CK-204',
      unitPrice: 9.5,
    },
  ],
  orderDate: 'Sep 10, 2026',
  orderNumber: 'ORD-2026-0891',
  poNumber: 'PO-4471',
  returnsPolicy: 'Returns accepted within 30 days with original packaging.',
  shipFrom: {
    address: '100 Industrial Blvd',
    city: 'Seattle',
    name: 'Acme Warehouse',
    state: 'WA',
    zip: '98101',
  },
  shipTo: {
    address: '456 Oak Ave',
    city: 'Portland',
    name: 'Jane Doe',
    phone: '(503) 555-0142',
    state: 'OR',
    zip: '97201',
  },
  shipping: {
    carrier: 'UPS',
    estimatedDelivery: 'Sep 15, 2026',
    method: 'Ground',
    trackingNumber: '1Z999AA10123456784',
  },
  thankYouMessage: 'Thank you for your order!',
  totalPackages: 1,
  totalWeight: '3.2 kg',
};
