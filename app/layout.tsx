import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'
import { ThemeInitScript } from '@/components/layout/theme-init-script'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'greek', 'greek-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Signal Processing with AlexTuring',
    template: '%s · Signal Processing with AlexTuring',
  },
  description:
    'Διαδραστικός οδηγός για το μάθημα K21 — Συστήματα Επικοινωνιών (ΕΚΠΑ, ΔΙΤ).',
  applicationName: 'Signal Processing with AlexTuring',
  authors: [{ name: 'AlexTuring' }],
  openGraph: {
    title: 'Signal Processing with AlexTuring',
    description:
      'Διαδραστικός οδηγός για το μάθημα Συστήματα Επικοινωνιών — από το μηδέν, με visualizations.',
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
      </body>
    </html>
  )
}
