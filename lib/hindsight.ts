import pilot from '../public/data/hindsight/hindsight-vox-pilot.json';
import checklist from '../public/data/hindsight/hindsight-checklist.json';
import type {
  HindsightChecklist,
  HindsightItem,
  HindsightPilot,
} from './hindsight-types';

export const voxPilot = pilot as HindsightPilot;
export const hindsightChecklist = checklist as HindsightChecklist;
export const hindsightModels = [
  ...new Set(
    voxPilot.items.flatMap((item) => item.inferred.map((entry) => entry.model)),
  ),
];
export const leakageYearGroups = [
  { label: '2019–2023', start: 2019, end: 2023 },
  { label: '2024–2025', start: 2024, end: 2025 },
] as const;

export function modelMeanAbsoluteError(
  model: string,
  items: HindsightItem[] = voxPilot.items,
) {
  const errors = items.flatMap((item) => {
    const mid = item.inferred.find((entry) => entry.model === model)?.mid;
    return mid == null ? [] : [Math.abs(mid - item.statedP)];
  });
  return {
    n: errors.length,
    mae: errors.length
      ? errors.reduce((sum, value) => sum + value, 0) / errors.length
      : null,
  };
}

export function outcomeDirectedBias(
  model: string,
  group: { start: number; end: number },
  items: HindsightItem[] = voxPilot.items,
) {
  const values = items.flatMap((item) => {
    const mid = item.inferred.find((entry) => entry.model === model)?.mid;
    if (
      item.year < group.start ||
      item.year > group.end ||
      item.outcome === null ||
      mid == null
    )
      return [];
    return [(mid - item.statedP) * (item.outcome === 1 ? 1 : -1)];
  });
  const n = values.length;
  if (!n) return { mean: null, se: null, n };
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const se =
    n > 1
      ? Math.sqrt(
          values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
            (n - 1) /
            n,
        )
      : null;
  return { mean, se, n };
}
