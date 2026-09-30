<script setup lang="ts">
  import type { PdfcnTheme } from '#registry/types/pdf-themes.ts';
  import { Document, Page, View } from '@formepdf/vue';
  import {
    Badge,
    Card,
    Divider,
    Heading,
    KeyValue,
    PdfcnThemeProvider,
    Section,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Text,
  } from '#registry/forme/index.ts';

  const props = withDefaults(
    defineProps<{
      theme?: PdfcnTheme;
      title?: string;
    }>(),
    {
      title: 'Component gallery',
    },
  );

  const pageSize = computed<string | { width: number; height: number }>(() => {
    const size = props.theme?.page.size ?? 'A4';
    if (props.theme?.page.orientation === 'landscape') {
      const dimensions = {
        A4: { width: 595.28, height: 841.89 },
        LETTER: { width: 612, height: 792 },
        LEGAL: { width: 612, height: 1008 },
      };
      return { width: dimensions[size].height, height: dimensions[size].width };
    }
    return size === 'LETTER' ? 'Letter' : size === 'LEGAL' ? 'Legal' : 'A4';
  });

  const rows = [
    { item: 'Professional services', qty: 12, rate: 1500 },
    { item: 'Platform license', qty: 1, rate: 25000 },
    { item: 'Support retainer', qty: 3, rate: 4000 },
  ];
</script>

<template>
  <PdfcnThemeProvider :theme="theme">
    <Document
      :title="title"
      lang="en"
    >
      <Page
        :size="pageSize"
        :margin="
          props.theme
            ? {
                top: props.theme.spacing.page.marginTop,
                right: props.theme.spacing.page.marginRight,
                bottom: props.theme.spacing.page.marginBottom,
                left: props.theme.spacing.page.marginLeft,
              }
            : 56
        "
      >
        <Stack gap="sm">
          <Heading :level="1">{{ title }}</Heading>
          <Text
            color="mutedForeground"
            variant="sm"
          >
            This page shows how the current theme prints text, tables, and cards.
          </Text>
        </Stack>

        <Section
          spacing="sm"
          no-wrap
        >
          <Stack gap="sm">
            <Heading :level="2">Headings use the theme scale</Heading>
            <Text>
              Body text resolves font family, size, line height, and color from the active
              PdfcnTheme.
            </Text>
            <Text
              variant="sm"
              color="mutedForeground"
              >Smaller supporting text.</Text
            >
          </Stack>
        </Section>

        <Section
          spacing="sm"
          no-wrap
        >
          <KeyValue
            :items="[
              { key: 'Status', value: 'Ready' },
              { key: 'Currency', value: 'USD' },
              { key: 'Terms', value: 'Net 14' },
            ]"
          />
          <Divider :style="{ marginTop: 8, marginBottom: 8 }" />
          <Table variant="line">
            <TableHeader>
              <TableRow header>
                <TableCell header>Item</TableCell>
                <TableCell header>Qty</TableCell>
                <TableCell header>Rate</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in rows"
                :key="row.item"
              >
                <TableCell>{{ row.item }}</TableCell>
                <TableCell>{{ row.qty }}</TableCell>
                <TableCell>{{ row.rate }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section
          spacing="sm"
          no-wrap
        >
          <Stack
            direction="horizontal"
            gap="md"
          >
            <Card
              variant="bordered"
              padding="md"
              :style="{ width: 220 }"
            >
              <Text
                variant="sm"
                weight="semibold"
                >Bordered card</Text
              >
              <Text
                variant="xs"
                color="mutedForeground"
                >With muted caption text.</Text
              >
            </Card>
            <View :style="{ width: 120 }">
              <Badge variant="success">Success</Badge>
              <Badge
                variant="warning"
                size="sm"
                >Warning</Badge
              >
            </View>
          </Stack>
        </Section>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
