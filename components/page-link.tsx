import type { AnchorHTMLAttributes } from 'react';

/**
 * Internal link as a plain anchor (full page load). The site is a static export for GitHub
 * Pages, and vinext's client-side router fails in static builds, so next/link is not used.
 */
export default function Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string },
) {
  return <a {...props} />;
}
