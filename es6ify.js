var browserify = require('browserify');
var es6ify = require('es6ify');
var fs = require('fs');
var pjson = require('./package.json');
var bundlePath = './dist/'+pjson.name+'-'+pjson.version+'.js';

browserify({ debug: true })
  .add(es6ify.runtime)
  .transform(es6ify)
  .require(require.resolve('./index.js'), { entry: true })
  .bundle()
  .pipe(fs.createWriteStream(bundlePath));
