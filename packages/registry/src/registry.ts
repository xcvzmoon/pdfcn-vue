/**
 * Source-of-truth catalog for shadcn-vue registry distribution.
 *
 * Paths are relative to `packages/registry/src`. The build tool maps each
 * source path to an install path under `registry/lib/pdfcn` or
 * `registry/components/pdf`, rewrites internal imports to `@/` aliases, and
 * derives npm / registry dependencies from the import graph.
 */

export type RegistryItemType =
  | 'registry:lib'
  | 'registry:component'
  | 'registry:block'
  | 'registry:theme'
  | 'registry:hook'
  | 'registry:ui';

export type RegistryItemSource = {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  categories: readonly string[];
  /** Source paths relative to `packages/registry/src`. */
  files: readonly string[];
  docs?: string;
};

export type RegistryCatalog = {
  $schema: string;
  name: string;
  homepage: string;
  items: readonly RegistryItemSource[];
};

export const REGISTRY_SCHEMA_URL = 'https://shadcn-vue.com/schema/registry.json';

const THEME_PRESETS = [
  ['modern', 'Modern', 'themes/modern.ts'],
  ['minimal', 'Minimal', 'themes/minimal.ts'],
  ['executive', 'Executive', 'themes/executive.ts'],
  ['corporate', 'Corporate', 'themes/corporate.ts'],
  ['elegant', 'Elegant', 'themes/elegant.ts'],
  ['vivid', 'Vivid', 'themes/vivid.ts'],
  ['forest', 'Forest', 'themes/forest.ts'],
  ['blueprint', 'Blueprint', 'themes/blueprint.ts'],
] as const;

