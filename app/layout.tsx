import './globals.css' // L'import doit correspondre à l'emplacement du fichier
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Votre application',
  description: 'Description de votre application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
}