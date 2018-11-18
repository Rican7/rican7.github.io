const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const merge = require('merge-stream')
const glob = require('glob');
const gulpicon = require('gulpicon/tasks/gulpicon');
const deploy = require('gulp-gh-pages');
const uncss = require('gulp-uncss');
const path = require('path');
const log = require('fancy-log');
const swPrecache = require('sw-precache');

const packageJson = require('./package.json');

const gulpiconConfig = require('./gulpiconConfig.js');

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

gulp.task('icons', (cb) => {
    gulpiconConfig.dest = '.tmp/gulpicon';
    gulpiconConfig.pngfolder = 'png';

    const icons = gulpicon(
      glob.sync('app/images/**/*.svg'),
      gulpiconConfig
    );

    return icons((err) => {
      if (err) {
        return cb(err);
      }

      cb();

      const iconStyles = gulp.src(gulpiconConfig.dest + '/*.css')
        .pipe(uncss({ // Get rid of any CSS for icons that we're not using, because they're heavy
          html: ['app/*.html']
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({stream: true}));

      const iconScripts = gulp.src(gulpiconConfig.dest + '/*.js')
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(reload({stream: true}));

      const iconImages = gulp.src(gulpiconConfig.dest + '/' + gulpiconConfig.pngfolder + '/*')
        .pipe(gulp.dest('.tmp/images/icons/png'))
        .pipe(gulp.dest('dist/images/icons/png'))
        .pipe(reload({stream: true}));

      return merge(iconStyles, iconScripts, iconImages);
    });
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
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
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

gulp.task('html', gulp.parallel('styles', 'scripts', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
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

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
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

gulp.task('serve', gulp.series('styles', 'scripts', 'fonts', 'icons', 'generate-service-worker-dev', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', gulp.series('styles'));
  gulp.watch('app/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('app/fonts/**/*', gulp.series('fonts'));
  gulp.watch('bower.json', gulp.series('wiredep', 'fonts'));
}));

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
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
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', gulp.series('lint:test'));
}));

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', gulp.series('lint', 'html', 'images', 'fonts', 'icons', 'extras', 'generate-service-worker-dist', () => {
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
