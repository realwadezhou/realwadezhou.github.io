import ForecastTracker from '@/components/forecast-tracker';

export const metadata = {
  title: 'Scoring system: quantifying vibes — Hindsight Research',
};

export default function VibesScoringRoute() {
  return <ForecastTracker key="vibes-scoring" initialView="vibes-scoring" />;
}
