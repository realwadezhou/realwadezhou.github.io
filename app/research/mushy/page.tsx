import ForecastTracker from '@/components/forecast-tracker';

export const metadata = { title: 'Pundit priors — Hindsight Research' };

export default async function MushyRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <ForecastTracker
      key={`research-mushy-${q ?? ''}`}
      initialView="research-mushy"
      initialQid={q}
    />
  );
}
