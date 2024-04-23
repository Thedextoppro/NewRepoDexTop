import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Filezilla',
  defaultTitle: 'Filezilla',
  description:
    'Cheaper and faster than Uniswap? Discover Filezilla, the leading DEX on Filezilla with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@file_ziila',
    site: '@file_ziila',
  },
  openGraph: {
    title: 'Filezilla - A next evolution DeFi exchange on Filezilla',
    description:
      'The most popular AMM on Filezilla! Earn DEX through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://filezilla.lock/images/fzilla.png' }],
  },
}
