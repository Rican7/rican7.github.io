/**
 * Identity data for the site: the profiles that are "me" (used for both the
 * `rel="me"` header links and the JSON-LD `sameAs`), and the JSON-LD
 * structured data graph describing me and the things I've made.
 */

/**
 * Profiles that represent me elsewhere on the web.
 *
 * Rendered as `<link rel="me">` in the document head, and included as
 * `sameAs` on the JSON-LD `Person`.
 */
export const relMeLinks: readonly string[] = [
  'https://www.facebook.com/tnsuarez',
  'https://www.instagram.com/trevor.n.suarez/',
  'https://www.threads.net/@trevor.n.suarez',
  'https://twitter.com/trevorsuarez',
  'https://www.tiktok.com/@trevor.n.suarez',
  'https://www.youtube.com/c/TrevorSuarez',
  'https://open.spotify.com/artist/4ctn9rubVjadzZTFzZC9vV',
  'https://github.com/Rican7',
  'https://www.linkedin.com/in/tnsuarez',
  'https://www.facebook.com/TrevorSuarezMusic/',
  'https://www.instagram.com/trevorsuarez_lps/',
  'https://mastodon.social/@tnsuarez',
  'https://stackexchange.com/users/454669/rican7',
  'https://downtemp.com/users/@trevor.n.suarez',
  'https://downtemp.com/blog/authors/trevor-suarez',
];

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
    downtempProfilePage: 'https://downtemp.com/users/@trevor.n.suarez',
    downtempBlogAuthorPage: 'https://downtemp.com/blog/authors/trevor-suarez',
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
