const {src, dest, task, watch} = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cache = require('gulp-cached');
const mode = require('gulp-mode')({
    modes: ["production", "development"],
    default: "development",
    verbose: true
});


function styles() {
    return src('./src/style.scss')
        .pipe(mode.development(sourcemaps.init({loadMaps: true})))
        .pipe(cache('sass'))
        .pipe(sass({
            quietDeps: true
        }))
        .pipe(postcss([autoprefixer, cssnano]))
        .pipe(mode.development(sourcemaps.write('./')))
        .pipe(dest('./dist/'))
}


task('default', styles);

task('watch', function(){
    return watch('./src/style.scss', { ignoreInitial: false }, styles);
});
