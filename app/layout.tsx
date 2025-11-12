import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// ✅ Load Inter font with variable for Tailwind or CSS use
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

// ✅ App metadata (SEO + Social)
export const metadata: Metadata = {
  title: "Shramic - Building India's Most Trusted Workforce",
  description:
    'We connect thoroughly verified, skilled workers with quality employers. Find a reliable job. Hire a dependable team.',
  keywords: [
    'jobs',
    'workers',
    'employment',
    'hiring',
    'india',
    'workforce',
    'verified jobs',
    'skilled workers',
  ],
  authors: [{ name: 'Shramic Networks' }],
  creator: 'Shramic Networks',
  publisher: 'Shramic Networks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Shramic - Building India's Most Trusted Workforce",
    description:
      'We connect thoroughly verified, skilled workers with quality employers. Find a reliable job. Hire a dependable team.',
    url: 'https://shramic.com',
    siteName: 'Shramic',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shramic - Building India's Most Trusted Workforce",
    description:
      'We connect thoroughly verified, skilled workers with quality employers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ✅ Move viewport here — this replaces the old `metadata.viewport`
export const generateViewport = (): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body
        className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
