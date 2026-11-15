import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Leaderboard — Hindsight Research' };

export default function CalibrationRoute() {
  return (
    <ForecastTracker key="research-calibration" initialView="research-calibration" />
  );
}
