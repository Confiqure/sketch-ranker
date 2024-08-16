import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comedy Sketch Ranker',
  description: 'Vote on your favorite comedy sketches and see the rankings!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
