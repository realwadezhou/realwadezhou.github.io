import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Pundit calibration — Forecast Index' };

export default function CalibrationRoute() {
  return (
    <ForecastTracker key="research-calibration" initialView="research-calibration" />
  );
}
