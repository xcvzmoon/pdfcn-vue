import type { PressReleaseProps } from './press-release.types.ts';

export const samplePressReleaseData: PressReleaseProps = {
  accentColor: '#1e40af',
  address: '123 Market St, San Francisco, CA 94103',
  body: [
    'Acme Corp today announced the launch of pdfcn, an open-source component library for generating professional PDF documents.',
    'pdfcn is designed to work seamlessly with shadcn/ui and follows the same registry-based distribution model, letting developers add print-ready document blocks with a single CLI command.',
    'The initial release ships with invoice, report, event, and education blocks, with more templates arriving monthly.',
  ],
  boilerplate:
    'Acme Corp is a leading provider of developer tools and open-source software used by more than 40,000 engineering teams worldwide.',
  companyName: 'Acme Corp',
  date: 'September 10, 2026',
  dateline: { city: 'San Francisco', state: 'CA' },
  headline: 'Acme Corp Launches Revolutionary PDF Toolkit for Developers',
  mediaContact: {
    email: 'press@acme.com',
    name: 'Press Team',
    phone: '(555) 123-4567',
    website: 'https://acme.com/press',
  },
  quotes: [
    {
      author: 'Jane Doe',
      text: 'We built pdfcn because generating PDFs was unnecessarily painful. Now it feels like writing any other component.',
      title: 'CTO, Acme Corp',
    },
    {
      author: 'Marcus Chen',
      text: 'Our design system finally has a print story that matches the quality of our web product.',
      title: 'Head of Design, Acme Corp',
    },
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/acme' },
    { platform: 'X', url: 'https://x.com/acme' },
  ],
  subheadline: 'New open-source library makes generating professional PDFs effortless',
};
