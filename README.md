# [trevorsuarez.com][trevorsuarez.com]

This is my personal website, hosted on [GitHub Pages][github-pages].

## Built With

This site is built with [standard web technologies][web-tech], on top of, extended by, or with the help of:

- [Node.js][nodejs]
- [npm][npm] (and numerous packages hosted on its registry)
- [Astro][astro]

### Service Worker

[`public/service-worker.js`](public/service-worker.js) is a network-first [service worker][service-worker]: the live site always wins when there's a connection, and its cache is only a fallback for when there isn't (or it's very slow).

**Never delete or rename it.** A browser keeps running an installed service worker until it can fetch a *changed* script from the same URL, and a 404 doesn't count, so removing it strands past visitors on whatever their installed worker serves. (That's what happened with the pre-Astro site's `sw-precache` worker, whose cache kept serving the old site.) To retire it, replace its contents with a worker that clears its caches and unregisters itself.

### External Tools

In addition to the tools referenced directly by this project's code, other tools were used to build this project:

- [Android Asset Studio][android-asset-studio] - To create a stylish, modern-looking "launcher" icon (and "favicon") for the site
- [RealFaviconGenerator][realfavicongenerator] - To help process the aforementioned icon into all of the necessary formats and sizes required by different browsers/devices, and to help generate the necessary meta definitions needed for different browsers/devices to load the icons properly
- [Lighthouse][lighthouse] - To test the site for its compatibility/readiness as a ["Progressive Web App"][progressive-web-app], performance metrics, and best practices



[trevorsuarez.com]: https://trevorsuarez.com/
[github-pages]: https://pages.github.com/
[web-tech]: https://developer.mozilla.org/en-US/docs/Web
[nodejs]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[astro]: https://astro.build/
[android-asset-studio]: https://romannurik.github.io/AndroidAssetStudio/
[realfavicongenerator]: https://realfavicongenerator.net/
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[progressive-web-app]: https://developers.google.com/web/progressive-web-apps/
[service-worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
