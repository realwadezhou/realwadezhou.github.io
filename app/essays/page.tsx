import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Major AI essays — Hindsight Research' };

export default function EssaysRoute() {
  return <ForecastTracker key="essays" initialView="essays" />;
}
