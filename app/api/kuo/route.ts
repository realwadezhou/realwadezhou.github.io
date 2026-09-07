import { kuoClaims, kuoCorpus } from '@/lib/kuo-claims';
import { RUBRIC_VERSION } from '@/lib/rubric';

export function GET() {
  return Response.json(
    {
      asOf: kuoCorpus.asOf,
      rubricVersion: RUBRIC_VERSION,
      scope: kuoCorpus.scope,
      claims: kuoClaims,
    },
    {
      headers: {
        'Content-Disposition': 'attachment; filename="kuo-evaluations.json"',
      },
    },
  );
}