function titleFromName(name: string): string {
  return name
    .split('-')
    .map((part) => (part.length === 0 ? '' : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}

function componentItem(
  name: string,
  title: string,
  description: string,
  files: readonly string[],
  categories: readonly string[] = ['component'],
): RegistryItemSource {
  return {
    name,
    type: 'registry:component',
    title,
    description,
    categories,
    files,
  };
}

function blockItem(
  name: string,
  directory: string,
  extraFiles: readonly string[] = [],
): RegistryItemSource {
  const base = [
    `${directory}/${titleFromName(name).replaceAll(' ', '')}.vue`,
    `${directory}/${name}.types.ts`,
    `${directory}/${name}.sample.ts`,
  ];
  return {
    name,
    type: 'registry:block',
    title: titleFromName(name),
    description: `The ${titleFromName(name)} document block with sample data.`,
    categories: ['block'],
    files: [...base, ...extraFiles],
  };
}

export const registryCatalog: RegistryCatalog = {
  $schema: REGISTRY_SCHEMA_URL,
  name: 'pdfcn-vue',
  homepage: 'https://github.com/shadcn-labs/pdfcn',
  items: [
    {
      name: 'pdfcn-core',
      type: 'registry:lib',
      title: 'pdfcn core',
      description:
        'Shared PDF theme types, color resolution, style helpers, and the default professional theme.',
      categories: ['lib', 'theme'],
      files: [
        'types/pdf-themes.ts',
        'forme/lib/theme.ts',
        'forme/lib/resolve-color.ts',
        'forme/lib/styles.ts',
        'themes/primitives.ts',
        'themes/professional.ts',
      ],
      docs: 'Install this first. Every pdfcn component resolves theme tokens through it.',
    },
    componentItem(
      'theme-provider',
      'PdfcnThemeProvider',
      'Provide a PdfcnTheme to all pdfcn components under the provider.',
      ['forme/components/PdfcnThemeProvider.vue'],
      ['theme', 'component'],
    ),
    ...THEME_PRESETS.map(([name, title, themePath]): RegistryItemSource => ({
      name: `theme-${name}`,
      type: 'registry:lib',
      title: `${title} theme`,
      description: `The ${title.toLowerCase()} PdfcnTheme preset.`,
      categories: ['theme'],
      files: [themePath],
    })),
    componentItem('text', 'Text', 'Body text with theme-aware typography and color.', [
      'forme/components/Text.vue',
    ]),
    componentItem('heading', 'Heading', 'Document headings (H1–H6) with theme scale.', [
      'forme/components/Heading.vue',
    ]),
    componentItem('stack', 'Stack', 'Vertical or horizontal stack layout primitive.', [
      'forme/components/Stack.vue',
    ]),
    componentItem('section', 'Section', 'Titled section container with spacing from the theme.', [
      'forme/components/Section.vue',
    ]),
    componentItem('divider', 'Divider', 'Horizontal or vertical divider with theme colors.', [
      'forme/components/Divider.vue',
      'forme/components/DividerLine.vue',
    ]),
    componentItem('page-break', 'PageBreak', 'Explicit page break for multi-page documents.', [
      'forme/components/PageBreak.vue',
    ]),
    componentItem(
      'keep-together',
      'KeepTogether',
      'Keep child content on the same page when possible.',
      ['forme/components/KeepTogether.vue'],
    ),
    componentItem('link', 'Link', 'External or internal PDF link.', ['forme/components/Link.vue']),
    componentItem('list', 'List', 'Ordered and unordered lists with nested items.', [
      'forme/components/PdfList.vue',
      'forme/components/PdfListItems.vue',
      'forme/components/list.types.ts',
    ]),
    componentItem('card', 'Card', 'Bordered or muted content card.', [
      'forme/components/Card.vue',
      'forme/components/card.types.ts',
    ]),
    componentItem('badge', 'Badge', 'Compact status or category label.', [
      'forme/components/Badge.vue',
      'forme/components/badge.types.ts',
    ]),
    componentItem('alert', 'Alert', 'Inline callout with tone variants.', [
      'forme/components/Alert.vue',
      'forme/components/alert.types.ts',
    ]),
    componentItem('key-value', 'KeyValue', 'Aligned label/value pairs for metadata blocks.', [
      'forme/components/KeyValue.vue',
      'forme/components/key-value.types.ts',
    ]),
    componentItem(
      'table',
      'Table',
      'Semantic table primitives (header, body, row, cell, footer).',
      [
        'forme/components/Table.vue',
        'forme/components/TableHeader.vue',
        'forme/components/TableBody.vue',
        'forme/components/TableFooter.vue',
        'forme/components/TableRow.vue',
        'forme/components/TableCell.vue',
        'forme/components/table-context.ts',
        'forme/components/table.styles.ts',
        'forme/components/table.types.ts',
      ],
    ),
    componentItem(
      'data-table',
      'DataTable',
      'Column-driven data table with compact styles and footers.',
      [
        'forme/components/DataTable.vue',
        'forme/components/data-table.styles.ts',
        'forme/components/data-table.types.ts',
      ],
    ),
    componentItem('form', 'Form', 'Printable form fields and field groups.', [
      'forme/components/PdfForm.vue',
      'forme/components/form.types.ts',
    ]),
    componentItem(
      'graph',
      'Graph',
      'Chart wrapper (bar, line, area, pie) over Forme chart primitives.',
      [
        'forme/components/Graph.vue',
        'forme/components/graph.types.ts',
        'forme/components/graph.utils.ts',
      ],
    ),
    componentItem('qrcode', 'QrCode', 'QR code with optional caption.', [
      'forme/components/QrCode.vue',
    ]),
    componentItem('pdf-image', 'PdfImage', 'Image with fit modes and caption support.', [
      'forme/components/PdfImage.vue',
      'forme/components/pdf-image.types.ts',
    ]),
    componentItem(
      'page-header',
      'PageHeader',
      'Fixed page header with logo, title, and meta slots.',
      ['forme/components/PageHeader.vue', 'forme/components/page-chrome.types.ts'],
      ['chrome', 'component'],
    ),
    componentItem(
      'page-footer',
      'PageFooter',
      'Fixed page footer with variant layouts.',
      ['forme/components/PageFooter.vue', 'forme/components/page-chrome.types.ts'],
      ['chrome', 'component'],
    ),
    componentItem(
      'page-number',
      'PageNumber',
      'Page number / total pages chrome.',
      ['forme/components/PageNumber.vue', 'forme/components/page-chrome.types.ts'],
      ['chrome', 'component'],
    ),
    componentItem(
      'watermark',
      'Watermark',
      'Diagonal or centered watermark text.',
      ['forme/components/Watermark.vue'],
      ['chrome', 'component'],
    ),
    componentItem('signature', 'Signature', 'Signature block with signer metadata.', [
      'forme/components/Signature.vue',
      'forme/components/signature.types.ts',
    ]),
    {
      name: 'block-shared',
      type: 'registry:lib',
      title: 'Block shared helpers',
      description: 'Shared formatters and layout used by report and invoice blocks.',
      categories: ['block', 'lib'],
      files: [
        'forme/blocks/shared/format.ts',
        'forme/blocks/shared/invoice.types.ts',
        'forme/blocks/shared/report.types.ts',
        'forme/blocks/shared/ReportLayout.vue',
        'forme/blocks/shared/index.ts',
      ],
    },
    blockItem('invoice-minimal', 'forme/blocks/invoice-minimal'),
    blockItem('invoice-classic', 'forme/blocks/invoice-classic'),
    blockItem('invoice-modern', 'forme/blocks/invoice-modern'),
    blockItem('invoice-corporate', 'forme/blocks/invoice-corporate'),
    blockItem('invoice-creative', 'forme/blocks/invoice-creative'),
    blockItem('invoice-consultant', 'forme/blocks/invoice-consultant'),
    blockItem('report-financial', 'forme/blocks/report-financial'),
    blockItem('report-marketing', 'forme/blocks/report-marketing'),
    blockItem('report-operations', 'forme/blocks/report-operations'),
    blockItem('report-security', 'forme/blocks/report-security'),
    blockItem('event-agenda', 'forme/blocks/event-agenda', [
      'forme/blocks/event-agenda/AgendaSession.vue',
    ]),
    blockItem('event-ticket', 'forme/blocks/event-ticket'),
    blockItem('gift-certificate', 'forme/blocks/gift-certificate'),
    blockItem('lesson-plan', 'forme/blocks/lesson-plan'),
    blockItem('medical-intake-form', 'forme/blocks/medical-intake-form'),
    blockItem('meeting-minutes', 'forme/blocks/meeting-minutes'),
    blockItem('packing-slip', 'forme/blocks/packing-slip'),
    blockItem('press-release', 'forme/blocks/press-release'),
    blockItem('shipping-label', 'forme/blocks/shipping-label'),
    blockItem('work-order', 'forme/blocks/work-order'),
  ],
};
