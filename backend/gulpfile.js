import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import minifyCSS from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import useref from 'gulp-useref';
import rename from 'gulp-rename';
import gulpConnect from 'gulp-connect'; // Import đúng cách gulp-connect
import ts from 'gulp-typescript';
import nodemon from 'gulp-nodemon';

const tsProject = ts.createProject('tsconfig.json');

// Task để theo dõi thay đổi file
gulp.task('watch', function() {
      gulp.watch('src/**/*.ts', gulp.series('browserify'));
      gulp.watch('src/**/*.html', gulp.series('html'));
      gulp.watch('src/**/*.css', gulp.series('css'));
});

// Task xử lý HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
                        .pipe(useref())
                        .pipe(gulp.dest('dist'))
                        .pipe(gulpConnect.reload()); // Sử dụng gulpConnect.reload() thay vì reload()
});

// Task xử lý CSS
gulp.task('css', function() {
      return gulp.src('src/**/*.css').pipe(minifyCSS())
                                                      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie8', 'ie9'))
                                                      .pipe(concat('style.min.css'))
                                                      .pipe(gulp.dest('dist/css'))
                                                      .pipe(gulpConnect.reload()); // Sử dụng gulpConnect.reload()
});

// Task xử lý hình ảnh
gulp.task('images', function() {
      gulp.src('src/**/*.jpg').pipe(gulp.dest('dist'));
      return gulp.src('src/**/*.png').pipe(gulp.dest('dist'));
});

// Task để biên dịch TypeScript
gulp.task('typescript', function() {
      return tsProject.src()
                              .pipe(tsProject())
                              .pipe(gulp.dest('dist'));
});

// Task khởi chạy server
gulp.task('server', gulp.series('typescript', (cb) => {
      let started = false;
      return nodemon({  
            script: 'dist/server.js',
            watch: ['src/**/*.ts'], 
            tasks: ['typescript'],
            ext: 'ts' 
      }).on('start', () => {
            if(!started) {
                  cb();
                  started = true;
            }
      });
}));

// Task xử lý Browserify
gulp.task('browserify', function() {
      return browserify({
            entries: './src/app.ts',
      })
      .plugin('tsify')
      .bundle()
      .on('error', function(err) {
            console.log(err.message);
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'))
      .pipe(gulpConnect.reload()); // Sử dụng gulpConnect.reload()
});

// Task mặc định
gulp.task(
      'default',
      gulp.series(
            ['browserify', 'html', 'css', 'images', 'typescript'], 
            gulp.parallel('server', 'watch')
      )
);

// Task để theo dõi các thay đổi
gulp.task('watch', () => {
      gulp.watch('src/**/*.ts', gulp.series('typescript')); // Theo dõi thay đổi file TypeScript và biên dịch lại
      gulp.watch('src/**/*.html', gulp.series('html'));     // Theo dõi thay đổi HTML
      gulp.watch('src/**/*.css', gulp.series('css'));       // Theo dõi thay đổi CSS
      gulp.watch('src/images/**/*', gulp.series('images')); // Theo dõi thay đổi hình ảnh
});