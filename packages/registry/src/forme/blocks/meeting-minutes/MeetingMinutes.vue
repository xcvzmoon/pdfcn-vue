<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type {
    MeetingMinutesActionStatus,
    MeetingMinutesAttendee,
    MeetingMinutesProps,
  } from './meeting-minutes.types.ts';
  import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import Badge from '../../components/Badge.vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfList from '../../components/PdfList.vue';
  import Section from '../../components/Section.vue';
  import Table from '../../components/Table.vue';
  import TableBody from '../../components/TableBody.vue';
  import TableCell from '../../components/TableCell.vue';
  import TableHeader from '../../components/TableHeader.vue';
  import TableRow from '../../components/TableRow.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { sampleMeetingMinutesData } from './meeting-minutes.sample.ts';

  const props = defineProps<{
    data?: MeetingMinutesProps | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const minutes = computed(() => props.data ?? sampleMeetingMinutesData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const STATUS_VARIANT: Record<MeetingMinutesActionStatus, 'success' | 'info' | 'default'> = {
    Complete: 'success',
    'In Progress': 'info',
    'Not Started': 'default',
  };

  function formatAttendee(attendee: MeetingMinutesAttendee): string {
    return attendee.role ? `${attendee.name} — ${attendee.role}` : attendee.name;
  }

  const styles = computed(() => {
    const current = activeTheme.value;
    return {
      columnHeading: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 2,
      } satisfies Style,
      discussionTopic: {
        marginBottom: current.primitives.spacing[2],
      } satisfies Style,
      listItem: {
        marginBottom: current.primitives.spacing[1],
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
    };
  });

  type AttendeeColumn = { heading: string; names: string[] };

  const attendeeColumns = computed(() => {
    const data = minutes.value;
    const columns: AttendeeColumn[] = [
      { heading: 'Attendees', names: data.attendees.map(formatAttendee) },
    ];
    if (data.absent?.length) {
      columns.push({ heading: 'Absent', names: data.absent.map(formatAttendee) });
    }
    if (data.guests?.length) {
      columns.push({ heading: 'Guests', names: data.guests });
    }
    return columns;
  });

  const documentTitle = computed(() => `Minutes — ${minutes.value.meetingTitle}`);
  const subtitle = computed(
    () => `${minutes.value.location} · Organized by ${minutes.value.organizer}`,
  );
  const footerLeft = computed(() => `Prepared by ${minutes.value.preparedBy}`);
  const footerRight = computed(() => {
    const list = minutes.value.distributionList;
    if (!list || list.length === 0) return undefined;
    return `Distribution: ${list.join(', ')}`;
  });
  const pageFooterRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const discussionNotes = computed(() =>
    minutes.value.discussions.map((discussion) => ({
      ...discussion,
      noteItems: discussion.notes.map((text) => ({ text })),
    })),
  );
  const nextAgendaItems = computed(() =>
    (minutes.value.nextMeeting?.agenda ?? []).map((text) => ({ text })),
  );
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        size="A4"
        :margin="{ bottom: 25, left: 56, right: 56, top: 56 }"
      >
        <PageFooter
          :left-text="footerLeft"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="simple"
            :title="minutes.meetingTitle"
            :subtitle="subtitle"
            :right-text="minutes.date"
            :right-sub-text="minutes.time"
            :margin-bottom="0"
          />
          <Section
            spacing="sm"
            :style="{ flexDirection: 'row' }"
          >
            <View
              v-for="column in attendeeColumns"
              :key="column.heading"
              :style="{ flex: 1, paddingRight: 15 }"
            >
              <Text
                :style="styles.columnHeading"
                color="mutedForeground"
                transform="uppercase"
                no-margin
              >
                {{ column.heading }}
              </Text>
              <Text
                v-for="name in column.names"
                :key="name"
                variant="xs"
                no-margin
              >
                {{ name }}
              </Text>
            </View>
          </Section>
          <Section spacing="sm">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Agenda
            </Text>
            <Text
              v-for="(item, index) in minutes.agenda"
              :key="item"
              :style="styles.listItem"
              variant="sm"
              no-margin
            >
              {{ `${index + 1}. ${item}` }}
            </Text>
          </Section>
          <Section spacing="sm">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Discussion
            </Text>
            <View
              v-for="discussion in discussionNotes"
              :key="discussion.topic"
              :style="styles.discussionTopic"
            >
              <Text
                variant="sm"
                weight="semibold"
                no-margin
                >{{ discussion.topic }}</Text
              >
              <Text
                v-if="discussion.speaker"
                variant="xs"
                color="mutedForeground"
                no-margin
              >
                {{ `— ${discussion.speaker}` }}
              </Text>
              <PdfList
                variant="bullet"
                gap="xs"
                :items="discussion.noteItems"
              />
            </View>
          </Section>
        </View>
      </Page>
      <Page
        size="A4"
        :margin="{ bottom: 25, left: 56, right: 56, top: 56 }"
      >
        <PageFooter
          :left-text="footerLeft"
          :right-text="pageFooterRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <Section spacing="sm">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Decisions
            </Text>
            <View
              v-for="decision in minutes.decisions"
              :key="decision.number"
              :style="styles.discussionTopic"
            >
              <Text
                variant="sm"
                weight="semibold"
                no-margin
              >
                {{ `${decision.number}. ${decision.decision}` }}
              </Text>
              <Text
                v-if="decision.rationale"
                variant="xs"
                color="mutedForeground"
                no-margin
              >
                {{ decision.rationale }}
              </Text>
            </View>
          </Section>
          <Section spacing="sm">
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Action Items
            </Text>
            <Table
              variant="grid"
              zebra-stripe
            >
              <TableHeader>
                <TableRow header>
                  <TableCell text="Task" />
                  <TableCell
                    align="center"
                    text="Owner"
                  />
                  <TableCell
                    align="center"
                    text="Due Date"
                  />
                  <TableCell
                    align="center"
                    text="Status"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="item in minutes.actionItems"
                  :key="item.task"
                >
                  <TableCell :text="item.task" />
                  <TableCell
                    align="center"
                    :text="item.owner"
                  />
                  <TableCell
                    align="center"
                    :text="item.dueDate"
                  />
                  <TableCell align="center">
                    <Badge
                      :variant="STATUS_VARIANT[item.status]"
                      size="sm"
                      :label="item.status"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
          <Section
            v-if="minutes.nextMeeting"
            spacing="sm"
            variant="highlight"
            :accent-color="minutes.accentColor ?? 'primary'"
          >
            <Text
              :style="styles.columnHeading"
              color="mutedForeground"
              transform="uppercase"
              no-margin
            >
              Next Meeting
            </Text>
            <Text
              variant="sm"
              weight="medium"
              no-margin
            >
              {{ `${minutes.nextMeeting.date} · ${minutes.nextMeeting.time}` }}
            </Text>
            <PdfList
              v-if="minutes.nextMeeting.agenda"
              variant="bullet"
              gap="xs"
              :items="nextAgendaItems"
            />
          </Section>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
