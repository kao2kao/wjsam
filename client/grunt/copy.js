var path = require('path');
var compileCss = require('es-css2js/lib/compile');
var modulesFiles = [];
var namespaces = {};
var env = 'dev';
var cp = require('child_process');
module.exports = {
    dev: {
        nonull: true,
        files: [
            // Include our bower JS dependencies

            // angular
            {src: "bower_components/angular/angular.js", dest: "src/vendor/angular/angular.js"},
            {src: "bower_components/angular-animate/angular-animate.js", dest: "src/vendor/angular/angular-animate/angular-animate.js"},
            {src: "bower_components/angular-cookies/angular-cookies.js", dest: "src/vendor/angular/angular-cookies/angular-cookies.js"},            
            {src: "bower_components/angular-resource/angular-resource.js", dest: "src/vendor/angular/angular-resource/angular-resource.js"},
            {src: "bower_components/angular-sanitize/angular-sanitize.js", dest: "src/vendor/angular/angular-sanitize/angular-sanitize.js"},
            {src: "bower_components/angular-touch/angular-touch.js", dest: "src/vendor/angular/angular-touch/angular-touch.js"},
          
            // bootstrap
            {src: "bower_components/bootstrap/dist/css/bootstrap.css", dest: "src/css/bootstrap.css"},
            {src: "bower_components/bootstrap/dist/js/bootstrap.js", dest: "src/vendor/jquery/bootstrap.js"},
            {src: "**", dest: "src/fonts", cwd: 'bower_components/bootstrap/fonts', expand : true},

            // fontawesome
            {src: "bower_components/font-awesome/css/font-awesome.min.css", dest: "src/css/font-awesome.min.css"},
            {src: "**", dest: "src/fonts", cwd: 'bower_components/font-awesome/fonts', expand : true},

            // libs
            {src: "bower_components/moment/min/moment.min.js", dest: "src/vendor/libs/moment.min.js"},
            {src: "bower_components/screenfull/dist/screenfull.min.js", dest: "src/vendor/libs/screenfull.min.js"},

            // core
            {src: "bower_components/angular-ui-router/release/angular-ui-router.js", dest: "src/vendor/angular/angular-ui-router/angular-ui-router.js"},
            {src: "bower_components/angular-bootstrap/ui-bootstrap-tpls.js", dest: "src/vendor/angular/angular-bootstrap/ui-bootstrap-tpls.js"},
            {src: "bower_components/angular-translate/angular-translate.js", dest: "src/vendor/angular/angular-translate/angular-translate.js"},
            {src: "bower_components/angular-ui-utils/ui-utils.js", dest: "src/vendor/angular/angular-ui-utils/ui-utils.js"},
            {src: "bower_components/ngstorage/ngStorage.js", dest: "src/vendor/angular/ngstorage/ngStorage.js"},
            {src: "bower_components/oclazyload/dist/ocLazyLoad.js", dest: "src/vendor/angular/oclazyload/ocLazyLoad.js"},

            // modules for lazy load
            {src: "bower_components/angular-ui-select/dist/select.min.js", dest: "src/vendor/modules/angular-ui-select/select.min.js"},
            {src: "bower_components/angular-ui-select/dist/select.min.css", dest: "src/vendor/modules/angular-ui-select/select.min.css"},

            {src: "bower_components/textAngular/dist/textAngular.min.js", dest: "src/vendor/modules/textAngular/textAngular.min.js"},
            {src: "bower_components/textAngular/dist/textAngular-sanitize.min.js", dest: "src/vendor/modules/textAngular/textAngular-sanitize.min.js"},

            {src: "bower_components/venturocket-angular-slider/build/angular-slider.min.js", dest: "src/vendor/modules/angular-slider/angular-slider.min.js"},
            
            {src: "bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js", dest: "src/vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js"},
            {src: "bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css", dest: "src/vendor/modules/angular-bootstrap-nav-tree/abn_tree.css"},

            {src: "bower_components/angular-file-upload/angular-file-upload.min.js", dest: "src/vendor/modules/angular-file-upload/angular-file-upload.min.js"},

            {src: "bower_components/ngImgCrop/compile/minified/ng-img-crop.js", dest: "src/vendor/modules/ngImgCrop/ng-img-crop.js"},
            {src: "bower_components/ngImgCrop/compile/minified/ng-img-crop.css", dest: "src/vendor/modules/ngImgCrop/ng-img-crop.css"},
            
            // {src: "bower_components/angular-ui-calendar/src/calendar.js", dest: "src/vendor/modules/angular-ui-calendar/calendar.js"},
            
            {src: "bower_components/angular-ui-map/ui-map.js", dest: "src/vendor/modules/angular-ui-map/ui-map.js"},

            {src: "bower_components/angularjs-toaster/toaster.js", dest: "src/vendor/modules/angularjs-toaster/toaster.js"},
            {src: "bower_components/angularjs-toaster/toaster.css", dest: "src/vendor/modules/angularjs-toaster/toaster.css"},

            {src: "bower_components/ng-grid/build/ng-grid.min.js", dest: "src/vendor/modules/ng-grid/ng-grid.min.js"},
            {src: "bower_components/ng-grid/ng-grid.min.css", dest: "src/vendor/modules/ng-grid/ng-grid.min.css"},

            {src: "bower_components/videogular/videogular.min.js", dest: "src/vendor/modules/videogular/videogular.min.js"},
            {src: "bower_components/videogular-controls/controls.min.js", dest: "src/vendor/modules/videogular/plugins/controls.min.js"},
            {src: "bower_components/videogular-buffering/buffering.min.js", dest: "src/vendor/modules/videogular/plugins/buffering.min.js"},
            {src: "bower_components/videogular-overlay-play/overlay-play.min.js", dest: "src/vendor/modules/videogular/plugins/overlay-play.min.js"},
            {src: "bower_components/videogular-poster/poster.min.js", dest: "src/vendor/modules/videogular/plugins/poster.min.js"},
            {src: "bower_components/videogular-ima-ads/ima-ads.min.js", dest: "src/vendor/modules/videogular/plugins/ima-ads.min.js"},


        ]
    },
    dist: {
        files: [
            {expand: true, dest: 'dist/', src:'**', cwd:'src/'},
            {dest: 'dist/index.html', src:'src/index.min.html'}
        ]
    },
    compile: {
        files:[{
            cwd: 'src',
            expand: true,
            src: ['./**/*.js', './**/*.less', './**/*.html'],
            dest: 'dist/',
            rename:function(filepath, name){
                var ext = path.extname(name);
                if(ext === '.less'){
                    name = name.replace(/\.less$/, '.js');
                }else if(ext === '.html'){
                    name = name.replace(/\.html$/, '.js');
                }
                return path.resolve(filepath, name);
            }
        }],
        options: {
            process: compileAngularModule
        }
    }
};
function compileAngularModule(content, srcpath){
    var root = srcpath.split('/')[0];
    var moduleFullPath = path.relative(root, srcpath);
    var ext = path.extname(moduleFullPath);
    var basename = path.basename(moduleFullPath, ext);
    var dirname = path.dirname(moduleFullPath);
    var modulePath = path.join(dirname, basename);
    var absoluteDirname = path.dirname(path.resolve(__dirname, srcpath));
    var name = modulePath.replace(new RegExp('\\' + path.sep, 'g'), '.');
    //push file to module file list
    modulesFiles.push(modulePath + '.js');
    //push module name to namespaces
    var namespace = getNameSpace(name);
    if(namespace){
        var contains = namespaces[namespace];
        if(!contains)contains = namespaces[namespace] = [];
        contains.push(name);
    }
    //compile less file to js
    if(ext == '.less'){
       // content = compileLess(content, absoluteDirname);
    }
    //compile html file to js
    if(ext == '.html'){
        content = compileHtml(content, absoluteDirname);
    }

    //replace assets url
    content = replaceAssetsUrl(content, env);

    //compile js
    content = content.replace(/(angular\.module\()\s*(\'@\'|\"@\")/g, '$1\'' + name + '\'');
    content = content.replace(/(\$templateCache\.put\()\s*[\'\"]@[\'\"]\s*(\,.+\))/g, '$1\'' + name + '\'$2');

    //remove unnecessary comma
    content = content.replace(/\,([(\r?\n)\s]*)\}/g, '$1}');

    //wrap
    content = '(function(){' + content + '\n})();';
    return content;
}


function compileLess(content, filepath){
    var css = cp.execFileSync('node', [path.resolve(__dirname, './task/compileLess.js'), content, filepath]).toString();
    var result = compileCss(css, function(content){
        return 'angular.module("@",[]).run(function(){' + content + '})';
    });
    return result;
}

function compileHtml(content, filepath){
    if(!content)content = '';
    var lines = content.split(/\r?\n/);
    var lineCount = lines.length;

    var string = '[' + lines.map(function (line, index) {
            var isLastOne = index === (lineCount - 1);
            line = line.replace(/\\/g, '\\\\');
            line = line.replace(/\"/g, '\\"');
            return '"' + line + '' + (!isLastOne ? '\\n' : '') + '"';
        }).join(',') + '].join("")';
    return 'angular.module("@", []).run(["$templateCache", function($templateCache){$templateCache.put("@", ' + string + ')}])';
}

function getNameSpace(name){
    if(!name)return '';
    var namespace = name.split('.');
    if(namespace.length > 1){
        namespace[namespace.length - 1] = '*';
        namespace = namespace.join('.');
    }else{
        namespace = '';
    }
    return namespace;
}

function replaceAssetsUrl(content, env){
    return content.replace(/\{@@ASSETS_URL\}/g, "/");
}


function compileLess(content, filepath){
    var css = cp.execFileSync('node', [path.resolve(__dirname, './compileLess.js'), content, filepath]).toString();
    var result = compileCss(css, function(content){
        return 'angular.module("@",[]).run(function(){' + content + '})';
    });
    return result;
}

function compileHtml(content, filepath){
    if(!content)content = '';
    var lines = content.split(/\r?\n/);
    var lineCount = lines.length;

    var string = '[' + lines.map(function (line, index) {
            var isLastOne = index === (lineCount - 1);
            line = line.replace(/\\/g, '\\\\');
            line = line.replace(/\"/g, '\\"');
            return '"' + line + '' + (!isLastOne ? '\\n' : '') + '"';
        }).join(',') + '].join("")';
    return 'angular.module("@", []).run(["$templateCache", function($templateCache){$templateCache.put("@", ' + string + ')}])';
}