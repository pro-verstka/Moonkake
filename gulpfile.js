/* COMMON
-------------------------------------------------- */

var
  gulp = require('gulp'),

  // utils
  browserSync = require('browser-sync'),
  flatten = require('gulp-flatten'),
  gutil = require('gulp-util'),
  merge = require('merge-stream'),
  rename = require('gulp-rename'),
  //sourcemaps = require('gulp-sourcemaps'),

  // css
  gcmq = require('gulp-group-css-media-queries'),
  autoprefixer = require('gulp-autoprefixer'),
  csscomb = require('gulp-csscomb'),
  cssnano = require('gulp-cssnano'),

  //sass
  sass = require('gulp-sass'),
  glob = require('gulp-sass-glob'),

  // js
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),

  // tpl
  pug = require('gulp-pug'),

  // sprites
  spritesmith = require('gulp.spritesmith'),

  // backup
  revall = require('gulp-rev-all'),
  archiver = require('gulp-archiver');

/* TASKS
-------------------------------------------------- */

/* Browser */

gulp.task('browser', function () {
  return browserSync({
    server: {
      baseDir: './dist/',
      directory: true
    },
    notify: false
  });
});

/* Templates */

gulp.task('templates', function () {
  return gulp.src([
    'src/templates/**/*',
    '!src/templates/blocks/*',
    '!src/templates/layouts/*'
  ], {
    base: '.'
  })
  .pipe(pug({
    pretty: true
  }))
  .on('error', gutil.log)
  .pipe(flatten())
  .pipe(gulp.dest('dist/'))
  .on('end', function() {
    browserSync.reload();
  });
});

/* PNG Sprites */

gulp.task('sprite:png', function () {
  var spriteData = gulp.src('src/sprite/**/*', {
    base: '.'
  })
  .pipe(spritesmith({
    //retinaSrcFilter: ['src/sprite/**/*@2x.png'],
    //retinaImgName: 'sprite@2x.png',
    imgPath: '../img/sprite.png',
    imgName: 'sprite.png',
    cssName: 'sprite.sass',
    padding: 1
  }));

  var imgStream = spriteData.img.pipe(gulp.dest('src/img/'));
  var cssStream = spriteData.css.pipe(gulp.dest('src/css/sprite/'));

  return merge(imgStream, cssStream);
});

/* Styles */

gulp.task('css', function () {
  // sass
  return gulp.src('src/css/general.sass', {
    base: '.'
  })
  //.pipe(sourcemaps.init())
  .pipe(glob())
  .pipe(sass())
  .on('error', gutil.log)
  .pipe(autoprefixer({
    browsers: ['last 3 version', 'ie >= 11']
  }))
  .pipe(gcmq())
  //.pipe(csscomb())
  .pipe(flatten())
  //.pipe(gulp.dest('dist/assets/css/'))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(cssnano({
    zindex: false
  }))
  //.pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('dist/assets/css/'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

/* Fonts */

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*', {
    base: './src/fonts/'
  })
  .pipe(gulp.dest('dist/assets/fonts/'))
  .on('end', function() {
    browserSync.reload();
  });
});

/* Images */

gulp.task('img', function () {
  return gulp.src('src/img/**/*', {
    base: './src/img/'
  })
  .pipe(gulp.dest('dist/assets/img/'))
  .on('end', function() {
    browserSync.reload();
  });
});

/* Scripts */
gulp.task('js:common', function () {
  return gulp.src('src/js/common.js', {
    base: './src/js/'
  })
  //.pipe(sourcemaps.init())
  .pipe(gulp.dest('dist/assets/js/'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  //.pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('dist/assets/js/'))
  .on('end', function() {
    browserSync.reload();
  });
});

gulp.task('js:bundle', function () {
  return gulp.src([
    'src/js/vendor/**/*.js',
    '!src/js/vendor/**/_*.js',
    'src/js/modules/**/*.js',
    '!src/js/modules/**/_*.js'
  ], {
    base: '.'
  })
  //.pipe(sourcemaps.init())
  .pipe(concat('bundle.min.js'))
  .pipe(uglify())
  //.pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('js:all', ['js:bundle', 'js:common']);

/* Backup */

gulp.task('backup', function () {
  var path = require('path');
  var package = path.parse(__dirname);

  return gulp.src([
    'src/**/*',
    'dist/**/*',
    '.csscomb.json',
    '.gitignore',
    'gulpfile.js',
    'package.json',
    'README.md'
  ], {
    base: '.'
  })
  .pipe(archiver(package.name + '.zip'))
  .pipe(revall.revision({
    transformFilename: function (file, hash) {
      function addZero(number) {
        return number < 10 ? '0' + number : '' + number;
      }

      var date = new Date();
      var day = addZero(date.getDate());
      var month = addZero(date.getMonth() + 1);
      var year = date.getFullYear();
      var hours = addZero(date.getHours());
      var minutes = addZero(date.getMinutes());
      return package.name + '.' + year + '.' + month + '.' + day + '_' + hours + '.' + minutes + '.zip';
    }
  }))
  .pipe(gulp.dest('backup/'));
});

/* Common */

gulp.task('build', ['sprite:png', 'css', 'img', 'fonts', 'js:all', 'templates'], function () {
  gutil.log('Project building done!');
});

gulp.task('default', ['browser'], function () {
  gulp.watch('src/sprite/**/*', ['sprite:png']);
  gulp.watch('src/css/**/*', ['css']);
  gulp.watch('src/img/**/*', ['img']);
  gulp.watch('src/fonts/**/*', ['fonts']);
  gulp.watch('src/js/**/*', ['js:all']);
  gulp.watch('src/templates/**/*', ['templates']);

  gutil.log('Project is running!');
});
