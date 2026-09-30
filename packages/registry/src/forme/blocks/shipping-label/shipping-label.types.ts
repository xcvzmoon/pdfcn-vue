export type ShippingLabelAddress = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string | undefined;
};

export type ShippingLabelDestination = ShippingLabelAddress & {
  phone?: string | undefined;
};

export type ShippingLabelData = {
  from: ShippingLabelAddress;
  to: ShippingLabelDestination;
  carrier: string;
  serviceLevel: string;
  trackingNumber: string;
  barcodeUrl?: string | undefined;
  weight?: string | undefined;
  dimensions?: string | undefined;
  packageCount?: number | undefined;
  handlingLabels?: string[] | undefined;
  postage?: string | undefined;
  accentColor?: string | undefined;
};
