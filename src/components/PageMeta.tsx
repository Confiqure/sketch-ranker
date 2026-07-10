import Head from 'next/head'
import { SITE } from '@/site.config'

// Per-page <head>: title, description, canonical, and the full OG/Twitter share
// card — all derived from site.config.ts so no page hand-rolls meta tags.
type PageMetaProps = {
  /** Page name; rendered as "<title> — Comedy Sketch Ranker". Omit on the homepage. */
  title?: string
  description?: string
  /** Route path for the canonical/OG url, e.g. "/vote". Defaults to the homepage. */
  path?: string
  /** Keep private surfaces (admin) out of search indexes. */
  noIndex?: boolean
}

const PageMeta = ({ title, description, path = '/', noIndex = false }: PageMetaProps) => {
  const fullTitle = title ? `${title} — ${SITE.title}` : SITE.title
  const desc = description ?? SITE.description
  const url = `${SITE.url}${path === '/' ? '' : path}`
  const image = `${SITE.url}${SITE.ogImage}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex" />}

      <meta property="og:site_name" content={SITE.title} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default PageMeta
