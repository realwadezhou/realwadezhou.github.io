import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Research status — Forecast Index' };

export default function ResearchRoute() {
  return <ForecastTracker key="research" initialView="research" />;
}
