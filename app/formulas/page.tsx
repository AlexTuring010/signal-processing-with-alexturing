import { Sigma } from 'lucide-react'

export const metadata = {
  title: 'Τυπολόγιο',
  description: 'Διαδραστικός οδηγός του επίσημου τυπολογίου του μαθήματος.',
}

export default function FormulasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
        <Sigma className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Τυπολόγιο</h1>
      <p className="mt-3 text-fg-muted">
        Στο μάθημα δίνεται επίσημο τυπολόγιο κατά τη διάρκεια της εξέτασης. Εδώ
        θα το αναπαράγουμε με δυνατότητα διαδραστικής εξερεύνησης — πατάς ένα
        Fourier pair και βλέπεις παραγωγή ή viz. Placeholder προς το παρόν.
      </p>
    </div>
  )
}
