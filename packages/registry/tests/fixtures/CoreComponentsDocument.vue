<script setup lang="ts">
  import { Document, Page } from '@formepdf/vue';
  import Divider from '../../src/forme/components/Divider.vue';
  import Heading from '../../src/forme/components/Heading.vue';
  import KeepTogether from '../../src/forme/components/KeepTogether.vue';
  import Link from '../../src/forme/components/Link.vue';
  import PageBreak from '../../src/forme/components/PageBreak.vue';
  import PdfcnThemeProvider from '../../src/forme/components/PdfcnThemeProvider.vue';
  import PdfList from '../../src/forme/components/PdfList.vue';
  import Section from '../../src/forme/components/Section.vue';
  import Stack from '../../src/forme/components/Stack.vue';
  import Text from '../../src/forme/components/Text.vue';
  import { forestTheme } from '../../src/themes/forest.ts';

  const items = [
    { text: 'First item', children: [{ text: 'Nested item' }] },
    { text: 'Second item' },
  ];
</script>

<template>
  <PdfcnThemeProvider :theme="forestTheme">
    <Document title="Core components">
      <Page
        size="A4"
        :margin="48"
      >
        <Heading
          :level="2"
          color="primary"
          no-margin
          >Core heading</Heading
        >
        <Text
          variant="sm"
          color="mutedForeground"
          weight="medium"
          no-margin
        >
          Styled text
        </Text>
        <Stack
          gap="sm"
          direction="horizontal"
          align="center"
          justify="between"
        >
          <Text no-margin>Left</Text>
          <Text no-margin>Right</Text>
        </Stack>
        <Section
          variant="highlight"
          accent-color="success"
          spacing="sm"
          no-wrap
        >
          <KeepTogether>
            <Text no-margin>Kept section</Text>
            <Link
              href="https://example.com"
              variant="primary"
              >Example link</Link
            >
          </KeepTogether>
        </Section>
        <Divider
          label="Section break"
          variant="dashed"
          thickness="medium"
        />
        <PdfList
          :items="items"
          variant="multi-level"
        />
        <PdfList
          :items="[{ text: 'Checked', checked: true }]"
          variant="checklist"
        />
        <PdfList
          :items="[{ text: 'Description', description: 'Supporting detail' }]"
          variant="descriptive"
        />
        <PdfList
          :items="[{ text: 'Numbered' }]"
          variant="numbered"
        />
        <PdfList
          :items="[{ text: 'Icon' }]"
          variant="icon"
        />
        <Divider variant="dotted" />
        <PageBreak />
        <Heading
          :level="3"
          no-margin
          >Following page</Heading
        >
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
