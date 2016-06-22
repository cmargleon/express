import gulp from "gulp";
import shell from "gulp-shell";
import rimraf from "rimraf";
import run from "run-sequence";
import watch from "gulp-watch";
import server from "gulp-live-server";
import watchify from "watchify";
import browserify from "browserify";
import babelify from "babelify";
import sourcemaps from "gulp-sourcemaps";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";

const paths = {
    server: ['./src/server/*.js'],
    client: './src/client/*.js',
    clientDist: './public/js/*',
    destination: './app/server'
};

gulp.task('default', cb => {
    run('server', 'build', 'watch', cb);
});

gulp.task('build', cb => {
    run('build-server', 'build-client', cb);
});
/**
 * Server
 */
gulp.task('build-server', cb => {
    run('clean-server', 'babel', 'restart', cb);
});

gulp.task('clean-server', cb => {
    rimraf(paths.destination, cb);
});

gulp.task('babel', shell.task([
        'babel src/server --out-dir app/server'
    ])
);


let express;

gulp.task('server', () => {
    express = server.new(paths.destination);
});

gulp.task('restart', () => {
    express.start.bind(express)();
});

gulp.task('watch', () => {
    gulp.watch(paths.server, () => {
        gulp.start('build-server');
    });

    gulp.watch(paths.client, () => {
        gulp.start('build-client');
    });
});


/**
 Client
 **/

gulp.task('build-client', cb => {
    run('clean-client', 'browserify', cb);
});

gulp.task('clean-client', cb => {
    rimraf(paths.clientDist, cb);
});

gulp.task('browserify', () => {
    return browserify({entries: 'src/client/index.js', debug: true})
        .transform(babelify, {presets: ['es2015', 'react', 'stage-0']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('browserify-watch', () => {
    var bundler = watchify(browserify({entries: 'src/client/index.js', debug: true}), watchify.args);
    bundler.transform(babelify, {presets: ['es2015', 'react', 'stage-0']})
        .on('update', rebundle);
    return rebundle();
    function rebundle() {
        var start = Date.now();
        return bundler.bundle()
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.toString()));
            })
            .on('end', function () {
                gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(gulpif(!production, sourcemaps.init({loadMaps: true})))
            .pipe(gulpif(!production, sourcemaps.write('./')))
            .pipe(gulpif(production, uglify()))
            .pipe(gulp.dest('public/js'));
    }
});