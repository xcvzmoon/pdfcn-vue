export type PackingSlipRecipient = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string | undefined;
  phone?: string | undefined;
};

export type PackingSlipSender = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type PackingSlipItem = {
  name: string;
  sku: string;
  qtyPacked: number;
  qtyOrdered: number;
  unitPrice: number;
};

export type PackingSlipShipping = {
  carrier: string;
  trackingNumber: string;
  method: string;
  estimatedDelivery?: string | undefined;
};

export type PackingSlipProps = {
  companyName: string;
  companyLogo?: string | undefined;
  orderNumber: string;
  orderDate: string;
  poNumber?: string | undefined;
  shipTo: PackingSlipRecipient;
  shipFrom: PackingSlipSender;
  items: PackingSlipItem[];
  shipping: PackingSlipShipping;
  totalPackages?: number | undefined;
  totalWeight?: string | undefined;
  returnsPolicy?: string | undefined;
  customerService?: string | undefined;
  thankYouMessage?: string | undefined;
  accentColor?: string | undefined;
};
