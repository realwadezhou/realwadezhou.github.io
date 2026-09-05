import { claims } from '@/lib/claims';
import { AS_OF, RUBRIC_VERSION } from '@/lib/rubric';

export function GET() {
  return Response.json(
    {
      asOf: AS_OF,
      rubricVersion: RUBRIC_VERSION,
      scope:
        'Selective historical collection, 2015–2026. Provisional assessments; no career-wide accuracy estimate.',
      claims: claims.filter((claim) => claim.personId === 'mark-gurman'),
    },
    {
      headers: {
        'Content-Disposition': 'attachment; filename="gurman-evaluations.json"',
      },
    },
  );
}
