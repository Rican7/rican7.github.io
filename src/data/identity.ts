/**
 * Identity data for the site: the profiles that are "me" (used for the page's
 * links, the `rel="me"` header links, and the JSON-LD `sameAs`), and the
 * JSON-LD structured data graph describing me and the things I've made.
 */

/**
 * Profiles that represent me elsewhere on the web, by name, with their URL
 * and the handle (or display name) I go by there.
 *
 * This is the single source for these: link to them via this map (e.g.
 * `profiles.github.url` and `profiles.github.handle`) rather than repeating
 * them.
 */
export const profiles = {
  facebook: {
    url: 'https://www.facebook.com/tnsuarez',
    handle: 'tnsuarez',
  },
  instagram: {
    url: 'https://www.instagram.com/trevor.n.suarez/',
    handle: '@trevor.n.suarez',
  },
  threads: {
    url: 'https://www.threads.com/@trevor.n.suarez',
    handle: '@trevor.n.suarez',
  },
  twitter: {
    url: 'https://twitter.com/trevorsuarez',
    handle: '@trevorsuarez',
  },
  tiktok: {
    url: 'https://www.tiktok.com/@trevor.n.suarez',
    handle: '@trevor.n.suarez',
  },
  youtube: {
    url: 'https://www.youtube.com/c/TrevorSuarez',
    handle: 'TrevorSuarez',
  },
  spotify: {
    url: 'https://open.spotify.com/artist/4ctn9rubVjadzZTFzZC9vV',
    handle: 'Trevor Suarez',
  },
  github: {
    url: 'https://github.com/Rican7',
    handle: '@Rican7',
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/tnsuarez',
    handle: 'tnsuarez',
  },
  facebookMusic: {
    url: 'https://www.facebook.com/TrevorSuarezMusic/',
    handle: 'TrevorSuarezMusic',
  },
  instagramMusic: {
    url: 'https://www.instagram.com/trevorsuarez_lps/',
    handle: '@trevorsuarez_lps',
  },
  mastodon: {
    url: 'https://mastodon.social/@tnsuarez',
    handle: '@tnsuarez',
  },
  stackExchange: {
    url: 'https://stackexchange.com/users/454669/rican7',
    handle: 'Rican7',
  },
  downtemp: {
    url: 'https://downtemp.com/users/@trevor.n.suarez',
    handle: '@trevor.n.suarez',
  },
  downtempBlogAuthor: {
    url: 'https://downtemp.com/blog/authors/trevor-suarez',
    handle: 'Trevor Suarez',
  },
} as const;

/**
 * All of my profiles' URLs.
 *
 * Rendered as `<link rel="me">` in the document head, and included as
 * `sameAs` on the JSON-LD `Person`.
 */
export const relMeLinks: readonly string[] = Object.values(profiles).map(
  (profile) => profile.url,
);

const DOWNTEMP_URL = 'https://downtemp.com/';
const DOWNTEMP_DESCRIPTION =
  'See what your friends are actually up to. Share quick hangs or full events, chat instantly, and stay updated. Less planning. More hanging. You down?';

const DO_WHILE_PROGRESS_URL = 'https://dowhileprogress.com/';
const DO_WHILE_PROGRESS_SLOGAN = 'Always progressing. Always in progress.';

/**
 * Builds the JSON-LD structured data graph for the site.
 *
 * The `@id`s for Downtemp's nodes match the ones published on downtemp.com
 * itself, so that the graphs can be joined.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export function buildStructuredData(site: URL) {
  const siteUrl = new URL('/', site).href;

  const ids = {
    profilePage: `${siteUrl}#profilepage`,
    person: `${siteUrl}#person`,
    doWhileProgress: `${DO_WHILE_PROGRESS_URL}#organization`,
    downtempOrganization: `${DOWNTEMP_URL}#organization`,
    downtempWebsite: `${DOWNTEMP_URL}#website`,
    downtempApp: `${DOWNTEMP_URL}#app`,
    downtempProfilePage: profiles.downtemp.url,
    downtempBlogAuthorPage: profiles.downtempBlogAuthor.url,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': ids.profilePage,
        url: siteUrl,
        name: 'Trevor Suarez',
        mainEntity: { '@id': ids.person },
      },
      {
        '@type': 'Person',
        '@id': ids.person,
        name: 'Trevor Suarez',
        alternateName: ['Trevor N. Suarez', 'Rican7'],
        givenName: 'Trevor',
        familyName: 'Suarez',
        description:
          'Auto enthusiast, music junkie, snowboarder, hobbyist photographer, and digital maker (software engineer).',
        url: siteUrl,
        image: new URL('/images/img-profile-photo-headshot.jpg', site).href,
        sameAs: relMeLinks,
      },
      {
        '@type': 'Organization',
        '@id': ids.doWhileProgress,
        name: 'Do While Progress',
        legalName: 'Do While Progress LLC',
        url: DO_WHILE_PROGRESS_URL,
        slogan: DO_WHILE_PROGRESS_SLOGAN,
        description: DO_WHILE_PROGRESS_SLOGAN,
        logo: `${DO_WHILE_PROGRESS_URL}images/app-icons/icon-512.png`,
        founder: { '@id': ids.person },
        subOrganization: { '@id': ids.downtempOrganization },
      },
      {
        '@type': 'Organization',
        '@id': ids.downtempOrganization,
        name: 'Downtemp',
        url: DOWNTEMP_URL,
        logo: `${DOWNTEMP_URL}images/downtemp-pict-mark.png`,
        founder: { '@id': ids.person },
        parentOrganization: { '@id': ids.doWhileProgress },
        sameAs: [
          'https://downtemp.shop/',
          'https://www.instagram.com/downtempapp',
          'https://www.threads.com/@downtempapp',
          'https://www.tiktok.com/@downtempapp',
          'https://x.com/downtempapp',
          'https://www.facebook.com/downtempapp/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': ids.downtempWebsite,
        name: 'Downtemp',
        url: DOWNTEMP_URL,
        description: DOWNTEMP_DESCRIPTION,
        publisher: { '@id': ids.downtempOrganization },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': ids.downtempApp,
        name: 'Downtemp',
        url: DOWNTEMP_URL,
        description:
          "Downtemp is a free app for making plans with friends. See what they're actually up to, say you're down, and figure out the rest in the chat.",
        applicationCategory: 'SocialNetworkingApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: { '@id': ids.downtempOrganization },
        creator: { '@id': ids.person },
      },
      {
        '@type': 'ProfilePage',
        '@id': ids.downtempProfilePage,
        url: ids.downtempProfilePage,
        name: 'Trevor Suarez (@trevor.n.suarez) on Downtemp',
        isPartOf: { '@id': ids.downtempWebsite },
        mainEntity: { '@id': ids.person },
      },
      {
        '@type': 'ProfilePage',
        '@id': ids.downtempBlogAuthorPage,
        url: ids.downtempBlogAuthorPage,
        name: 'Trevor Suarez - The Downtemp Blog',
        isPartOf: { '@id': ids.downtempWebsite },
        mainEntity: { '@id': ids.person },
      },
    ],
  };
}
