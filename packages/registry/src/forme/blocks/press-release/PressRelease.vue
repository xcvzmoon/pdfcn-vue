<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { PressReleaseProps } from './press-release.types.ts';
  import { Document, Page, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import Section from '../../components/Section.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { samplePressReleaseData } from './press-release.sample.ts';

  const props = defineProps<{
    data?: PressReleaseProps | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const release = computed(() => props.data ?? samplePressReleaseData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  const styles = computed(() => {
    const current = activeTheme.value;
    return {
      columnHeading: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 2,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
    };
  });

  const documentTitle = computed(() => `Press Release — ${release.value.companyName}`);
  const dateline = computed(
    () => `${release.value.dateline.city}, ${release.value.dateline.state} — ${release.value.date}`,
  );
  const footerRight = computed(() => {
    const links = release.value.socialLinks;
    if (!links || links.length === 0) return undefined;
    return links.map((link) => link.platform).join(' · ');
  });
  const footerLeft = computed(() => release.value.address ?? release.value.companyName);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        size="A4"
        :margin="pageMargin"
      >
        <PageFooter
          :left-text="footerLeft"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="logo-left"
            :title="release.companyName"
            :right-text="release.date"
            :margin-bottom="0"
          >
            <template
              v-if="release.companyLogo"
              #logo
            >
              <PdfImage
                :src="release.companyLogo"
                :style="{ margin: 0 }"
              />
            </template>
          </PageHeader>
          <Section spacing="none">
            <Text
              variant="xs"
              weight="bold"
              transform="uppercase"
              :color="release.accentColor ?? 'mutedForeground'"
              no-margin
            >
              For Immediate Release
            </Text>
            <Text
              variant="2xl"
              weight="bold"
              no-margin
              >{{ release.headline }}</Text
            >
            <Text
              v-if="release.subheadline"
              variant="lg"
              color="mutedForeground"
              no-margin
            >
              {{ release.subheadline }}
            </Text>
          </Section>
          <Section spacing="sm">
            <Text
              variant="sm"
              weight="semibold"
              transform="uppercase"
              no-margin
            >
              {{ dateline }}
            </Text>
            <Text
              v-for="paragraph in release.body"
              :key="paragraph.slice(0, 24)"
              variant="sm"
            >
              {{ paragraph }}
            </Text>
          </Section>
          <Section
            v-for="quote in release.quotes ?? []"
            :key="quote.author"
            spacing="sm"
            variant="callout"
            :accent-color="release.accentColor ?? 'primary'"
          >
            <Text
              variant="base"
              italic
              no-margin
              >{{ `“${quote.text}”` }}</Text
            >
            <Text
              variant="xs"
              color="mutedForeground"
              no-margin
            >
              {{ `— ${quote.author}, ${quote.title}` }}
            </Text>
          </Section>
          <Section spacing="sm">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              {{ `About ${release.companyName}` }}
            </Text>
            <Text
              variant="sm"
              no-margin
              >{{ release.boilerplate }}</Text
            >
          </Section>
          <Section spacing="none">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Media Contact
            </Text>
            <Text
              variant="xs"
              no-margin
              >{{ release.mediaContact.name }}</Text
            >
            <Text
              variant="xs"
              no-margin
              >{{ release.mediaContact.email }}</Text
            >
            <Text
              variant="xs"
              no-margin
              >{{ release.mediaContact.phone }}</Text
            >
            <Text
              v-if="release.mediaContact.website"
              variant="xs"
              no-margin
            >
              {{ release.mediaContact.website }}
            </Text>
          </Section>
          <Text
            align="center"
            variant="sm"
            weight="medium"
            no-margin
            >###</Text
          >
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
