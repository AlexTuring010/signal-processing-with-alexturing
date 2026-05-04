import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Δεν βρέθηκε αυτή η σελίδα
      </h1>
      <p className="mt-3 text-fg-muted">
        Ίσως δεν έχει γραφτεί ακόμη, ή το link σου είναι λάθος.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium hover:border-accent/50"
      >
        Πίσω στην αρχή
      </Link>
    </div>
  )
}
