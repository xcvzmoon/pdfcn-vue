export type PressReleaseDateline = {
  city: string;
  state: string;
};

export type PressReleaseQuote = {
  text: string;
  author: string;
  title: string;
};

export type PressReleaseMediaContact = {
  name: string;
  email: string;
  phone: string;
  website?: string | undefined;
};

export type PressReleaseSocialLink = {
  platform: string;
  url: string;
};

export type PressReleaseProps = {
  companyName: string;
  companyLogo?: string | undefined;
  date: string;
  headline: string;
  subheadline?: string | undefined;
  dateline: PressReleaseDateline;
  body: string[];
  quotes?: PressReleaseQuote[] | undefined;
  boilerplate: string;
  mediaContact: PressReleaseMediaContact;
  address?: string | undefined;
  socialLinks?: PressReleaseSocialLink[] | undefined;
  accentColor?: string | undefined;
};
