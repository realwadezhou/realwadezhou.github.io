import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Pundits vs markets — Forecast Index' };

export default function MushyRoute() {
  return <ForecastTracker key="research-mushy" initialView="research-mushy" />;
}
