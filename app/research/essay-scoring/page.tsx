import ForecastTracker from '@/components/forecast-tracker';

export const metadata = {
  title: 'Scoring system: essays — Hindsight Research',
};

export default function EssayScoringRoute() {
  return <ForecastTracker key="essay-scoring" initialView="essay-scoring" />;
}
