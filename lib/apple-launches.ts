import catalog from '../public/data/apple-launches.json';

export const appleLaunches = catalog.launches;
export type AppleLaunch = (typeof appleLaunches)[number];
export const launchAsOf = catalog.asOf;
export const launchById = new Map(
  appleLaunches.map((launch) => [launch.id, launch]),
);

export function availabilityText(launch: AppleLaunch) {
  if (!launch.availabilityDate) return 'Not established';
  return `${launch.availabilityPrecision === 'week' ? 'Week of ' : ''}${launch.availabilityDate}`;
}
