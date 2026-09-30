<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { EventTicketData } from './event-ticket.types.ts';
  import { Document, Page, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import QrCode from '../../components/QrCode.vue';
  import Text from '../../components/Text.vue';
  import { resolveColor } from '../../lib/resolve-color.ts';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { sampleEventTicketData } from './event-ticket.sample.ts';

  const props = defineProps<{
    data?: EventTicketData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const ticket = computed(() => props.data ?? sampleEventTicketData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  // Standard event ticket, 7" x 3.5", expressed in PDF points (72 dpi)
  const TICKET_SIZE = { height: 252, width: 504 };
  const STUB_WIDTH = 120;
  const STRIPE_WIDTH = 8;
  const NOTCH_RADIUS = 8;

  // Forme renders neither dashed borders nor dashed SVG strokes, so the
  // perforation is painted as a stack of short dashes along the stub seam.
  const PERFORATION_WIDTH = 1.5;
  const PERFORATION_DASH = 4;
  const PERFORATION_GAP = 3;

  const perforationOffsets: number[] = [];
  for (let offset = 0; offset < TICKET_SIZE.height; offset += PERFORATION_DASH + PERFORATION_GAP) {
    perforationOffsets.push(offset);
  }

  function hexRgb(color: string): [number, number, number] | null {
    const hex = color.trim().replace(/^#/, '');

    if (/^[0-9a-f]{3}$/i.test(hex)) {
      const [r, g, b] = [...hex];
      if (r === undefined || g === undefined || b === undefined) return null;
      return [Number.parseInt(r + r, 16), Number.parseInt(g + g, 16), Number.parseInt(b + b, 16)];
    }

    if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
      return [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ];
    }

    return null;
  }

  function inkOnAccent(accent: string, light: string, dark: string): string {
    const rgb = hexRgb(accent);

    if (!rgb) {
      return dark;
    }

    const [r, g, b] = rgb;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance > 0.55 ? dark : light;
  }

  function socialHandle(url: string): string {
    const clean = url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/$/, '');
    const parts = clean.split('/').filter(Boolean);
    const handle = parts.at(-1);

    if (parts.length > 1 && handle) {
      return handle.startsWith('@') ? handle : `@${handle}`;
    }

    return clean;
  }

  const accent = computed(() => {
    const current = activeTheme.value;
    return resolveColor(ticket.value.accentColor ?? current.colors.primary, current.colors);
  });
  const onAccent = computed(() => {
    const current = activeTheme.value;
    return inkOnAccent(accent.value, current.colors.background, current.colors.foreground);
  });

  const styles = computed(() => {
    const current = activeTheme.value;
    const paper = current.colors.background;
    const ink = current.colors.foreground;
    const quiet = current.colors.mutedForeground;
    const accentColor = accent.value;
    return {
      admit: {
        color: onAccent.value,
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
      } satisfies Style,
      body: {
        flex: 1,
        height: TICKET_SIZE.height,
        justifyContent: 'space-between',
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 18,
        paddingTop: 18,
      } satisfies Style,
      brand: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
      } satisfies Style,
      fact: {
        flexShrink: 1,
        minWidth: 0,
        paddingRight: 12,
      } satisfies Style,
      facts: {
        flexDirection: 'row',
      } satisfies Style,
      footer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
      } satisfies Style,
      label: {
        color: quiet,
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: 1.2,
        marginBottom: 3,
        textTransform: 'uppercase',
      } satisfies Style,
      logo: { borderRadius: 3, height: 14, width: 14 } satisfies Style,
      notchBottom: {
        backgroundColor: paper,
        borderRadius: NOTCH_RADIUS,
        bottom: -NOTCH_RADIUS,
        height: NOTCH_RADIUS * 2,
        left: TICKET_SIZE.width - STUB_WIDTH - NOTCH_RADIUS,
        position: 'absolute',
        width: NOTCH_RADIUS * 2,
      } satisfies Style,
      notchTop: {
        backgroundColor: paper,
        borderRadius: NOTCH_RADIUS,
        height: NOTCH_RADIUS * 2,
        left: TICKET_SIZE.width - STUB_WIDTH - NOTCH_RADIUS,
        position: 'absolute',
        top: -NOTCH_RADIUS,
        width: NOTCH_RADIUS * 2,
      } satisfies Style,
      organizer: {
        color: quiet,
        // Forme ignores `marginLeft: "auto"`, so the organizer line absorbs the
        // free space and pushes the ticket-type pill to the right edge.
        flexGrow: 1,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
      } satisfies Style,
      page: {
        alignItems: 'stretch',
        backgroundColor: paper,
        flexDirection: 'row',
        height: TICKET_SIZE.height,
        overflow: 'hidden',
        position: 'relative',
        width: TICKET_SIZE.width,
      } satisfies Style,
      perforation: {
        height: TICKET_SIZE.height,
        left: TICKET_SIZE.width - STUB_WIDTH - PERFORATION_WIDTH / 2,
        position: 'absolute',
        top: 0,
        width: PERFORATION_WIDTH,
      } satisfies Style,
      perforationDash: {
        backgroundColor: paper,
        height: PERFORATION_DASH,
        marginBottom: PERFORATION_GAP,
        width: PERFORATION_WIDTH,
      } satisfies Style,
      pill: {
        backgroundColor: accentColor,
        borderRadius: 9,
        paddingHorizontal: 8,
        paddingVertical: 3,
      } satisfies Style,
      pillText: {
        color: onAccent.value,
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      } satisfies Style,
      qr: {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        padding: 5,
      } satisfies Style,
      serial: {
        color: onAccent.value,
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
      } satisfies Style,
      socialItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
      } satisfies Style,
      socialLabel: {
        color: quiet,
        fontSize: 6.5,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      } satisfies Style,
      socialList: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
      } satisfies Style,
      socialValue: {
        color: quiet,
        fontSize: 6.5,
      } satisfies Style,
      stripe: {
        backgroundColor: accentColor,
        height: TICKET_SIZE.height,
        width: STRIPE_WIDTH,
      } satisfies Style,
      stub: {
        alignItems: 'center',
        backgroundColor: accentColor,
        height: TICKET_SIZE.height,
        justifyContent: 'space-between',
        paddingBottom: 14,
        paddingHorizontal: 12,
        paddingTop: 16,
        width: STUB_WIDTH,
      } satisfies Style,
      terms: {
        color: quiet,
        flex: 1,
        fontSize: 6.5,
        lineHeight: 1.4,
        paddingRight: 8,
      } satisfies Style,
      title: {
        color: ink,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: -0.6,
        lineHeight: 1.08,
        marginBottom: 8,
      } satisfies Style,
      value: {
        color: ink,
        fontSize: 12,
        fontWeight: 700,
      } satisfies Style,
      venue: {
        color: quiet,
        fontSize: 10,
        lineHeight: 1.4,
      } satisfies Style,
    };
  });

  const documentTitle = computed(() => `${ticket.value.eventName} ${ticket.value.ticketNumber}`);
  const hasFooter = computed(
    () => Boolean(ticket.value.terms) || (ticket.value.socialLinks?.length ?? 0) > 0,
  );
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        :size="TICKET_SIZE"
        :margin="0"
      >
        <View :style="styles.page">
          <View :style="styles.stripe" />

          <View :style="styles.body">
            <View>
              <View :style="styles.brand">
                <PdfImage
                  v-if="ticket.logoUrl"
                  fit="contain"
                  :src="ticket.logoUrl"
                  :style="styles.logo"
                />
                <Text
                  no-margin
                  :style="styles.organizer"
                >
                  {{ ticket.organizer ?? 'Event ticket' }}
                </Text>
                <View :style="styles.pill">
                  <Text
                    no-margin
                    :style="styles.pillText"
                    >{{ ticket.ticketType }}</Text
                  >
                </View>
              </View>
              <Text
                no-margin
                :style="styles.title"
                >{{ ticket.eventName }}</Text
              >
              <Text
                no-margin
                :style="styles.venue"
                >{{ ticket.venue }}</Text
              >
              <Text
                no-margin
                :style="styles.venue"
                >{{ ticket.address }}</Text
              >
            </View>

            <View>
              <View :style="styles.facts">
                <View :style="styles.fact">
                  <Text
                    no-margin
                    :style="styles.label"
                    >Date</Text
                  >
                  <Text
                    no-margin
                    :style="styles.value"
                    >{{ ticket.eventDate }}</Text
                  >
                </View>
                <View :style="styles.fact">
                  <Text
                    no-margin
                    :style="styles.label"
                    >Time</Text
                  >
                  <Text
                    no-margin
                    :style="styles.value"
                    >{{ ticket.eventTime }}</Text
                  >
                </View>
                <View
                  v-if="ticket.doorsOpen"
                  :style="styles.fact"
                >
                  <Text
                    no-margin
                    :style="styles.label"
                    >Doors</Text
                  >
                  <Text
                    no-margin
                    :style="styles.value"
                    >{{ ticket.doorsOpen }}</Text
                  >
                </View>
                <View
                  v-if="ticket.seat"
                  :style="styles.fact"
                >
                  <Text
                    no-margin
                    :style="styles.label"
                    >Seat</Text
                  >
                  <Text
                    no-margin
                    :style="styles.value"
                  >
                    {{ `${ticket.seat.section}–${ticket.seat.row}–${ticket.seat.number}` }}
                  </Text>
                </View>
              </View>
              <View
                v-if="hasFooter"
                :style="styles.footer"
              >
                <Text
                  v-if="ticket.terms"
                  no-margin
                  :style="styles.terms"
                >
                  {{ ticket.terms }}
                </Text>
                <View
                  v-if="ticket.socialLinks && ticket.socialLinks.length > 0"
                  :style="styles.socialList"
                >
                  <View
                    v-for="link in ticket.socialLinks"
                    :key="`${link.platform}-${link.url}`"
                    :style="styles.socialItem"
                  >
                    <Text
                      no-margin
                      :style="styles.socialLabel"
                      >{{ link.platform }}</Text
                    >
                    <Text
                      no-margin
                      :style="styles.socialValue"
                    >
                      {{ socialHandle(link.url) }}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View :style="styles.stub">
            <Text
              no-margin
              :style="styles.admit"
              >Admit one</Text
            >
            <View :style="styles.qr">
              <PdfImage
                v-if="ticket.qrCodeUrl"
                fit="contain"
                :height="68"
                :src="ticket.qrCodeUrl"
                :width="68"
              />
              <QrCode
                v-else
                background-color="#ffffff"
                color="#000000"
                :size="68"
                :value="ticket.ticketNumber"
              />
            </View>
            <Text
              no-margin
              :style="styles.serial"
              >{{ ticket.ticketNumber }}</Text
            >
          </View>

          <View :style="styles.perforation">
            <View
              v-for="offset in perforationOffsets"
              :key="`perforation-${offset}`"
              :style="styles.perforationDash"
            />
          </View>

          <View :style="styles.notchTop" />
          <View :style="styles.notchBottom" />
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
