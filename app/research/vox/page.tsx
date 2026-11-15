import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Vox pilot — Hindsight Research' };

export default function VoxPilotRoute() {
  return <ForecastTracker key="research-vox" initialView="research-vox" />;
}
