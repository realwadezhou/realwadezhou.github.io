import ForecastTracker from '@/components/forecast-tracker';

export const metadata = {
  title: 'Internal checklist — Hindsight Research',
  robots: { index: false },
};

export default function ChecklistRoute() {
  return (
    <ForecastTracker
      key="research-checklist"
      initialView="research-checklist"
    />
  );
}
