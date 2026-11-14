import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Vox pilot — Forecast Index' };

export default function VoxPilotRoute() {
  return <ForecastTracker key="research-vox" initialView="research-vox" />;
}
