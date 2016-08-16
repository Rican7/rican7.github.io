module.exports = {
  // CSS filenames
  datasvgcss: 'icons.data.svg.css',
  datapngcss: 'icons.data.png.css',
  urlpngcss: 'icons.fallback.css',

  // grunticon loader code snippet filename
  loadersnippet: 'grunticon.loader.js',

  // Include loader code for SVG markup embedding
  enhanceSVG: true,

  // Make markup embedding work across domains (if CSS hosted externally)
  corsEmbed: false,

  // prefix for CSS classnames
  cssprefix: '.icon-',

  defaultWidth: '512px',
  defaultHeight: '512px',

  // define vars that can be used in filenames if desirable,
  // like foo.colors-primary-secondary.svg
  colors: {
    primary: '#000',
    dark: '#333',
    light: '#ddd',
    inverted: '#fff'
  },

  dynamicColorOnly: true,

  // css file path prefix
  // this defaults to '/' and will be placed before the 'dest' path
  // when stylesheets are loaded. It allows root-relative referencing
  // of the CSS. If you don't want a prefix path, set to to ''
  cssbasepath: '/',

  compressPNG: false
};
