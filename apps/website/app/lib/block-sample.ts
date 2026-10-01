import * as v from 'valibot';

export type BlockSampleField = string | number | boolean | null;
export type BlockSampleValue = BlockSampleField | BlockSampleValue[] | BlockSampleObject;
export type BlockSampleObject = { [key: string]: BlockSampleValue };
export type BlockSample = BlockSampleObject;

const blockSampleValueSchema: v.GenericSchema<BlockSampleValue> = v.lazy(() =>
  v.union([
    v.string(),
    v.pipe(v.number(), v.finite()),
    v.boolean(),
    v.null(),
    v.array(blockSampleValueSchema),
    v.record(v.string(), blockSampleValueSchema),
  ]),
);

export const blockSampleSchema = v.record(v.string(), blockSampleValueSchema);
