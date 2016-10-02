'use strict';
const gulp = require('gulp'),
    nodeDel = require('del'),
    $ = require('gulp-load-plugins')();

let cb = new $.cacheBreaker();

let isBuild = false;

if ($.util.env.build) {
    isBuild = true;
}

function del(paths) {
    return nodeDel(paths, {
        force: true
    });
}

function hash() {
    return $.hash({
        hashLength: 10,
        template: '<%= name %>.<%= hash %><%= ext %>'
    });
}

let onError = function(err) {
    console.log(err.toString());
}

const basedir = 'app/',
    deploydir = '../webapp/',
    bowerdir = 'bower_components/',
    nodedir = 'node_modules/';

gulp.task('lint', () => {
    return gulp.src(basedir + 'js/**/*.js')
        .pipe($.jshint())
        .pipe($.jscs())
        .on('error', onError)
        .pipe($.jshint.reporter('default'));
 });

gulp.task('less', ['cleanAppLess'], () => {
    return gulp.src([nodedir + 'bootstrap-less', basedir + 'less/app.less'])
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe($.cssmin())
        .pipe(gulp.dest(deploydir + 'css'))
        .pipe(cb.gulpCbPath(deploydir + 'css'))
        .pipe(hash())
        .pipe(gulp.dest(deploydir + 'css'));
});

gulp.task('dependentCss', ['cleanDependentCss'], () => {
	
    let bowerCss = [];
    
    bowerCss.push(basedir + 'less/dependencies/*.css');
    //bowerCss.push(bowerdir + 'xyz/xyz.css');
	
    return gulp.src(bowerCss)
        .pipe($.cssmin())
        .pipe(gulp.dest(deploydir + 'css/dependencies'))
        .pipe(cb.gulpCbPath(deploydir + 'css/dependencies'))
        .pipe(hash())
        .pipe(gulp.dest(deploydir + 'css/dependencies'));
});

gulp.task('ourScripts', ['cleanOurScripts'], () => {
    let ourDir = deploydir + 'js';
    let jsToCompile = [basedir + 'js/**/*.js', `!${basedir}js/**/*.test.js`];
    if (!isBuild) {
        jsToCompile.push(`!${basedir}js/nonLocal/**/*.js`);
    }
    return gulp.src(jsToCompile)
        .pipe($.babel({
            presets: ['es2015'],
            plugins: ["syntax-decorators", "ng-annotate"]
        }))
        .pipe($.ngAnnotate())
        .pipe($.concat('all.js'))
        .pipe(isBuild ? $.uglify() : $.util.noop())
        .pipe(gulp.dest(deploydir + 'js'))
        .pipe(cb.gulpCbPath(ourDir))
        .pipe(hash())
        .pipe(gulp.dest(ourDir));
});

gulp.task('fonts', () => {
    return gulp.src([basedir + 'fonts/**/*'])
        .pipe(gulp.dest(deploydir + 'css/fonts'));
});

gulp.task('bower', ['cleanBower'], () => {
    let bowerLibs = [],
        bowerDir = deploydir + 'js';

    bowerLibs.push(bowerdir + 'angular/angular.min.js');
    bowerLibs.push(bowerdir + 'angular-route/angular-route.min.js');

    return gulp.src(bowerLibs)
        .pipe($.concat('bower.js'))
        .pipe(isBuild ? $.uglify() : $.util.noop())
        .pipe(gulp.dest(bowerDir))
        .pipe(cb.gulpCbPath(bowerDir))
        .pipe(hash())
        .pipe(gulp.dest(bowerDir));
});

function htmlFn() {
    gulp.src(basedir + '/**/*.html')
        .pipe($.htmlmin({
            "collapseWhitespace": true
        }))
        .pipe(cb.gulpCbPath(deploydir))
        .pipe(gulp.dest(deploydir));
}

gulp.task('cleanHtml', () => {
    return del([deploydir + 'html/*']);
});

gulp.task('cleanDependentCss', () => {
    return del([deploydir + 'css/dependencies/*.css']);
});

gulp.task('cleanAppLess', () => {
    return del([deploydir + 'css/app.*.css']);
});

gulp.task('cleanBower', () => {
    return del([deploydir + 'js/bower.*.js']);
});

gulp.task('cleanOurScripts', () => {
    return del([deploydir + 'js/all.*.js']);
});

gulp.task('html', htmlFn);

gulp.task('buildHtml', ['ourScripts', 'less', 'bower', 'dependentCss', 'cleanHtml'], htmlFn);

gulp.task('images', () => {
    gulp.src(basedir + '/img/*')
        .pipe(gulp.dest(deploydir + 'img'));
});

gulp.task('resources', function(){
    gulp.src(basedir + '/resources/*')
        .pipe(gulp.dest(deploydir + 'resources'));
});

gulp.task('resourceWatch', ['resources'], htmlFn);
gulp.task('lessWatch', ['less'], htmlFn);
gulp.task('jsWatch', ['ourScripts', 'lint'], htmlFn);

gulp.task('watch', () => {
    gulp.watch([basedir + 'js/**/*.js', '!' + basedir + 'js/**/*.test.js'], ['jsWatch']);
    gulp.watch(basedir + 'js/**/*.test.js', ['lint']);
    gulp.watch(basedir + 'less/**/*.less', ['lessWatch']);
    gulp.watch(basedir + '**/*.html', ['html']);
    gulp.watch(basedir + 'img/*', ['images']);
    gulp.watch(basedir + 'resources/*', ['resourceWatch']);
});

gulp.task('build', ['less', 'dependentCss', 'bower', 'ourScripts', 'buildHtml', 'images', 'resources', 'fonts', 'lint']);

let defaultTask = ['build'];
if (!isBuild) {
    defaultTask.push('watch');
}
gulp.task('default', defaultTask);
