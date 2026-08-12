import '../styles/globals.css'
import { withTRPC } from '@trpc/next'
import { AppProps, AppType } from 'next/app'
import { AppRouter } from './api/trpc/[trpc]'
import { httpBatchLink } from '@trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import Script from 'next/script'
import Head from 'next/head'
import { Bungee } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

// Chunky display face for headings — self-hosted at build by next/font (no
// runtime Google request). Exposed as --font-bungee for the Tailwind theme.
const bungee = Bungee({ weight: '400', subsets: ['latin'], variable: '--font-bungee' })

// Self-hosted Umami (analytics.dylanwheeler.net). Env vars injected by AWS Amplify
// (Terraform: monorepo workspace/infrastructure/amplify/apps.tf); the script only renders
// when the website ID is set, so local dev never emits events.
const umamiHost = process.env.NEXT_PUBLIC_UMAMI_HOST ?? 'https://analytics.dylanwheeler.net'
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? ''

const queryClient = new QueryClient()

const SketchApp: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Comedy Sketch Ranker</title>
        </Head>
        {umamiWebsiteId && (
          <Script
            defer
            data-website-id={umamiWebsiteId}
            src={`${umamiHost}/script.js`}
          />
        )}
        <div className={`${bungee.variable} min-h-screen bg-cream`}>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }
  },
  ssr: false,
})(SketchApp)
