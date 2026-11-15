import { notFound } from 'next/navigation';
import ForecastTracker from '@/components/forecast-tracker';
import { essays } from '@/lib/essays';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = essays.find((item) => item.slug === slug);
  return {
    title: essay ? `${essay.title} — Hindsight Research` : 'Essay not found',
  };
}
export default async function EssayRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = essays.find((item) => item.slug === slug);
  if (!essay) notFound();
  return <ForecastTracker key={essay.slug} initialView={essay.slug} />;
}
