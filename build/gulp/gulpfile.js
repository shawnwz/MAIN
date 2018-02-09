var gulp = require('gulp'),

    fs = require('fs'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    csslint = require('gulp-csslint'),
    csslintreport = require('gulp-csslint-report'),
    print = require('gulp-print'),
    chmod = require('gulp-chmod'),
    gulpsync = require('gulp-sync')(gulp),
    files = JSON.parse(fs.readFileSync('../files.json')),
    esLintRules = JSON.parse(fs.readFileSync('lint/eslint-rules.json')),
    cssLintRules = JSON.parse(fs.readFileSync('css/lint-rules.json')),
    output='',
    defaultDependentTasks = ["clean", "eslint", "csslint"];
    
//clean
gulp.task('clean', function () {
       return del([files.paths.build_output_dir + "**"], {force:true});
});

// csslint
gulp.task('csslint', function(cb) {
  gulp.src([files.paths.src_output_path + "**/*.css"])
    .pipe(print())
    .pipe(chmod(0755))
    .pipe(csslint(cssLintRules.rules))
    .pipe(csslintreport({
      'filename': 'csslink-report.html',
      'directory': files.paths.csslint_output_location
    }));
});

// eslint
gulp.task("doeslinthtml", function (cb) {
    return gulp.src([files.paths.src_output_path + "**/*.js", "!" + files.paths.src_output_path + files.paths.lib_o5_path + "**/*.js"])
        .pipe(print())
        .pipe(chmod(0755))
        .pipe(eslint({
            "parserOptions": esLintRules.options,
            "globals": esLintRules.globals,
            "rules": esLintRules.rules
        }))
       .pipe(eslint.format('html',fs.createWriteStream('eslint-ouptut.html')));
});

gulp.task('copyeslintReporthtml',['doeslinthtml'], function() {
    gulp.src('eslint-ouptut.html')
    .pipe(gulp.dest(files.paths.eslint_output_location));
    
});

gulp.task('eslinthtml',['copyeslintReporthtml'], function() {
    return del('eslint-ouptut.html', {force:true});
});

gulp.task("doeslint", function (cb) {
    return gulp.src([files.paths.src_output_path + "**/*.js", "!" + files.paths.src_output_path + files.paths.lib_o5_path + "**/*.js"])
        .pipe(print())
        .pipe(chmod(0755))
        .pipe(eslint({
            "parserOptions": esLintRules.options,
            "globals": esLintRules.globals,
            "rules": esLintRules.rules
        }))
       .pipe(eslint.format('checkstyle',fs.createWriteStream('jslint-xml-eslint-ouptut.xml')));
       
});

gulp.task('copyeslintReport',['doeslint'], function() {
    gulp.src('jslint-xml-eslint-ouptut.xml')
    .pipe(gulp.dest(files.paths.eslint_output_location));
    
});

gulp.task('eslint',['eslinthtml','copyeslintReport'], function() {
    return del('jslint-xml-eslint-ouptut.xml', {force:true});
});


//default
gulp.task('default', gulpsync.sync(defaultDependentTasks), function() {

});
