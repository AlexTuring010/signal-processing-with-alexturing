import type { Metadata } from 'next'
import { CollectionGrid } from '@/components/collectibles/CollectionGrid'

export const metadata: Metadata = {
  title: 'Συλλογή',
  description:
    'Συλλεκτικά κρυμμένα στις σελίδες του site. Βρες τα και ντύσε ή διακόσμησε το Σιγμάκι.',
}

export default function CollectionPage() {
  return <CollectionGrid />
}
