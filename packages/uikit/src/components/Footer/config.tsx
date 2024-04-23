import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  ResourcesIcon,
  DiscordIcon,
  MediumIcon,
  YoutubeIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.kronoswap.finance",
      },
      {
        label: "Blog",
        href: "https://medium.com/pancakeswap",
      },
      {
        label: "Community",
        href: "https://docs.kronoswap.finance",
      },
      {
        label: "CAKE",
        href: "https://docs.kronoswap.finance/governance/nebula-tokenomics",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pancakeswap",
      },
      {
        label: "Documentation",
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://x.com/file_ziila",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/FileZilIa"
  },
  // {
  //   label: "Instagram",
  //   icon: InstagramIcon,
  //   href: "https://www.instagram.com/kronobit",
  // },
  // {
  //   label: "Github",
  //   icon: GithubIcon,
  //   href: "/",
  // },
  // {
  //   label: "Docs",
  //   icon: ResourcesIcon,
  //   href: "/",
  // },
  // {
  //   label: "Discord",
  //   icon: DiscordIcon,
  //   href: "https://discord.gg/zgeBH5ewH7",
  // },
  // {
  //   label: "Medium",
  //   icon: MediumIcon,
  //   href: "https://kronobitnetworks.medium.com",
  // },
  // {
  //   label: "Youtube",
  //   icon: YoutubeIcon,
  //   href: "https://www.youtube.com/@kronobit_networks",
  // },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
