import { Cheatsheet } from '@/components/practice/Cheatsheet'

export const metadata = {
  title: 'Συνιστώμενη πινακίδα μελέτης',
  description:
    'Print-ready φύλλο μελέτης πριν την εξέταση K21 — συνδυάζει το επίσημο τυπολόγιο με όλους τους τύπους που πρέπει να θυμάσαι (AM, FM, θόρυβος). Στην εξέταση φέτος επιτρέπεται μόνο το επίσημο τυπολόγιο: αυτή η πινακίδα είναι για να εμπεδώσεις πριν, όχι για να τη σηκώσεις μαζί σου.',
}

export default function CheatsheetPage() {
  return <Cheatsheet />
}
