import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LingoFlux - Learn languages in context',
  description: 'Context-based vocabulary learning with A-1 notifications and AI-powered translation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
