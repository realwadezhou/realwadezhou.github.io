import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'How we grade — Forecast Index' };

export default function OntologyRoute() {
  return (
    <ForecastTracker key="research-ontology" initialView="research-ontology" />
  );
}
