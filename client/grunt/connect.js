var PORT = '4000';
module.exports = {
  options: {
    port:PORT,
    hostname: '*'
  },
  debug: {
    options: {
      middleware: function (connect) {
        return [
          require('connect-livereload')(),
          require('../server/index')
        ];
      },
      livereload:true
    }
  }
}