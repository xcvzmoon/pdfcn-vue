<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type {
  EventAgendaDaySchedule,
  EventAgendaProps,
  EventAgendaSession,
} from './event-agenda.types.ts';
import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
import { computed } from 'vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import Section from '../../components/Section.vue';
import Text from '../../components/Text.vue';
import { resolveColor } from '../../lib/resolve-color.ts';
import { usePdfcnTheme } from '../../lib/theme.ts';
import AgendaSession from './AgendaSession.vue';
import { sampleEventAgendaData } from './event-agenda.sample.ts';

const props = defineProps<{
  data?: EventAgendaProps | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const agenda = computed(() => props.data ?? sampleEventAgendaData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

type TimeSlotGroup = {
  sessions: EventAgendaSession[];
  time: string;
};

function groupSessionsByTime(sessions: EventAgendaSession[]): TimeSlotGroup[] {
  const groups: TimeSlotGroup[] = [];
  const map = new Map<string, EventAgendaSession[]>();

  for (const session of sessions) {
    const existing = map.get(session.time);
    if (existing) {
      existing.push(session);
    } else {
      const list = [session];
      map.set(session.time, list);
      groups.push({ sessions: list, time: session.time });
    }
  }

  return groups;
}

function trackColorMap(): Map<string, string> {
  const map = new Map<string, string>();
  const tracks = agenda.value.tracks;
  if (tracks) {
    for (const track of tracks) {
      map.set(track.name.toLowerCase(), track.color);
    }
  }
  return map;
}

const accent = computed(() => {
  const current = activeTheme.value;
  return resolveColor(agenda.value.accentColor ?? current.colors.primary, current.colors);
});

const styles = computed(() => {
  const current = activeTheme.value;
  return {
    breakBadge: {
      backgroundColor: current.colors.muted,
      borderColor: current.colors.border,
      borderRadius: 4,
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 2,
    } satisfies Style,
    breakCard: {
      backgroundColor: current.colors.muted,
      borderColor: current.colors.border,
      borderRadius: 6,
      borderWidth: 1,
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 7,
    } satisfies Style,
    dayBanner: {
      alignItems: 'center',
      backgroundColor: current.colors.muted,
      borderColor: current.colors.border,
      borderRadius: 6,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    } satisfies Style,
    dayMeta: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    } satisfies Style,
    footerContainer: {
      borderTopColor: current.colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: 8,
    } satisfies Style,
    headerBadge: {
      backgroundColor: accent.value,
      borderRadius: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
    } satisfies Style,
    headerContainer: {
      borderBottomColor: current.colors.border,
      borderBottomWidth: 1.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
    } satisfies Style,
    headerText: {
      flex: 1,
      paddingRight: 16,
    } satisfies Style,
    kicker: {
      color: accent.value,
      fontSize: 8.5,
      fontWeight: 700,
      letterSpacing: 1.2,
      marginBottom: 2,
      textTransform: 'uppercase',
    } satisfies Style,
    legendContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8,
    } satisfies Style,
    legendDot: {
      borderRadius: 3,
      height: 7,
      marginRight: 4,
      width: 7,
    } satisfies Style,
    legendItem: {
      alignItems: 'center',
      backgroundColor: current.colors.muted,
      borderColor: current.colors.border,
      borderRadius: 4,
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: 6,
      paddingVertical: 2,
    } satisfies Style,
    pageContent: {
      backgroundColor: current.colors.background,
      flex: 1,
    } satisfies Style,
    sessionsRow: {
      flex: 1,
      flexDirection: 'row',
      gap: 8,
    } satisfies Style,
    timeBox: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      paddingTop: 2,
      width: 78,
    } satisfies Style,
    timeSlotRow: {
      flexDirection: 'row',
      marginBottom: 8,
    } satisfies Style,
  };
});

const trackColors = computed(() => trackColorMap());

function isSingleBreak(slot: TimeSlotGroup): boolean {
  return slot.sessions.length === 1 && slot.sessions[0]?.isBreak === true;
}

function trackColorFor(session: EventAgendaSession): string | undefined {
  if (!session.track) return undefined;
  return trackColors.value.get(session.track.toLowerCase());
}

function daySlots(day: EventAgendaDaySchedule): TimeSlotGroup[] {
  return groupSessionsByTime(day.sessions);
}

