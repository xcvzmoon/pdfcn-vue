export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentDoc = {
  name: string;
  slug: string;
  title: string;
  description: string;
  category: 'layout' | 'primitives' | 'data' | 'chrome' | 'theme';
  install: string;
  importName: string;
  usage: string;
  props: PropRow[];
  sourcePaths: string[];
};

const layoutAndPrimitives: ComponentDoc[] = [
  {
    name: 'Text',
    slug: 'text',
    title: 'Text',
    description: 'Body text with theme-aware typography, color, and spacing.',
    category: 'primitives',
    install: 'text',
    importName: 'Text',
    usage: `<Text variant="lg" weight="medium">Invoice total</Text>
<Text color="mutedForeground" variant="sm">Due in 14 days</Text>`,
    props: [
      {
        name: 'variant',
        type: "'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'",
        default: 'body size',
        description: 'Typography scale step from the active theme.',
      },
      {
        name: 'align',
        type: "'left' | 'center' | 'right' | 'justify'",
        default: "'left'",
        description: 'Text alignment.',
      },
      {
        name: 'color',
        type: 'string',
        description: 'Theme color key (for example `primary`) or hex.',
      },
      {
        name: 'weight',
        type: "'normal' | 'medium' | 'semibold' | 'bold'",
        default: "'normal'",
        description: 'Font weight mapped through theme primitives.',
      },
      { name: 'italic', type: 'boolean', default: 'false', description: 'Italic style.' },
      {
        name: 'decoration',
        type: "'underline' | 'line-through' | 'none'",
        default: "'none'",
        description: 'Text decoration.',
      },
      {
        name: 'transform',
        type: "'uppercase' | 'lowercase' | 'capitalize'",
        description: 'Text transform.',
      },
      {
        name: 'noMargin',
        type: 'boolean',
        default: 'false',
        description: 'Remove the paragraph bottom margin.',
      },
      { name: 'style', type: 'Style', description: 'Escape hatch Forme style object merged last.' },
    ],
    sourcePaths: ['forme/components/Text.vue'],
  },
  {
    name: 'Heading',
    slug: 'heading',
    title: 'Heading',
    description: 'Document headings H1–H6 sized from the theme heading scale.',
    category: 'primitives',
    install: 'heading',
    importName: 'Heading',
    usage: `<Heading :level="2">Quarterly summary</Heading>
<Heading :level="3" tracking="tight">Revenue</Heading>`,
    props: [
      {
        name: 'level',
        type: '1 | 2 | 3 | 4 | 5 | 6',
        default: '1',
        description: 'Semantic heading level and type scale key.',
      },
      { name: 'align', type: "'left' | 'center' | 'right'", description: 'Heading alignment.' },
      { name: 'color', type: 'string', description: 'Theme color key or hex.' },
      {
        name: 'transform',
        type: "'uppercase' | 'lowercase' | 'capitalize'",
        description: 'Text transform.',
      },
      {
        name: 'weight',
        type: "'normal' | 'medium' | 'semibold' | 'bold'",
        default: "'bold'",
        description: 'Font weight.',
      },
      {
        name: 'tracking',
        type: "'tighter' | 'tight' | 'normal' | 'wide' | 'wider'",
        default: "'normal'",
        description: 'Letter-spacing scale.',
      },
      {
        name: 'noMargin',
        type: 'boolean',
        default: 'false',
        description: 'Remove vertical margins.',
      },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Heading.vue'],
  },
  {
    name: 'Stack',
    slug: 'stack',
    title: 'Stack',
    description: 'Flex stack with theme gap scale for vertical or horizontal layout.',
    category: 'layout',
    install: 'stack',
    importName: 'Stack',
    usage: `<Stack gap="lg">
  <Heading :level="3">Details</Heading>
  <Text>Aligned content</Text>
</Stack>`,
    props: [
      {
        name: 'gap',
        type: "'none' | 'sm' | 'md' | 'lg' | 'xl'",
        default: "'md'",
        description: 'Gap from primitive spacing scale.',
      },
      {
        name: 'direction',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Flex direction.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end' | 'stretch'",
        description: 'Cross-axis alignment.',
      },
      {
        name: 'justify',
        type: "'start' | 'center' | 'end' | 'between' | 'around'",
        description: 'Main-axis alignment.',
      },
      { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow flex wrap.' },
      {
        name: 'noWrap',
        type: 'boolean',
        default: 'false',
        description: 'Keep the stack on one page when possible.',
      },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Stack.vue'],
  },
  {
    name: 'Section',
    slug: 'section',
    title: 'Section',
    description: 'Titled section container with theme section spacing.',
    category: 'layout',
    install: 'section',
    importName: 'Section',
    usage: `<Section title="Line items">
  <Table>…</Table>
</Section>`,
    props: [
      { name: 'title', type: 'string', description: 'Optional section title.' },
      {
        name: 'description',
        type: 'string',
        description: 'Optional supporting line under the title.',
      },
      {
        name: 'spacing',
        type: "'compact' | 'default' | 'relaxed'",
        default: "'default'",
        description: 'Vertical rhythm around the section.',
      },
    ],
    sourcePaths: ['forme/components/Section.vue'],
  },
  {
    name: 'Divider',
    slug: 'divider',
    title: 'Divider',
    description: 'Horizontal or vertical rule with theme border color.',
    category: 'layout',
    install: 'divider',
    importName: 'Divider',
    usage: `<Divider />
<Divider orientation="vertical" />`,
    props: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Rule orientation.',
      },
      {
        name: 'thickness',
        type: 'number',
        default: 'theme',
        description: 'Stroke thickness in points.',
      },
      { name: 'color', type: 'string', description: 'Theme color key or hex.' },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Divider.vue', 'forme/components/DividerLine.vue'],
  },
  {
    name: 'PageBreak',
    slug: 'page-break',
    title: 'PageBreak',
    description: 'Explicit page break for multi-page documents.',
    category: 'layout',
    install: 'page-break',
    importName: 'PageBreak',
    usage: `<PageBreak />`,
    props: [],
    sourcePaths: ['forme/components/PageBreak.vue'],
  },
  {
    name: 'KeepTogether',
    slug: 'keep-together',
    title: 'KeepTogether',
    description: 'Keep child content on the same page when there is room.',
    category: 'layout',
    install: 'keep-together',
    importName: 'KeepTogether',
    usage: `<KeepTogether>
  <Card>…</Card>
</KeepTogether>`,
    props: [],
    sourcePaths: ['forme/components/KeepTogether.vue'],
  },
  {
    name: 'Link',
    slug: 'link',
    title: 'Link',
    description: 'External or internal PDF link with theme color.',
    category: 'primitives',
    install: 'link',
    importName: 'Link',
    usage: `<Link src="https://pdfcn-vue.example.com">Documentation</Link>`,
    props: [
      { name: 'src', type: 'string', description: 'Destination URL or PDF anchor.' },
      { name: 'color', type: 'string', description: 'Theme color key or hex.' },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Link.vue'],
  },
  {
    name: 'List',
    slug: 'list',
    title: 'List',
    description: 'Ordered and unordered lists with nested items.',
    category: 'primitives',
    install: 'list',
    importName: 'PdfList',
    usage: `<PdfList :items="[{ text: 'Ship invoice' }, { text: 'Archive copy' }]" />`,
    props: [
      {
        name: 'items',
        type: 'ListItem[]',
        description: 'List items, including nested `children`.',
      },
      {
        name: 'variant',
        type: "'unordered' | 'ordered'",
        default: "'unordered'",
        description: 'Bullet or numbered list.',
      },
      { name: 'marker', type: 'string', description: 'Custom marker for unordered lists.' },
    ],
    sourcePaths: ['forme/components/PdfList.vue', 'forme/components/list.types.ts'],
  },
  {
    name: 'Card',
    slug: 'card',
    title: 'Card',
    description: 'Bordered or muted content card for grouping document blocks.',
    category: 'primitives',
    install: 'card',
    importName: 'Card',
    usage: `<Card variant="bordered" padding="md">
  <Text>Card body</Text>
</Card>`,
    props: [
      {
        name: 'variant',
        type: "'default' | 'bordered' | 'muted'",
        default: "'default'",
        description: 'Visual treatment.',
      },
      {
        name: 'padding',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Inner padding scale.',
      },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Card.vue', 'forme/components/card.types.ts'],
  },
  {
    name: 'Badge',
    slug: 'badge',
    title: 'Badge',
    description: 'Compact status or category label.',
    category: 'primitives',
    install: 'badge',
    importName: 'Badge',
    usage: `<Badge variant="success">Paid</Badge>
<Badge variant="outline" size="sm">Draft</Badge>`,
    props: [
      {
        name: 'variant',
        type: "'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'",
        default: "'default'",
        description: 'Badge tone.',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Badge size.' },
    ],
    sourcePaths: ['forme/components/Badge.vue', 'forme/components/badge.types.ts'],
  },
  {
    name: 'Alert',
    slug: 'alert',
    title: 'Alert',
    description: 'Inline callout with tone variants.',
    category: 'primitives',
    install: 'alert',
    importName: 'Alert',
    usage: `<Alert variant="info" title="Payment received">ACH transfer posted.</Alert>`,
    props: [
      {
        name: 'variant',
        type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
        default: "'default'",
        description: 'Alert tone.',
      },
      { name: 'title', type: 'string', description: 'Optional bold title line.' },
    ],
    sourcePaths: ['forme/components/Alert.vue', 'forme/components/alert.types.ts'],
  },
  {
    name: 'KeyValue',
    slug: 'key-value',
    title: 'KeyValue',
    description: 'Aligned label/value pairs for metadata blocks.',
    category: 'data',
    install: 'key-value',
    importName: 'KeyValue',
    usage: `<KeyValue :items="[{ label: 'Invoice', value: 'INV-2026-003' }]" />`,
    props: [
      { name: 'items', type: 'KeyValueItem[]', description: 'Label/value pairs.' },
      {
        name: 'columns',
        type: 'number',
        default: '1',
        description: 'Column count for the pair grid.',
      },
      { name: 'labelWidth', type: 'number', description: 'Fixed label width in points.' },
    ],
    sourcePaths: ['forme/components/KeyValue.vue', 'forme/components/key-value.types.ts'],
  },
];

const dataComponents: ComponentDoc[] = [
  {
    name: 'Table',
    slug: 'table',
    title: 'Table',
    description: 'Semantic table primitives (header, body, row, cell, footer).',
    category: 'data',
    install: 'table',
    importName: 'Table',
    usage: `<Table variant="line">
  <TableHeader>…</TableHeader>
  <TableBody>…</TableBody>
</Table>`,
    props: [
      {
        name: 'variant',
        type: "'line' | 'grid' | 'striped' | 'minimal'",
        default: "'line'",
        description: 'Table visual style.',
      },
      { name: 'zebraStripe', type: 'boolean', default: 'false', description: 'Force zebra rows.' },
      {
        name: 'noWrap',
        type: 'boolean',
        default: 'false',
        description: 'Prevent page breaks inside the table.',
      },
      {
        name: 'columnCount',
        type: 'number',
        description: 'Explicit column count for equal widths.',
      },
      { name: 'style', type: 'Style', description: 'Merged Forme style override.' },
    ],
    sourcePaths: ['forme/components/Table.vue', 'forme/components/table.types.ts'],
  },
  {
    name: 'DataTable',
    slug: 'data-table',
    title: 'DataTable',
    description: 'Column-driven data table with compact styles and footers.',
    category: 'data',
    install: 'data-table',
    importName: 'DataTable',
    usage: `<DataTable :columns="columns" :rows="rows" :footer="footer" />`,
    props: [
      {
        name: 'columns',
        type: 'DataTableColumn[]',
        description: 'Column definitions (key, label, width, align).',
      },
      {
        name: 'rows',
        type: 'Record<string, unknown>[]',
        description: 'Row data matching column keys.',
      },
      { name: 'footer', type: 'DataTableFooter', description: 'Optional footer totals row.' },
      { name: 'dense', type: 'boolean', default: 'false', description: 'Tighter row padding.' },
    ],
    sourcePaths: ['forme/components/DataTable.vue', 'forme/components/data-table.types.ts'],
  },
  {
    name: 'Form',
    slug: 'form',
    title: 'Form',
    description: 'Printable form fields and field groups.',
    category: 'data',
    install: 'form',
    importName: 'PdfForm',
    usage: `<PdfForm :fields="fields" />`,
    props: [
      {
        name: 'fields',
        type: 'FormField[]',
        description: 'Field definitions for printable inputs.',
      },
      { name: 'columns', type: 'number', default: '1', description: 'Fields per row.' },
      { name: 'labels', type: 'boolean', default: 'true', description: 'Show field labels.' },
    ],
    sourcePaths: ['forme/components/PdfForm.vue', 'forme/components/form.types.ts'],
  },
  {
    name: 'Graph',
    slug: 'graph',
    title: 'Graph',
    description: 'Chart wrapper (bar, line, area, pie, donut) over Forme chart primitives.',
    category: 'data',
    install: 'graph',
    importName: 'Graph',
    usage: `<Graph variant="bar" :series="series" :width="480" :height="220" />`,
    props: [
      {
        name: 'variant',
        type: "'bar' | 'horizontal-bar' | 'line' | 'area' | 'pie' | 'donut'",
        default: "'bar'",
        description: 'Chart type.',
      },
      { name: 'series', type: 'GraphSeries[]', description: 'Named data series.' },
      { name: 'width', type: 'number', description: 'Chart width in points.' },
      { name: 'height', type: 'number', description: 'Chart height in points.' },
      {
        name: 'legend',
        type: "'bottom' | 'right' | 'none'",
        default: "'bottom'",
        description: 'Legend placement.',
      },
    ],
    sourcePaths: ['forme/components/Graph.vue', 'forme/components/graph.types.ts'],
  },
  {
    name: 'QrCode',
    slug: 'qrcode',
    title: 'QrCode',
    description: 'QR code with optional caption.',
    category: 'data',
    install: 'qrcode',
    importName: 'QrCode',
    usage: `<QrCode value="https://pdfcn-vue.example.com" :size="96" />`,
    props: [
      { name: 'value', type: 'string', description: 'Encoded payload.' },
      { name: 'size', type: 'number', default: '96', description: 'QR box size in points.' },
      { name: 'caption', type: 'string', description: 'Optional caption under the code.' },
    ],
    sourcePaths: ['forme/components/QrCode.vue'],
  },
  {
    name: 'PdfImage',
    slug: 'pdf-image',
    title: 'PdfImage',
    description: 'Image with fit modes and caption support.',
    category: 'data',
    install: 'pdf-image',
    importName: 'PdfImage',
    usage: `<PdfImage src="/logo.png" :width="120" fit="contain" />`,
    props: [
      { name: 'src', type: 'string', description: 'Image source (URL or data URI).' },
      { name: 'width', type: 'number', description: 'Render width in points.' },
      { name: 'height', type: 'number', description: 'Render height in points.' },
      {
        name: 'fit',
        type: "'contain' | 'cover' | 'fill'",
        default: "'contain'",
        description: 'Image fit mode.',
      },
      { name: 'caption', type: 'string', description: 'Optional caption.' },
    ],
    sourcePaths: ['forme/components/PdfImage.vue', 'forme/components/pdf-image.types.ts'],
  },
];

const chromeComponents: ComponentDoc[] = [
  {
    name: 'PageHeader',
    slug: 'page-header',
    title: 'PageHeader',
    description: 'Fixed page header with logo, title, and meta slots.',
    category: 'chrome',
    install: 'page-header',
    importName: 'PageHeader',
    usage: `<PageHeader title="Invoice" subtitle="INV-2026-003" />`,
    props: [
      { name: 'title', type: 'string', description: 'Primary header title.' },
      { name: 'subtitle', type: 'string', description: 'Secondary line.' },
      {
        name: 'variant',
        type: "'default' | 'minimal' | 'branded'",
        default: "'default'",
        description: 'Header layout variant.',
      },
      { name: 'logo', type: 'string', description: 'Optional logo image source.' },
    ],
    sourcePaths: ['forme/components/PageHeader.vue', 'forme/components/page-chrome.types.ts'],
  },
  {
    name: 'PageFooter',
    slug: 'page-footer',
    title: 'PageFooter',
    description: 'Fixed page footer with variant layouts.',
    category: 'chrome',
    install: 'page-footer',
    importName: 'PageFooter',
    usage: `<PageFooter left="Confidential" right="Thank you" />`,
    props: [
      { name: 'left', type: 'string', description: 'Left footer text.' },
      { name: 'right', type: 'string', description: 'Right footer text.' },
      {
        name: 'variant',
        type: "'default' | 'minimal' | 'legal'",
        default: "'default'",
        description: 'Footer layout variant.',
      },
    ],
    sourcePaths: ['forme/components/PageFooter.vue', 'forme/components/page-chrome.types.ts'],
  },
  {
    name: 'PageNumber',
    slug: 'page-number',
    title: 'PageNumber',
    description:
      'Page number / total pages chrome. Uses Forme PAGE_NUMBER and TOTAL_PAGES constants.',
    category: 'chrome',
    install: 'page-number',
    importName: 'PageNumber',
    usage: `<PageNumber align="center" size="sm" />`,
    props: [
      {
        name: 'align',
        type: "'left' | 'center' | 'right'",
        default: "'right'",
        description: 'Alignment within the footer band.',
      },
      { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Type size.' },
    ],
    sourcePaths: ['forme/components/PageNumber.vue', 'forme/components/page-chrome.types.ts'],
  },
  {
    name: 'Watermark',
    slug: 'watermark',
    title: 'Watermark',
    description: 'Diagonal or centered watermark text.',
    category: 'chrome',
    install: 'watermark',
    importName: 'Watermark',
    usage: `<Watermark text="DRAFT" variant="diagonal" />`,
    props: [
      { name: 'text', type: 'string', description: 'Watermark text.' },
      {
        name: 'variant',
        type: "'diagonal' | 'center'",
        default: "'diagonal'",
        description: 'Placement style.',
      },
      { name: 'opacity', type: 'number', default: '0.12', description: 'Opacity from 0 to 1.' },
    ],
    sourcePaths: ['forme/components/Watermark.vue'],
  },
  {
    name: 'Signature',
    slug: 'signature',
    title: 'Signature',
    description: 'Signature block with signer metadata.',
    category: 'chrome',
    install: 'signature',
    importName: 'Signature',
    usage: `<Signature :signer="{ name: 'Ada Lovelace', role: 'Approver' }" />`,
    props: [
      {
        name: 'signer',
        type: 'SignatureSigner',
        description: 'Signer name, role, and date fields.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact'",
        default: "'default'",
        description: 'Block density.',
      },
    ],
    sourcePaths: ['forme/components/Signature.vue', 'forme/components/signature.types.ts'],
  },
];

export const componentDocs: ComponentDoc[] = [
  ...layoutAndPrimitives,
  ...dataComponents,
  ...chromeComponents,
];

export function findComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocs.find((item) => item.slug === slug);
}

export const componentCategories: { id: ComponentDoc['category']; label: string }[] = [
  { id: 'primitives', label: 'Primitives' },
  { id: 'layout', label: 'Layout' },
  { id: 'data', label: 'Data' },
  { id: 'chrome', label: 'Chrome' },
];
