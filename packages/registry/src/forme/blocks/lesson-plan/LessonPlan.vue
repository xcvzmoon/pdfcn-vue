<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { LessonPlanProps } from './lesson-plan.types.ts';
import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
import { computed } from 'vue';
import PageFooter from '../../components/PageFooter.vue';
import PageHeader from '../../components/PageHeader.vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import Section from '../../components/Section.vue';
import Table from '../../components/Table.vue';
import TableBody from '../../components/TableBody.vue';
import TableCell from '../../components/TableCell.vue';
import TableHeader from '../../components/TableHeader.vue';
import TableRow from '../../components/TableRow.vue';
import Text from '../../components/Text.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import { sampleLessonPlanData } from './lesson-plan.sample.ts';

const props = defineProps<{
  data?: LessonPlanProps | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const plan = computed(() => props.data ?? sampleLessonPlanData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

const REFLECTION_LINE_COUNT = 8;
const COLUMN_WIDTHS = { activity: 104, notes: 140, time: 56 };

function listItem(text: string) {
  return { text };
}

const styles = computed(() => {
  const current = activeTheme.value;
  const rule: Style = {
    borderBottomColor: current.colors.border,
    borderBottomWidth: 1,
  };
  return {
    block: {
      marginBottom: 16,
    } satisfies Style,
    colHalf: {
      flex: 2,
      paddingRight: 20,
    } satisfies Style,
    colQuarter: {
      flex: 1,
      paddingRight: 10,
    } satisfies Style,
    infoRow: {
      ...rule,
      flexDirection: 'row',
      marginBottom: 16,
      paddingBottom: 12,
    } satisfies Style,
    intro: {
      marginBottom: 3,
    } satisfies Style,
    label: {
      fontSize: 9,
      fontWeight: 700,
      marginBottom: 4,
    } satisfies Style,
    listMarker: {
      width: 12,
    } satisfies Style,
    listRow: {
      flexDirection: 'row',
      marginBottom: 3,
    } satisfies Style,
    listText: {
      flex: 1,
    } satisfies Style,
    page: {
      backgroundColor: current.colors.background,
    } satisfies Style,
    reflectionLine: {
      ...rule,
      height: 24,
    } satisfies Style,
    row: {
      flexDirection: 'row',
    } satisfies Style,
  };
});

const pageMargin = computed(() => {
  const current = activeTheme.value;
  return {
    bottom: current.spacing.page.marginBottom,
    left: current.spacing.page.marginLeft,
    right: current.spacing.page.marginRight,
    top: current.spacing.page.marginTop,
  };
});

const infoItems = computed(() => {
  const data = plan.value;
  return [
    { label: 'Subject', value: data.subject },
    { label: 'Grade Level', value: data.gradeLevel },
    { label: 'Teacher', value: data.teacherName },
    { label: 'Duration', value: data.duration },
  ];
});

const footerText = computed(
  () => `${plan.value.subject} · ${plan.value.gradeLevel} · ${plan.value.lessonTitle}`,
);
const documentTitle = computed(() => `Lesson Plan — ${plan.value.lessonTitle}`);
const subtitle = computed(() =>
  plan.value.topic ? `Lesson Plan · ${plan.value.topic}` : 'Lesson Plan',
);
const pageFooterRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);

const objectiveItems = computed(() => plan.value.objectives.map(listItem));
const standardsItems = computed(() => (plan.value.standards ?? []).map(listItem));
const materialsItems = computed(() => plan.value.materials.map(listItem));
const differentiationItems = computed(() => (plan.value.differentiation ?? []).map(listItem));
const formativeItems = computed(() => (plan.value.assessment.formative ?? []).map(listItem));
const summativeItems = computed(() => (plan.value.assessment.summative ?? []).map(listItem));
const reflectionLines = Array.from({ length: REFLECTION_LINE_COUNT }, (_, line) => line);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page :margin="pageMargin" size="A4">
        <PageFooter
          :left-text="footerText"
          :right-text="pageFooterRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="simple"
            :title="plan.lessonTitle"
            :subtitle="subtitle"
            :right-text="plan.date"
            :margin-bottom="16"
          />

          <View :style="styles.infoRow">
            <View v-for="item in infoItems" :key="item.label" :style="styles.colQuarter">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                {{ item.label }}
              </Text>
              <Text variant="xs" weight="medium" no-margin>{{ item.value }}</Text>
            </View>
          </View>

          <Section
            v-if="plan.essentialQuestion"
            variant="highlight"
            :accent-color="plan.accentColor ?? 'primary'"
            spacing="none"
            padding="sm"
            :style="styles.block"
          >
            <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
              Essential Question
            </Text>
            <Text variant="sm" weight="medium" no-margin>{{ plan.essentialQuestion }}</Text>
          </Section>

          <View :style="[styles.row, styles.block]">
            <View :style="styles.colHalf">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                Objectives
              </Text>
              <Text variant="xs" color="mutedForeground" :style="styles.intro" no-margin>
                Students will be able to (SWBAT):
              </Text>
              <View
                v-for="(item, index) in objectiveItems"
                :key="item.text"
                :style="styles.listRow"
              >
                <View :style="styles.listMarker">
                  <Text variant="xs" color="mutedForeground" no-margin>
                    {{ `${index + 1}.` }}
                  </Text>
                </View>
                <View :style="styles.listText">
                  <Text variant="xs" no-margin>{{ item.text }}</Text>
                </View>
              </View>
            </View>
            <View v-if="standardsItems.length > 0" :style="styles.colQuarter">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                Standards
              </Text>
              <View v-for="item in standardsItems" :key="item.text" :style="styles.listRow">
                <View :style="styles.listMarker">
                  <Text variant="xs" color="mutedForeground" no-margin>•</Text>
                </View>
                <View :style="styles.listText">
                  <Text variant="xs" no-margin>{{ item.text }}</Text>
                </View>
              </View>
            </View>
            <View :style="styles.colQuarter">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                Materials
              </Text>
              <View v-for="item in materialsItems" :key="item.text" :style="styles.listRow">
                <View :style="styles.listMarker">
                  <Text variant="xs" color="mutedForeground" no-margin>•</Text>
                </View>
                <View :style="styles.listText">
                  <Text variant="xs" no-margin>{{ item.text }}</Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
              Lesson Sequence
            </Text>
            <Table variant="grid" zebra-stripe>
              <TableHeader>
                <TableRow header>
                  <TableCell :width="COLUMN_WIDTHS.time" text="Time" />
                  <TableCell :width="COLUMN_WIDTHS.activity" text="Activity" />
                  <TableCell text="Description" />
                  <TableCell :width="COLUMN_WIDTHS.notes" text="Notes" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in plan.sequence" :key="`${item.time}-${item.activity}`">
                  <TableCell :width="COLUMN_WIDTHS.time" :text="item.time" />
                  <TableCell :width="COLUMN_WIDTHS.activity" :text="item.activity" />
                  <TableCell :text="item.description" />
                  <TableCell :width="COLUMN_WIDTHS.notes" :text="item.notes ?? '—'" />
                </TableRow>
              </TableBody>
            </Table>
          </View>
        </View>
      </Page>

      <Page :margin="pageMargin" size="A4">
        <PageFooter
          :left-text="footerText"
          :right-text="pageFooterRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <View v-if="differentiationItems.length > 0" :style="styles.block">
            <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
              Differentiation
            </Text>
            <View v-for="item in differentiationItems" :key="item.text" :style="styles.listRow">
              <View :style="styles.listMarker">
                <Text variant="xs" color="mutedForeground" no-margin>•</Text>
              </View>
              <View :style="styles.listText">
                <Text variant="xs" no-margin>{{ item.text }}</Text>
              </View>
            </View>
          </View>

          <View :style="[styles.row, styles.block]">
            <View :style="styles.colHalf">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                Formative Assessment
              </Text>
              <View v-for="item in formativeItems" :key="item.text" :style="styles.listRow">
                <View :style="styles.listMarker">
                  <Text variant="xs" color="mutedForeground" no-margin>•</Text>
                </View>
                <View :style="styles.listText">
                  <Text variant="xs" no-margin>{{ item.text }}</Text>
                </View>
              </View>
            </View>
            <View :style="styles.colHalf">
              <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
                Summative Assessment
              </Text>
              <View v-for="item in summativeItems" :key="item.text" :style="styles.listRow">
                <View :style="styles.listMarker">
                  <Text variant="xs" color="mutedForeground" no-margin>•</Text>
                </View>
                <View :style="styles.listText">
                  <Text variant="xs" no-margin>{{ item.text }}</Text>
                </View>
              </View>
            </View>
          </View>

          <View v-if="plan.homework" :style="styles.block">
            <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
              Homework
            </Text>
            <Text variant="xs" no-margin>{{ plan.homework }}</Text>
          </View>

          <View>
            <Text :style="styles.label" color="mutedForeground" transform="uppercase" no-margin>
              Teacher Reflection
            </Text>
            <Text v-if="plan.reflection" variant="xs" no-margin>{{ plan.reflection }}</Text>
            <View
              v-for="line in reflectionLines"
              :key="`reflection-line-${line}`"
              :style="styles.reflectionLine"
            />
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
