'use client';
import { useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Cpu,
  FileText,
  Layers,
  Radio,
  Smartphone,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { claims, people, type Claim } from '@/lib/claims';

type View =
  | 'all'
  | 'models'
  | 'products'
  | 'capabilities'
  | 'people'
  | 'method'
  | 'andrew-curran'
  | 'mark-gurman';
const titles: Record<View, string> = {
  all: 'Forecast index',
  models: 'Model releases',
  products: 'Product releases',
  capabilities: 'Capabilities & adoption',
  people: 'People',
  method: 'How we evaluate',
  'andrew-curran': 'Andrew Curran',
  'mark-gurman': 'Mark Gurman',
};
const descriptions: Record<View, string> = {
  all: 'Dated predictions about technology. Original claims, release milestones, and the evidence to evaluate them.',
  models:
    'Who anticipates the next model? Track names, announcement dates, limited access, and general availability separately.',
  products:
    'Concrete claims about hardware, features, and launch windows. Our first cases follow Apple reporting.',
  capabilities:
    'Predictions about what technology can do, and when people will use it.',
  people:
    'A starting set of sources to investigate. These case studies do not yet establish anyone’s forecasting accuracy.',
  method:
    'Make each claim inspectable. Preserve uncertainty in the evidence and in the interpretation.',
  'andrew-curran': 'AI reporting and commentary · @AndrewCurran_',
  'mark-gurman': 'Technology reporting · Bloomberg / Power On',
};
function Status({ value }: { value: Claim['status'] }) {
  return (
    <span
      className={`status status-${value === 'Supported' ? 'supported' : 'review'}`}
    >
      <span aria-hidden="true" />
      {value}
    </span>
  );
}
function Navigation({
  view,
  change,
}: {
  view: View;
  change: (view: View) => void;
}) {
  const { setOpenMobile } = useSidebar();
  const go = (next: View) => {
    change(next);
    setOpenMobile(false);
  };
  const nav = (key: View, Icon: typeof Layers) => (
    <SidebarMenuItem key={key}>
      <SidebarMenuButton
        className="nav-item"
        isActive={view === key}
        onClick={() => go(key)}
        aria-current={view === key ? 'page' : undefined}
      >
        <Icon />
        <span>{titles[key]}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
  return (
    <Sidebar className="site-sidebar">
      <SidebarHeader className="brand">
        <Radio size={21} strokeWidth={1.8} />
        <span>Forecast Index</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>EXPLORE</SidebarGroupLabel>
          <SidebarMenu>
            {nav('all', Layers)}
            {nav('people', Users)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>FORECAST TYPES</SidebarGroupLabel>
          <SidebarMenu>
            {nav('models', Cpu)}
            {nav('products', Smartphone)}
            {nav('capabilities', BookOpen)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>PEOPLE IN THE PILOT</SidebarGroupLabel>
          <SidebarMenu>
            {nav('andrew-curran', FileText)}
            {nav('mark-gurman', FileText)}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>THE PROJECT</SidebarGroupLabel>
          <SidebarMenu>{nav('method', BookOpen)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="sidebar-note">
        <span className="pilot-label">Pilot research</span>
        <p>
          A small corpus.
          <br />
          An auditable record.
        </p>
        <span>Started September 2026</span>
      </SidebarFooter>
    </Sidebar>
  );
}
function ClaimDetail({ claim }: { claim: Claim }) {
  return (
    <>
      <SheetHeader>
        <div className="eyebrow">
          {claim.id} ·{' '}
          {claim.type === 'models' ? 'MODEL RELEASE' : 'PRODUCT RELEASE'}
        </div>
        <SheetTitle className="detail-title">{claim.title}</SheetTitle>
        <SheetDescription>{claim.person} · Retrospective case</SheetDescription>
      </SheetHeader>
      <div className="detail-body">
        <Status value={claim.status} />
        <p>{claim.summary}</p>
        <dl className="claim-facts">
          <div>
            <dt>Published</dt>
            <dd>{claim.published}</dd>
          </div>
          <div>
            <dt>Forecast window</dt>
            <dd>{claim.target}</dd>
          </div>
          <div>
            <dt>Milestone</dt>
            <dd>{claim.milestone}</dd>
          </div>
          <div>
            <dt>Probability</dt>
            <dd>Not recorded · no probability score</dd>
          </div>
          <div>
            <dt>Original source</dt>
            <dd>{claim.sourceState}</dd>
          </div>
        </dl>
        <h3>Claim & context</h3>
        <p>{claim.context}</p>
        {claim.quote && <blockquote>{claim.quote}</blockquote>}
        <h3>Evidence & assessment</h3>
        <p>{claim.assessment}</p>
        <h3>Sources</h3>
        <ol className="sources">
          {claim.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <p>{source.note}</p>
            </li>
          ))}
        </ol>
        <h3>Review record</h3>
        <p>{claim.review}</p>
        <p className="fine-print">
          Added 4 September 2026. Inclusion is for method development, not a
          representative sample of this person’s predictions.
        </p>
      </div>
    </>
  );
}
function Method() {
  return (
    <div className="prose-content">
      <h2>Different claims need different tests</h2>
      <p>
        <strong>Product releases</strong> concern a device, feature,
        specification, or launch window. <strong>Model releases</strong> concern
        a model’s identity, announcement, access stage, or availability.{' '}
        <strong>Capabilities and adoption</strong> need a measurable threshold,
        a date, and a defined evaluation.
      </p>
      <h2>Two records, kept separate</h2>
      <p>
        Historical public statements receive an evidence-backed assessment. A
        probabilistic forecast receives a proper score only when its
        probability, deadline, and resolution criteria were recorded before the
        outcome. We never invent a probability from confident wording.
      </p>
      <h2>What counts as a release?</h2>
      <p>
        An announcement, private preview, limited rollout, public API, and
        general availability are distinct milestones. A prediction about one
        does not automatically succeed when another happens. Preserve the
        original meaning; record ambiguous wording as ambiguous.
      </p>
      <h2>What makes a useful call?</h2>
      <p>
        Record how far ahead the call was made, how narrow its time window was,
        and what was already public. Distinguish original reporting, independent
        forecasting, inference from public clues, and repetition of someone
        else’s report. Track all revisions and link claims derived from the same
        report.
      </p>
      <h2>Evidence before a verdict</h2>
      <p>
        Keep the original post URL, timestamp, wording, surrounding thread, and
        an archived snapshot when obtainable. Search results, mirrors, and Grok
        can help find a claim; an incomplete source remains visibly incomplete.
        Check the outcome against the company’s dated announcement or release
        notes.
      </p>
      <h2>What these labels mean</h2>
      <p>
        <strong>Supported</strong> means the available evidence supports this
        historical interpretation. <strong>Needs source</strong> means the
        original dated claim still needs to be recovered. Neither label is a
        probability score or a person-level accuracy estimate.
      </p>
      <h2>Before comparing people</h2>
      <p>
        Declare a source list and publication window before collection. Include
        misses and unresolvable claims, use independent review, account for
        related claims, and compare matching milestones and lead times. The
        present pilot is too small and selectively collected to rank people.
      </p>
    </div>
  );
}
export default function Home() {
  const [view, setView] = useState<View>('all');
  const [selected, setSelected] = useState<Claim | null>(null);
  const filtered = claims.filter(
    (c) => view === 'all' || c.type === view || c.personId === view,
  );
  const person = people.find((p) => p.id === view);
  return (
    <SidebarProvider style={{ '--sidebar-width': '15rem' } as CSSProperties}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation view={view} change={setView} />
      <SidebarInset>
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="sidebar-toggle" />
            <span>Research</span>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{titles[view]}</span>
          </div>
          <span className="edition">4 September 2026</span>
        </header>
        <div id="main-content" className="page-content" tabIndex={-1}>
          <div className="page-heading">
            <div className="eyebrow">AI & TECHNOLOGY</div>
            <h1>{titles[view]}</h1>
            <p className="intro">{descriptions[view]}</p>
          </div>
          {view === 'method' ? (
            <Method />
          ) : view === 'people' ? (
            <div className="people-list">
              {people.map((p) => (
                <article key={p.id}>
                  <div className="person-monogram">{p.initials}</div>
                  <div>
                    <button
                      className="text-link person-name"
                      onClick={() => setView(p.id as View)}
                    >
                      {p.name}
                      <ChevronRight size={16} />
                    </button>
                    <p>{p.description}</p>
                    <span className="fine-print">
                      {claims.filter((c) => c.personId === p.id).length} case
                      {claims.filter((c) => c.personId === p.id).length === 1
                        ? ''
                        : 's'}{' '}
                      · No accuracy estimate
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <>
              {person && (
                <div className="person-context">
                  <p>{person.note}</p>
                  <a
                    className="external-link"
                    href={person.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source reference
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
              <div className="collection-meta">
                <span>
                  {filtered.length} {filtered.length === 1 ? 'case' : 'cases'}
                </span>
                <span>Retrospective pilot</span>
                <span>No forecaster rankings</span>
              </div>
              {filtered.length ? (
                <Table className="forecast-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forecast</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Assessment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="row-type">
                            {c.type === 'models'
                              ? 'Model release'
                              : 'Product release'}{' '}
                            <span>· {c.id}</span>
                          </div>
                          <button
                            className="claim-link"
                            onClick={() => setSelected(c)}
                          >
                            {c.title}
                            <ChevronRight size={15} aria-hidden="true" />
                          </button>
                          <button
                            className="author-link"
                            onClick={() => setView(c.personId as View)}
                          >
                            {c.person}
                          </button>
                        </TableCell>
                        <TableCell>
                          {c.published}
                          <span className="cell-note">{c.dateNote}</span>
                        </TableCell>
                        <TableCell>
                          {c.target}
                          <span className="cell-note">{c.milestone}</span>
                        </TableCell>
                        <TableCell>
                          <Status value={c.status} />
                          <span className="cell-note">{c.statusNote}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="empty-state">
                  <BookOpen size={25} strokeWidth={1.4} />
                  <h2>No cases collected yet</h2>
                  <p>
                    This category will cover measurable capability and adoption
                    forecasts. The first collection focuses on product and model
                    releases.
                  </p>
                </div>
              )}
              <div className="reading-note">
                <BookOpen size={18} strokeWidth={1.5} />
                <div>
                  <h2>Read the evidence behind each call</h2>
                  <p>
                    Open a forecast to inspect its source, interpretation, and
                    review status. A source lead is kept visible until the
                    original claim can be verified.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setView('method')}
                  >
                    How we evaluate
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>Forecast Index</span>
            <span>Sources first. Conclusions revisable.</span>
          </footer>
        </div>
      </SidebarInset>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="claim-sheet" side="right">
          {selected && <ClaimDetail claim={selected} />}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
