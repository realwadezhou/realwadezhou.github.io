import Link from 'next/link';
import {
  gradingKinds,
  provenances,
  provenanceRule,
  rungs,
} from '@/lib/ontology';
import { RUBRIC_VERSION } from '@/lib/rubric';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function OntologyOverview() {
  return (
    <div className="prose-content rubric-content">
      <h2>Two kinds of grading</h2>
      {gradingKinds.map((kind) => (
        <section key={kind.label}>
          <h3>{kind.label}</h3>
          <p>{kind.definition}</p>
          <p>
            <strong>Unit:</strong> {kind.unit}. <strong>Output:</strong>{' '}
            {kind.output}. {kind.probability}
          </p>
        </section>
      ))}
      <p className="rubric-note">
        The Vox pilot tests the reading step by hiding a stated number and
        trying to recover it. Recovery error is not an author’s forecast
        accuracy score.
      </p>
      <h2>Five rungs</h2>
      <Table className="rubric-table">
        <TableHeader>
          <TableRow>
            <TableHead>Rung</TableHead>
            <TableHead>Definition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rungs.map((rung, index) => (
            <TableRow key={rung.label}>
              <TableCell>
                <strong>
                  {index + 1}. {rung.title}
                </strong>
              </TableCell>
              <TableCell>{rung.definition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="rubric-note">
        Existing claim badges are a coarse mapping: a recorded probability is
        “stated”; otherwise the badge is “flat call”. They do not assign a
        probability or reclassify the original wording’s hedges.
      </p>
      <h2>Three provenances</h2>
      <Table className="rubric-table">
        <TableHeader>
          <TableRow>
            <TableHead>Provenance</TableHead>
            <TableHead>Definition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {provenances.map((provenance) => (
            <TableRow key={provenance.label}>
              <TableCell>
                <strong>{provenance.label}</strong>
              </TableCell>
              <TableCell>{provenance.definition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>
        <strong>{provenanceRule}</strong> A rung describes the author’s
        commitment; provenance describes where a probability came from. A
        flat-call badge alone does not apply the near-certain convention.
      </p>
      <p className="rubric-note">
        Rubric {RUBRIC_VERSION} still governs claim verdicts. Prior grading is a
        separate research track.{' '}
        <Link href="/?view=method">Read the Grading rubric →</Link>
      </p>
    </div>
  );
}
