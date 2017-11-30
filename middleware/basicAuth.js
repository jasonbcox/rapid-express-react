
var basicAuth = require('basic-auth');

module.exports = function() {
  return function(request, response, next) {
    function unauthorized(res) {
      response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return response.send(401);
    }

    var user = basicAuth(request);

    if (!user || !user.name || !user.pass) {
      return unauthorized(response);
    }

    if (user.name === 'admin' && user.pass === 'password') {
      return next();
    } else {
      return unauthorized(response);
    }
  }
};

