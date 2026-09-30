import * as v from 'valibot';
import { expect, test } from 'vite-plus/test';
import { sampleMeetingMinutesData } from '../../../../packages/registry/src/forme/blocks/meeting-minutes/meeting-minutes.sample';
import { blockSampleSchema } from './block-sample';

test('preserves nested discussion arrays when parsing meeting minutes', () => {
  const sample = v.parse(blockSampleSchema, sampleMeetingMinutesData);

  expect(sample).toEqual(sampleMeetingMinutesData);
  expect(Array.isArray(sample.discussions)).toBe(true);
});
