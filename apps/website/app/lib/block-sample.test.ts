import * as v from 'valibot';
import { expect, test } from 'vite-plus/test';
import { sampleMeetingMinutesData } from '../../../../packages/registry/src/forme/blocks/meeting-minutes/meeting-minutes.sample';
import { blockSampleSchema } from './block-sample';

test('preserves nested discussion arrays when parsing meeting minutes', () => {
  const sample = v.parse(blockSampleSchema, sampleMeetingMinutesData);

  expect(sample).toEqual(sampleMeetingMinutesData);
  expect(Array.isArray(sample.discussions)).toBe(true);
});

for (const value of [NaN, Infinity, -Infinity, undefined, () => 'unsafe']) {
  test(`rejects unsupported block sample value ${String(value)}`, () => {
    expect(v.safeParse(blockSampleSchema, { nested: [{ value }] }).success).toBe(false);
  });
}

test('preserves markup as plain block text', () => {
  const text = '<script>alert("sample")</script>';
  expect(v.parse(blockSampleSchema, { title: text })).toEqual({ title: text });
});