const documentTitle = computed(() => `${agenda.value.eventName} - Agenda`);
const dateLine = computed(() => {
  const data = agenda.value;
  const range = data.endDate ? `${data.date} – ${data.endDate}` : data.date;
  return `${range} • ${data.venue}`;
});
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        v-for="(day, dayIndex) in agenda.days"
        :key="day.label"
        size="A4"
        :margin="{ bottom: 32, left: 32, right: 32, top: 32 }"
      >
        <View :style="styles.pageContent">
          <View :style="styles.headerContainer">
            <View :style="styles.headerText">
              <Text no-margin :style="styles.kicker">Event Agenda</Text>
              <Text
                no-margin
                :style="{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 4,
                }"
              >
                {{ agenda.eventName }}
              </Text>
              <Text
                no-margin
                :style="{
                  color: activeTheme.colors.mutedForeground,
                  fontSize: 8.5,
                }"
              >
                {{ dateLine }}
              </Text>
            </View>

            <View :style="{ alignItems: 'flex-end', justifyContent: 'center' }">
              <View :style="styles.headerBadge">
                <Text
                  no-margin
                  :style="{
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                  }"
                >
                  AGENDA
                </Text>
              </View>
            </View>
          </View>

          <View :style="styles.dayBanner">
            <View :style="styles.dayMeta">
              <Text no-margin :style="{ fontSize: 11, fontWeight: 700 }">{{ day.label }}</Text>
              <Text no-margin :style="{ color: activeTheme.colors.mutedForeground, fontSize: 9 }">
                {{ `— ${day.date}` }}
              </Text>
            </View>

            <Text
              no-margin
              :style="{
                color: activeTheme.colors.mutedForeground,
                fontSize: 8.5,
                fontWeight: 600,
              }"
            >
              {{ `Day ${dayIndex + 1} of ${agenda.days.length}` }}
            </Text>
          </View>

          <View v-if="agenda.tracks && agenda.tracks.length > 0" :style="styles.legendContainer">
            <Text
              no-margin
              :style="{
                color: activeTheme.colors.mutedForeground,
                fontSize: 7.5,
                fontWeight: 700,
                letterSpacing: 0.5,
                marginRight: 4,
                textTransform: 'uppercase',
              }"
            >
              Tracks:
            </Text>
            <View v-for="track in agenda.tracks" :key="track.name" :style="styles.legendItem">
              <View :style="[styles.legendDot, { backgroundColor: track.color }]" />
              <Text no-margin :style="{ fontSize: 7.5, fontWeight: 600 }">
                {{ track.name }}
              </Text>
            </View>
          </View>

          <Section :style="{ marginTop: 2 }">
            <View v-for="slot in daySlots(day)" :key="slot.time" :style="styles.timeSlotRow">
              <View :style="styles.timeBox">
                <Text
                  no-margin
                  :style="{
                    color: activeTheme.colors.foreground,
                    fontSize: 9,
                    fontWeight: 700,
                  }"
                >
                  {{ slot.time }}
                </Text>
                <Text
                  v-if="slot.sessions[0]?.endTime"
                  no-margin
                  :style="{
                    color: activeTheme.colors.mutedForeground,
                    fontSize: 7.5,
                  }"
                >
                  {{ `to ${slot.sessions[0].endTime}` }}
                </Text>
              </View>

              <View v-if="isSingleBreak(slot)" :style="styles.breakCard">
                <View
                  :style="{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }"
                >
                  <Text
                    no-margin
                    :style="{
                      color: activeTheme.colors.foreground,
                      fontSize: 9.5,
                      fontWeight: 700,
                    }"
                  >
                    {{ slot.sessions[0]?.title }}
                  </Text>
                  <View :style="styles.breakBadge">
                    <Text
                      no-margin
                      :style="{
                        color: activeTheme.colors.mutedForeground,
                        fontSize: 7,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                      }"
                    >
                      Break
                    </Text>
                  </View>
                </View>
                <Text
                  v-if="slot.sessions[0]?.description"
                  no-margin
                  :style="{
                    color: activeTheme.colors.mutedForeground,
                    fontSize: 7.5,
                    marginTop: 2,
                  }"
                >
                  {{ slot.sessions[0]?.description }}
                </Text>
              </View>

              <View v-else :style="styles.sessionsRow">
                <AgendaSession
                  v-for="(session, sessionIndex) in slot.sessions"
                  :key="`${session.title}-${sessionIndex}`"
                  :session="session"
                  :accent="accent"
                  :track-color="trackColorFor(session)"
                />
              </View>
            </View>
          </Section>

          <View :style="styles.footerContainer">
            <View :style="{ flexDirection: 'column', gap: 1 }">
              <Text
                v-if="agenda.wifiInfo"
                no-margin
                :style="{
                  color: activeTheme.colors.mutedForeground,
                  fontSize: 7.5,
                  fontWeight: 600,
                }"
              >
                {{ `Wi-Fi: ${agenda.wifiInfo}` }}
              </Text>
              <Text
                v-if="agenda.emergencyContact"
                no-margin
                :style="{
                  color: activeTheme.colors.mutedForeground,
                  fontSize: 7.2,
                }"
              >
                {{ agenda.emergencyContact }}
              </Text>
            </View>

            <View :style="{ alignItems: 'flex-end' }">
              <Text
                no-margin
                :style="{
                  color: activeTheme.colors.mutedForeground,
                  fontSize: 7.5,
                  fontWeight: 600,
                }"
              >
                {{ `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}` }}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
