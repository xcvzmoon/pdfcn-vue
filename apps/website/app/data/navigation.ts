export type DocsNavItem = { title: string; href: string };
export type DocsNavSection = { label: string; items: DocsNavItem[] };
export const docsNav: DocsNavSection[] = [
  {
    label: 'Get started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Rendering PDFs', href: '/docs/rendering' },
      { title: 'Takumi rendering', href: '/docs/takumi' },
      { title: 'PDF standards', href: '/docs/pdf-standards' },
      { title: 'Fillable forms', href: '/docs/fillable-forms' },
      { title: 'Agent discovery', href: '/docs/agents' },
      { title: 'Nuxt integration', href: '/docs/nuxt' },
      { title: 'Registry', href: '/docs/registry' },
    ],
  },
  {
    label: 'Design your document',
    items: [
      { title: 'Theming', href: '/docs/theming' },
      { title: 'Theme builder ↗', href: '/theme-builder' },
    ],
  },
  {
    label: 'The library',
    items: [
      { title: 'Components', href: '/docs/components' },
      { title: 'Blocks', href: '/docs/blocks' },
    ],
  },
];
