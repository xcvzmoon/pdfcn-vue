<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { EventAgendaSession } from './event-agenda.types.ts';
import { View } from '@formepdf/vue';
import { computed } from 'vue';
import Text from '../../components/Text.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';

const props = defineProps<{
  session: EventAgendaSession;
  accent: string;
  trackColor?: string | undefined;
}>();

const activeTheme = usePdfcnTheme();

const styles = computed(() => {
  const current = activeTheme.value;
  const trackColor = props.trackColor;
  const card: Style = {
    backgroundColor: current.colors.background,
    borderColor: current.colors.border,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 7,
  };
  if (trackColor) {
    card.borderLeftColor = trackColor;
    card.borderLeftWidth = 3;
  }
  return {
    card,
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
      marginBottom: 3,
    } satisfies Style,
    roomBadge: {
      backgroundColor: current.colors.muted,
      borderColor: current.colors.border,
      borderRadius: 3,
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 1,
    } satisfies Style,
    trackBadge: {
      backgroundColor: trackColor ? `${trackColor}1A` : current.colors.muted,
      borderRadius: 3,
      paddingHorizontal: 6,
      paddingVertical: 1,
    } satisfies Style,
    trackText: {
      color: trackColor ?? current.colors.foreground,
      fontSize: 7,
      fontWeight: 700,
    } satisfies Style,
    roomText: {
      color: current.colors.mutedForeground,
      fontSize: 7,
      fontWeight: 600,
    } satisfies Style,
    title: {
      fontSize: 9,
      fontWeight: 700,
      lineHeight: 1.25,
    } satisfies Style,
    speaker: {
      color: props.accent,
      fontSize: 7.8,
      fontWeight: 600,
      marginTop: 2,
    } satisfies Style,
    description: {
      color: current.colors.mutedForeground,
      fontSize: 7.2,
      lineHeight: 1.2,
      marginTop: 2,
    } satisfies Style,
  };
});
</script>

<template>
  <View :style="styles.card">
    <View :style="styles.metaRow">
      <View v-if="session.track" :style="styles.trackBadge">
        <Text no-margin :style="styles.trackText">{{ session.track }}</Text>
      </View>
      <View v-if="session.room" :style="styles.roomBadge">
        <Text no-margin :style="styles.roomText">{{ session.room }}</Text>
      </View>
    </View>
    <Text no-margin :style="styles.title">{{ session.title }}</Text>
    <Text v-if="session.speaker" no-margin :style="styles.speaker">{{ session.speaker }}</Text>
    <Text v-if="session.description" no-margin :style="styles.description">
      {{ session.description }}
    </Text>
  </View>
</template>
