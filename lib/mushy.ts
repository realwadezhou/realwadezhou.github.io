import mushy from '../public/data/hindsight/hindsight-mushy.json';
import type { MushyExport } from './hindsight-types';

// JSON tuples widen to (string | number)[]; the shape is checked in tests/mushy.test.mjs.
export const mushyData = mushy as unknown as MushyExport;
