const { src, dest, watch, series } = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass')(dartSass);
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

let autoprefixer; // Declare autoprefixer here

// Function to compile SCSS to CSS
async function compileSass() {
    if (!autoprefixer) {
        autoprefixer = (await import('gulp-autoprefixer')).default; // Dynamically import autoprefixer
    }
    
    return src('sass/main.scss') // Source folder for SCSS files
        .pipe(gulpSass().on('error', gulpSass.logError)) // Compile SCSS to CSS
        .pipe(autoprefixer({ // Add vendor prefixes
            cascade: false
        }))
        .pipe(cleanCSS()) // Minify the CSS
        .pipe(rename({ suffix: '.min' })) // Add .min suffix
        .pipe(dest('css')); // Destination folder for CSS files
}

// Watch task
function watchFiles() {
    watch('sass/**/*.scss', compileSass); // Watch for SCSS file changes
}

// Export tasks
exports.buildcss = compileSass;
exports.watch = watchFiles;
exports.default = series(compileSass, watchFiles);
