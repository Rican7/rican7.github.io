const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const injectSvg = require('gulp-inject-svg');
const deploy = require('gulp-gh-pages');
const path = require('path');
const log = require('fancy-log');
const swPrecache = require('sw-precache');
const uglify = require('gulp-uglify-es').default;

const packageJson = require('./package.json');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const DEV_DIR = 'app';
const DIST_DIR = 'dist';

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
  var config = {
    cacheId: packageJson.name,
    // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
    // the service worker will precache resources but won't actually serve them.
    // This allows you to test precaching behavior without worry about the cache preventing your
    // local changes from being picked up during the development cycle.
    handleFetch: handleFetch,
    logger: log,
    runtimeCaching: [],
    staticFileGlobs: [
      rootDir + '/images/**.*',
      rootDir + '/styles/**.css',
      rootDir + '/scripts/**.js',
      rootDir + '/**.html'
    ],
    stripPrefix: rootDir + '/',
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: true
  };

  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
}

gulp.task('generate-service-worker-dev', function(cb) {
  writeServiceWorkerFile(DEV_DIR, false, cb);
});

gulp.task('generate-service-worker-dist', function(cb) {
  writeServiceWorkerFile(DIST_DIR, true, cb);
});

function appInjectSvgs() {
  return injectSvg({
    base: 'app'
  })
}

gulp.task('svgs', () => {
  return gulp.src('app/*.html')
    .pipe(appInjectSvgs())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', gulp.series('styles', 'scripts', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', appInjectSvgs()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
}));

gulp.task('images', () => {
  return gulp.src([
      'app/images/**/*',
      '.tmp/images/**/*'
    ])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true,
    nodir: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', gulp.series('styles', 'scripts', 'svgs', 'generate-service-worker-dev', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
      }
    },
    ghostMode: false
  });

  gulp.watch([
    '.tmp/*.html',
    'app/*.html',
    'app/images/**/*',
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', gulp.series('styles'));
  gulp.watch('app/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('app/*.html', gulp.series('svgs'));
}));

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    },
    ghostMode: false
  });
});

gulp.task('serve:test', gulp.parallel('scripts', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
      }
    },
    ghostMode: false
  });

  gulp.watch('app/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', gulp.series('lint:test'));
}));

gulp.task('build', gulp.series('lint', 'html', 'images', 'extras', 'generate-service-worker-dist', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
}));

gulp.task('deploy', gulp.series('build', () => {
  return gulp.src('dist/**/*')
    .pipe(deploy({
      remoteUrl: 'https://github.com/Rican7/rican7.github.io.git',
      branch: 'master'
    }));
}));

gulp.task('default', gulp.series('clean', 'build'));
