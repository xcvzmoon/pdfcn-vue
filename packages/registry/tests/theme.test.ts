import { parseColor, serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { defaultPrimitives, themePresets } from '../src/themes/index.ts';
import ThemeContent from './fixtures/ThemeContent.vue';
import ThemeDocument from './fixtures/ThemeDocument.vue';

test('all nine presets have complete, valid PDF colors', () => {
  expect(Object.keys(themePresets)).toHaveLength(9);

  for (const [name, theme] of Object.entries(themePresets)) {
    expect(theme.name).toBe(name);
    expect(theme.primitives).toBe(defaultPrimitives);
    expect(theme.page.size).toBe('A4');

    for (const color of Object.values(theme.colors)) {
      expect(color, `${name} has an invalid color`).toMatch(/^#[\da-fA-F]{6}$/);
    }
  }
});

test('uses the professional theme without a provider', async () => {
  const document = await serialize(ThemeContent);
  const text = document.children[0]?.children[0];

  expect(document.metadata.title).toBe('professional');
  expect(text?.kind).toMatchObject({ type: 'Text', content: 'professional' });
  expect(text?.style.color).toEqual(parseColor(themePresets.professional.colors.primary));
});

test('uses the professional theme when no provider theme is supplied', async () => {
  const document = await serialize(ThemeDocument);

  expect(document.metadata.title).toBe('professional');
});

test('scopes themes to each concurrent serialized document', async () => {
  const [forest, blueprint] = await Promise.all([
    serialize(ThemeDocument, { props: { theme: themePresets.forest } }),
    serialize(ThemeDocument, { props: { theme: themePresets.blueprint } }),
  ]);

  expect(forest.metadata.title).toBe('forest');
  expect(forest.children[0]?.children[0]?.style.color).toEqual(
    parseColor(themePresets.forest.colors.primary),
  );
  expect(blueprint.metadata.title).toBe('blueprint');
  expect(blueprint.children[0]?.children[0]?.style.color).toEqual(
    parseColor(themePresets.blueprint.colors.primary),
  );
});
