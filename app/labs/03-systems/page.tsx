import Link from 'next/link'
import { FlaskConical, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Lab 3 — Γραμμικά συστήματα συνεχούς χρόνου (placeholder)',
  description:
    'Πλήρης σελίδα του Lab 3. Σύντομα — αυτή η σελίδα είναι placeholder.',
}

export default function Lab3Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/foundations/systems"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> πίσω στα Συστήματα
      </Link>
      <div className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        🚧 Lab 3 — Γραμμικά συστήματα συνεχούς χρόνου
      </h1>
      <p className="mt-3 text-fg-muted">
        Αυτή η σελίδα είναι σύντομα. Εδώ θα μπει ο πλήρης οδηγός: αλγεβρικός
        και αριθμητικός έλεγχος γραμμικότητας / TI για διάφορα συστήματα,
        συνέλιξη με <code className="font-mono">conv</code> στο MATLAB,
        σύγκριση με αναλυτικό αποτέλεσμα, και cascade / parallel σύνθεση
        συστημάτων.
      </p>
      <p className="mt-3 text-sm text-fg-subtle">
        Στο μεταξύ, η LabBox μέσα στη σελίδα{' '}
        <Link href="/foundations/systems" className="text-accent hover:underline">
          /foundations/systems
        </Link>{' '}
        έχει starter snippets για τους ελέγχους γραμμικότητας.
      </p>
    </div>
  )
}
