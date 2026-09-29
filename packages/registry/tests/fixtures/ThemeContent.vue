<script setup lang="ts">
import { Document, Page, Text } from '@formepdf/vue';
import { usePdfcnTheme } from '../../src/forme/lib/theme.ts';

const theme = usePdfcnTheme();
</script>

<template>
  <Document :title="theme.name">
    <Page :size="theme.page.size" :margin="theme.spacing.page.marginTop">
      <Text :style="{ color: theme.colors.primary, fontSize: theme.typography.body.fontSize }">
        {{ theme.name }}
      </Text>
    </Page>
  </Document>
</template>
