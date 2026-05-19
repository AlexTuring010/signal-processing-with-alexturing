import Link from 'next/link'
import { Sigma, BookOpen } from 'lucide-react'

import { FORMULA_SHEET } from '@/content/practice/formulas'
import { TOPIC_COLORS, SECTION_TITLES } from '@/content/practice/types'
import { SectionComments } from '@/components/layout/SectionComments'

export const metadata = {
  title: 'Τυπολόγιο',
  description:
    'Το επίσημο τυπολόγιο του μαθήματος, οργανωμένο ανά κεφάλαιο. Κάθε τύπος έχει σύνδεσμο προς την ενότητα όπου παράγεται και πεδίο σχολίων για διορθώσεις, διευκρινίσεις ή tips.',
}

export default function FormulasPage() {
  return (
    <>
      <header className="not-prose mb-8">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
          <Sigma className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Τυπολόγιο</h1>
        <p className="mt-2 text-fg-muted">
          Όσα <em>δεν</em> χρειάζεται να μάθεις απέξω — δίνονται στην
          εξέταση. Κάθε τύπος συνδέεται με την ενότητα όπου παράγεται, ώστε
          να βλέπεις πώς προκύπτει αν ξεχάσεις. Άσε σχόλιο σε όποιον τύπο
          σε δυσκόλεψε.
        </p>
      </header>

      {FORMULA_SHEET.map((section) => (
        <section key={section.topic} className="not-prose mb-10">
          <div className="mb-3 flex items-center gap-2">
            <h2
              id={`topic:${section.topic}`}
              className="scroll-mt-20 text-xl font-bold tracking-tight"
            >
              {section.label}
            </h2>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[section.topic]}`}
            >
              {section.entries.length} τύποι
            </span>
          </div>
          <div className="space-y-3">
            {section.entries.map((entry) => (
              <article
                key={entry.id}
                id={`formula:${entry.id}`}
                className="scroll-mt-20 rounded-lg border border-border bg-bg-elevated p-4"
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {entry.title}
                  </h3>
                  {entry.derivedIn && (
                    <Link
                      href={`/${entry.derivedIn}`}
                      className="inline-flex items-center gap-1 text-[11px] text-fg-muted transition hover:text-accent"
                      title={`Παραγωγή στο ${SECTION_TITLES[entry.derivedIn] ?? entry.derivedIn}`}
                    >
                      <BookOpen className="h-3 w-3" aria-hidden />
                      {SECTION_TITLES[entry.derivedIn] ?? 'Δες παραγωγή'}
                    </Link>
                  )}
                </div>
                <div className="text-sm">{entry.content}</div>
                <div className="mt-3 border-t border-border pt-2">
                  <SectionComments
                    anchor={`formula:${entry.id}`}
                    sectionTitle={entry.title}
                    className=""
                    emptyLabel="Σχόλιο για τον τύπο"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
