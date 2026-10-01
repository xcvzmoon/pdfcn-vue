<script setup lang="ts">
  import type { FontRegistration, FormeDocument } from '@formepdf/vue';
  import { Document, H1, Page, Text } from '@formepdf/vue';

  defineProps<{
    fonts?: FontRegistration[];
    pdfUa?: boolean;
    pdfUa2?: boolean;
    pdfa?: FormeDocument['pdfa'];
    pdfVersion?: FormeDocument['pdfVersion'];
  }>();
</script>

<template>
  <Document
    title="Standards example"
    author="Example team"
    lang="en"
    :fonts="fonts"
    :pdf-ua="pdfUa"
    :pdf-ua2="pdfUa2"
    :pdfa="pdfa"
    :pdf-version="pdfVersion"
  >
    <Page
      size="A4"
      :margin="48"
    >
      <H1>Standards example</H1>
      <Text>Keep the document reading order explicit.</Text>
    </Page>
  </Document>
</template>
