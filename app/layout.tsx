import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'
import { ThemeInitScript } from '@/components/layout/theme-init-script'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Tamagotchi } from '@/components/pet/Tamagotchi'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'greek', 'greek-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Signal Processing Class Hub',
    template: '%s · Signal Processing Class Hub',
  },
  description:
    'Συνεργατικός οδηγός για το μάθημα K21 — Συστήματα Επικοινωνιών (ΕΚΠΑ, DIT). Φτιαγμένος από συμφοιτητές, βελτιώνεται με σχόλια.',
  applicationName: 'Signal Processing Class Hub',
  authors: [{ name: 'Class Hub contributors' }],
  openGraph: {
    title: 'Signal Processing Class Hub',
    description:
      'Συνεργατικός οδηγός για Συστήματα Επικοινωνιών — από το μηδέν, με visualizations και σχόλια από συμφοιτητές.',
    type: 'website',
    locale: 'el_GR',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f141e' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeInitScript />
      </head>
      <body className="font-sans antialiased">
        <a href="#content" className="skip-link">
          Πήδα στο περιεχόμενο
        </a>
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <Tamagotchi />
      </body>
    </html>
  )
}
