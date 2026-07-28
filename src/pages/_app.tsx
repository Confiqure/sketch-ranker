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

// Self-hosted Plausible (analytics.dylanwheeler.net). Env vars injected by AWS Amplify
// (Terraform: monorepo workspace/infrastructure/amplify/apps.tf); the script only renders
// when the domain is set, so local dev never emits events.
const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? 'https://analytics.dylanwheeler.net'
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ''

const queryClient = new QueryClient()

const SketchApp: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Comedy Sketch Ranker</title>
        </Head>
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src={`${plausibleHost}/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js`}
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
