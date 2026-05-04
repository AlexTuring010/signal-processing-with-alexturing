import Link from 'next/link'
import { ArrowRight, Sparkles, BookOpen, Sigma, FlaskConical } from 'lucide-react'
import { CHAPTERS, AVAILABLE_COUNT, ALL_SECTIONS } from '@/lib/content-index'

const FIRST_AVAILABLE = ALL_SECTIONS.find((s) => s.available)

export default function HomePage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:py-20">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs font-medium tracking-wide text-fg-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          K21 — Συστήματα Επικοινωνιών · ΕΚΠΑ ΔΙΤ
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Signal Processing με{' '}
          <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
            AlexTuring
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-muted">
          Διαδραστικός οδηγός για το μάθημα <em>Συστήματα Επικοινωνιών</em>. Από το{' '}
          μηδέν — με διαίσθηση πρώτα, μαθηματικά μετά, και visualizations που τα{' '}
          δένουν μεταξύ τους.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {FIRST_AVAILABLE && (
            <Link
              href={`/${FIRST_AVAILABLE.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
            >
              Ξεκίνα από εδώ
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/formulas"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
          >
            Τυπολόγιο
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto mt-20 grid max-w-5xl gap-5 sm:grid-cols-3">
        <Pillar
          Icon={BookOpen}
          title="Από το μηδέν"
          body="Καμία υπόθεση ότι ξέρεις. Κάθε έννοια εξηγείται με διαίσθηση και απλό παράδειγμα πριν μπει η πρώτη εξίσωση."
        />
        <Pillar
          Icon={Sigma}
          title="Μαθηματικά με νόημα"
          body="Όταν εμφανίζεται μια εξίσωση, εξηγείται τι λέει στ' αλήθεια — όχι μόνο πώς γράφεται."
        />
        <Pillar
          Icon={FlaskConical}
          title="Lab & visualizations"
          body="Τα interactive demos σού επιτρέπουν να δεις πώς αλλάζει η συμπεριφορά όταν τραβάς ένα slider. Το lab MATLAB είναι προαιρετικό αλλά πάντα δίπλα."
        />
      </section>

      {/* Roadmap */}
      <section className="mx-auto mt-20 max-w-5xl">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Η ύλη</h2>
          <span className="text-sm text-fg-muted">
            {AVAILABLE_COUNT} από {ALL_SECTIONS.length} ενότητες έτοιμες
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CHAPTERS.map((c) => {
            const ready = c.sections.filter((s) => s.available).length
            const total = c.sections.length
            return (
              <li
                key={c.id}
                className="rounded-lg border border-border bg-bg-elevated px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold tracking-tight">{c.title}</h3>
                  <span className="shrink-0 text-xs text-fg-subtle">
                    {ready}/{total}
                  </span>
                </div>
                {c.blurb && (
                  <p className="mt-1 text-sm text-fg-muted">{c.blurb}</p>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {/* Note */}
      <section className="mx-auto mt-16 max-w-3xl rounded-lg border border-dashed border-border bg-bg-soft px-5 py-4 text-sm text-fg-muted">
        <p>
          <strong className="text-fg">Σημείωση:</strong> Το site είναι σε ενεργή{' '}
          ανάπτυξη. Φτιάχνουμε μια ενότητα τη φορά, με τη φιλοσοφία ότι αν δεν{' '}
          βγάζει νόημα σε κάποιον που ξεκινάει από το μηδέν, την ξαναγράφουμε.
        </p>
      </section>
    </div>
  )
}

function Pillar({
  Icon,
  title,
  body,
}: {
  Icon: typeof BookOpen
  title: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{body}</p>
    </div>
  )
}
