<script setup lang="ts">
  import { Document, Page } from '@formepdf/vue';
  import Text from './components/Text.vue';

  defineProps<{
    recipient: string;
  }>();
</script>

<template>
  <Document
    title="pdfcn-vue foundation proof"
    lang="en"
  >
    <Page
      size="A4"
      :margin="48"
    >
      <Text :style="{ fontSize: 24, fontWeight: 700, marginBottom: 16 }"
        >Hello, {{ recipient }}</Text
      >
      <Text :style="{ fontSize: 12 }">Rendered from a Vue single-file component.</Text>
    </Page>
  </Document>
</template>
