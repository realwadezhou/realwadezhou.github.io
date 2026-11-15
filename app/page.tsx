import ForecastTracker from '@/components/forecast-tracker';
const views = [
  'home',
  'all',
  'models',
  'products',
  'capabilities',
  'people',
  'method',
  'andrew-curran',
  'mark-gurman',
  'ming-chi-kuo',
  'apple-launches',
] as const;
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const initialView = views.find((item) => item === view) ?? 'home';
  return <ForecastTracker key={initialView} initialView={initialView} />;
}
