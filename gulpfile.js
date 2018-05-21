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
	.pipe(glob())
	.pipe(sass())
	.on('error', gutil.log)
	.pipe(autoprefixer({
    browsers: ['last 5 version', 'ie >= 11'],
    grid: true
	}))
	.pipe(gcmq())
	.pipe(flatten())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(cssnano({
		zindex: false
	}))
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
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('dist/assets/js/'))
	.on('end', function() {
		browserSync.reload();
	});
});

gulp.task('js:app', function () {
	return gulp.src('src/js/app.js', {
		base: './src/js/'
	})
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/assets/js/'))
		.on('end', function () {
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
	.pipe(concat('bundle.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('js:all', ['js:bundle', 'js:common', 'js:app']);

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
