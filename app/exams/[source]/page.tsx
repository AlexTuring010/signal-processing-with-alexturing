import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, TriangleAlert, Maximize2 } from 'lucide-react'
import {
  EXAM_PAPERS,
  SOURCE_LABELS,
  type ExamSource,
} from '@/content/practice/types'

/**
 * The scanned exam paper behind a source chip.
 *
 * Opened in a new tab from «Ιούνιος 2026»-style chips on exercise cards, so a
 * reader who doesn't trust a transcription can check it against the original
 * without losing their place in the problem. `?p=2` / `#p2` lands on a given
 * page — exercise cards deep-link using their `paperPage`.
 */

type Params = { source: string }

export function generateStaticParams(): Params[] {
  return Object.keys(EXAM_PAPERS).map((source) => ({ source }))
}

function paperFor(source: string) {
  if (!Object.prototype.hasOwnProperty.call(EXAM_PAPERS, source)) return null
  const key = source as ExamSource
  return { key, paper: EXAM_PAPERS[key], label: SOURCE_LABELS[key] }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}) {
  const { source } = await params
  const found = paperFor(source)
  if (!found) return { title: 'Θέμα εξετάσεων' }
  return {
    title: `${found.label} — το θέμα`,
    description: `Η πρωτότυπη σάρωση του θέματος: ${found.paper.period}.`,
    robots: { index: false, follow: false },
  }
}

export default async function ExamPaperPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { source } = await params
  const found = paperFor(source)
  if (!found) notFound()
  const { paper, label } = found
  const pages = paper.files.length

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/practice"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Πίσω στο Practice
      </Link>

      <header className="mt-4 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {label}
        </h1>
        <p className="mt-1.5 text-sm text-fg-muted">{paper.period}</p>
        <p className="mt-0.5 text-sm text-fg-subtle">
          {[
            paper.totalPoints ? `${paper.totalPoints} βαθμοί` : null,
            paper.duration,
            pages > 1 ? `${pages} σελίδες` : '1 σελίδα',
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pages > 1 &&
            paper.files.map((_, i) => (
              <a
                key={i}
                href={`#p${i + 1}`}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
              >
                Σελίδα {i + 1}
              </a>
            ))}
          {/* Only meaningful for a single-file paper — a multi-page scan is
              downloaded per page, from each page's own link below. */}
          {pages === 1 && (
            <a
              href={`/exams/${paper.files[0]}`}
              download
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Κατέβασμα
            </a>
          )}
        </div>
      </header>

      {paper.scanWarning && (
        <div className="mt-5 flex gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-sm">
          <TriangleAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <p className="text-fg-muted">{paper.scanWarning}</p>
        </div>
      )}

      {paper.kind === 'pdf' ? (
        <iframe
          src={`/exams/${paper.files[0]}`}
          title={`${label} — PDF`}
          className="mt-6 h-[85vh] w-full rounded-lg border border-border bg-bg"
        />
      ) : (
        <div className="mt-6 space-y-8">
          {paper.files.map((file, i) => (
            <section key={file} id={`p${i + 1}`} className="scroll-mt-20">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-sm font-semibold text-fg-muted">
                  Σελίδα {i + 1}
                  {pages > 1 && (
                    <span className="text-fg-subtle"> από {pages}</span>
                  )}
                </h2>
                <a
                  href={`/exams/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-accent"
                >
                  <Maximize2 className="h-3 w-3" aria-hidden="true" />
                  Πλήρες μέγεθος
                </a>
                <a
                  href={`/exams/${file}`}
                  download
                  className="inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-accent"
                >
                  <Download className="h-3 w-3" aria-hidden="true" />
                  Κατέβασμα
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/exams/${file}`}
                alt={`${label} — σελίδα ${i + 1}`}
                className="w-full rounded-lg border border-border bg-white"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </section>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-fg-subtle">
        Η σάρωση είναι το πρωτότυπο θέμα. Αν κάτι στη μεταγραφή μιας άσκησης δεν
        συμφωνεί με αυτή την εικόνα, το σωστό είναι η εικόνα.
      </p>
    </div>
  )
}
