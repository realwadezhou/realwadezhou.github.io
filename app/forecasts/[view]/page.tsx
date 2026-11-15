import { notFound } from 'next/navigation';
import ForecastTracker from '@/components/forecast-tracker';

// Explicit-forecast views, each prerendered as a static page (/forecasts/<view>).
const VIEWS = {
  all: 'All forecasts',
  models: 'Model releases',
  products: 'Apple releases',
  capabilities: 'Capabilities & adoption',
  people: 'People',
  method: 'Scoring system: explicit forecasts',
  'andrew-curran': 'Andrew Curran',
  'mark-gurman': 'Mark Gurman',
  'ming-chi-kuo': 'Ming-Chi Kuo',
  'apple-launches': 'Apple launch dates',
} as const;
type ForecastView = keyof typeof VIEWS;
const isView = (v: string): v is ForecastView => v in VIEWS;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VIEWS).map((view) => ({ view }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  return {
    title: `${isView(view) ? VIEWS[view] : 'Not found'} — Hindsight Research`,
  };
}

export default async function ForecastRoute({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  if (!isView(view)) notFound();
  return <ForecastTracker key={view} initialView={view} />;
}
