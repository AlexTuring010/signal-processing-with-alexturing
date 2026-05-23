import { Cheatsheet } from '@/components/practice/Cheatsheet'

export const metadata = {
  title: 'Συνιστώμενη πινακίδα εξέτασης',
  description:
    'Print-ready cheatsheet για την εξέταση K21 — συνδυάζει το επίσημο τυπολόγιο με τους τύπους που πρέπει να ξέρεις (AM, FM, θόρυβος). Δομημένο για στιγμιαία αναζήτηση κάτω από πίεση.',
}

export default function CheatsheetPage() {
  return <Cheatsheet />
}
