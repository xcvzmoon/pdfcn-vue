<script setup lang="ts">
  import {
    Document,
    Heading,
    Text,
    Stack,
    Section,
    Divider,
    PageBreak,
    KeepTogether,
    Link,
    PdfList,
    PdfcnThemeProvider,
  } from '../src/takumi/index.ts';
  import { minimalTheme } from '../src/themes/minimal.ts';

  defineProps<{ recipient?: string }>();
</script>

<template>
  <PdfcnThemeProvider :theme="minimalTheme">
    <Document>
      <Heading>Takumi document</Heading>
      <Stack gap="sm">
        <Text>{{ recipient }}</Text>
        <Section variant="card"><Text>First page content</Text></Section>
        <Divider />
        <Link href="https://example.com">Example link</Link>
        <KeepTogether><Text>Keep this together</Text></KeepTogether>
        <PdfList :items="[{ text: 'First item' }, { text: 'Second item' }]" />
        <PdfList
          :items="[{ text: 'Done', checked: true }]"
          variant="checklist"
        />
      </Stack>
      <PageBreak />
      <Heading :level="2">Second page</Heading>
      <Text>Last page content</Text>
    </Document>
  </PdfcnThemeProvider>
</template>
