var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var buble = require('rollup-plugin-buble');
var package = require('../package.json');
var banner =
    "/*!\n" +
    " * vue-event-manager v" + package.version + "\n" +
    " * https://github.com/pagekit/vue-event-manager\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  plugins: [buble()]
})
.then(bundle =>
  bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueEventManager'
  }).then(({code}) => write('dist/vue-event-manager.js', code, bundle))
)
.then(bundle =>
  write('dist/vue-event-manager.min.js', banner + '\n' +
    uglify.minify(read('dist/vue-event-manager.js')).code,
  bundle)
)
.then(bundle =>
  bundle.generate({
    format: 'es',
    banner: banner
  }).then(({code}) => write('dist/vue-event-manager.es2015.js', code, bundle))
)
.then(bundle =>
  bundle.generate({
    format: 'cjs',
    banner: banner
  }).then(({code}) => write('dist/vue-event-manager.common.js', code, bundle))
)
.catch(logError);

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

function write(dest, code, bundle) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
