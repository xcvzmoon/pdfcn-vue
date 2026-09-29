<script setup lang="ts">
import { Document, Page } from '@formepdf/vue';
import Alert from '../../src/forme/components/Alert.vue';
import Badge from '../../src/forme/components/Badge.vue';
import Card from '../../src/forme/components/Card.vue';
import DataTable from '../../src/forme/components/DataTable.vue';
import Graph from '../../src/forme/components/Graph.vue';
import Heading from '../../src/forme/components/Heading.vue';
import KeyValue from '../../src/forme/components/KeyValue.vue';
import PageFooter from '../../src/forme/components/PageFooter.vue';
import PageHeader from '../../src/forme/components/PageHeader.vue';
import PageNumber from '../../src/forme/components/PageNumber.vue';
import PdfcnThemeProvider from '../../src/forme/components/PdfcnThemeProvider.vue';
import PdfForm from '../../src/forme/components/PdfForm.vue';
import PdfImage from '../../src/forme/components/PdfImage.vue';
import QrCode from '../../src/forme/components/QrCode.vue';
import Signature from '../../src/forme/components/Signature.vue';
import Table from '../../src/forme/components/Table.vue';
import TableBody from '../../src/forme/components/TableBody.vue';
import TableCell from '../../src/forme/components/TableCell.vue';
import TableHeader from '../../src/forme/components/TableHeader.vue';
import TableRow from '../../src/forme/components/TableRow.vue';
import Text from '../../src/forme/components/Text.vue';
import Watermark from '../../src/forme/components/Watermark.vue';
import { professionalTheme } from '../../src/themes/professional.ts';

const columns = [
  { align: 'left' as const, header: 'Item', key: 'item' },
  { align: 'right' as const, header: 'Qty', key: 'qty' },
  { align: 'right' as const, header: 'Total', key: 'total' },
];

const rows = [
  { item: 'Widget', qty: 2, total: 40 },
  { item: 'Gadget', qty: 1, total: 25 },
];

const formGroups = [
  {
    fields: [{ hint: 'First and last', label: 'Full name' }, { label: 'Company' }],
    layout: 'two-column' as const,
    title: 'Contact',
  },
];

const keyValueItems = [
  { key: 'Subtotal', value: '$65.00' },
  { key: 'Tax', value: '$5.20', valueColor: 'success' },
];
</script>

<template>
  <PdfcnThemeProvider :theme="professionalTheme">
    <Document title="Data and chrome">
      <Page size="A4" :margin="48">
        <Watermark text="DRAFT" />
        <PageHeader
          title="Acme Corp"
          subtitle="Operations report"
          right-text="Confidential"
          right-sub-text="Q3"
          variant="simple"
        />
        <Heading :level="2" no-margin>Summary</Heading>
        <Card title="Highlights" variant="bordered" padding="md">
          <Text no-margin>Card body content</Text>
        </Card>
        <Alert variant="success" title="All systems go">
          <Text no-margin>Deployment finished without errors.</Text>
        </Alert>
        <Badge label="Paid" variant="success" size="md" />
        <KeyValue :items="keyValueItems" divided size="md" />
        <Table variant="grid" :column-count="3">
          <TableHeader>
            <TableRow header>
              <TableCell header text="Item" />
              <TableCell header text="Qty" align="right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell text="Widget" />
              <TableCell text="2" align="right" />
            </TableRow>
          </TableBody>
        </Table>
        <DataTable
          :columns="columns"
          :data="rows"
          variant="grid"
          stripe
          :footer="{ item: 'Total', qty: 3, total: 65 }"
        />
        <PdfForm
          title="Intake"
          subtitle="Fill and sign"
          :groups="formGroups"
          variant="underline"
          label-position="above"
        />
        <Graph
          variant="bar"
          title="Revenue"
          :data="[
            { label: 'Jan', value: 120 },
            { label: 'Feb', value: 90 },
          ]"
          :width="360"
          :height="180"
          show-values
        />
        <Graph
          variant="donut"
          title="Share"
          :data="[
            { label: 'A', value: 40 },
            { label: 'B', value: 60 },
          ]"
          :width="240"
          :height="200"
          legend="bottom"
        />
        <QrCode value="https://example.com" :size="80" caption="Scan me" />
        <PdfImage
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          variant="thumbnail"
          caption="Logo"
        />
        <Signature
          variant="single"
          label="Approved by"
          name="Jane Doe"
          title="CFO"
          date="2024-01-01"
        />
        <PageFooter
          variant="simple"
          left-text="Acme Corp"
          center-text="Confidential"
          right-text="1 of 1"
        />
        <PageNumber format="Page {page} of {total}" align="center" size="sm" />
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
