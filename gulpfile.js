var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var htmlmin = require('gulp-htmlmin');

var filesName = {
  css: 'styles.css',
  vendor: 'vendor.js',
  js: 'bundle.js',
};

// Static Server + watching scss/html files
gulp.task('dev', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch(["app/*.html", "app/js/*.js"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

// Build css
gulp.task('build-css', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat(filesName.css))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});
 
// Build js
gulp.task('build-js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(concat(filesName.js))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// Build vendor
gulp.task('bower-files', function() {
    return gulp.src(mainBowerFiles({
        paths: {
            bowerDirectory: 'app/bower_components',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }))
    .pipe(concat(filesName.vendor))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});


// Build fonts
gulp.task('build-fonts', function() {
    return gulp.src(['app/fonts/*'])
          .pipe(gulp.dest('dist/fonts'));
});

// Build images
gulp.task('build-img', function() {
    return gulp.src(['app/img/*'])
          .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
  // Delete Temp Files & Folders
  del.sync(['./dist/**'], {force : true});
});

gulp.task('build', ['clean', 'build-css', 'build-js', 'bower-files', 'build-fonts', 'build-img'], function() {
  var length = 15;
  var v =  Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);

  gulp.src('app/index.html')
    .pipe(htmlreplace({
        'css': 'css/' + filesName.css + '?' + v,
        'vendor': 'js/' + filesName.vendor + '?' + v,
        'js': 'js/' + filesName.js + '?' + v,
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['dev']);
