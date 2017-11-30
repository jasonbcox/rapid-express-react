
module.exports = function() {
  return {
    // Init common server functions
    initCommon: function(common) {
      // Load Habitat for loading environment variables
      var env = function() {
        var Habitat = require('habitat');
        Habitat.load();
        return new Habitat();
      }();

      common.env = env;
      common.fs = require('fs');

      // Append server utils to common
      require('./common')(common);

      // Load environment variables
      // If you make changes to the .env file, you must update expected_env_version to match!
      var expected_env_version = '0.0.1';
      var env_version = env.get('ENV_VERSION');
      if (!env_version || env_version != expected_env_version) {
        var err = "Error: ENV_VERSION is mismatched!  Make sure .env is up-to-date!" +
                  "\nExpected .env Version: \t" + expected_env_version +
                  "\nActual .env Version: \t" + env_version;
        common.log(__filename, 'env').console(err, 2);
        return null;
      }

      // Cache middleware
      common.middleware = {};
      common.middleware.restHeaders = require('./middleware/restHeaders')();

      return common;
    },

    // Init express app with "safe" defaults
    initExpress: function(common, partialsPath) {
      var express = require('express');
      var app = express();
      app.use(require('morgan')('combined')); // logger

      var bodyParser = require('body-parser');
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

      var helmet = require('helmet');
      app.use(helmet.xssFilter());
      app.use(helmet.noSniff());
      app.use(helmet.noCache());
      app.use(require('method-override')());
      app.use(require('cookie-parser')(common.env.get('COOKIE_SECRET')));

      app.use(require('express-session')({
        secret: common.env.get('SESSION_SECRET'),
        resave: true,
        saveUninitialized: false,
      }));

      // Setup partials using mustache engine
      var mustacheExpress = require('mustache-express');
      app.set('views', partialsPath);
      app.engine('mustache', mustacheExpress());
      app.set('view engine', 'mustache');

      common.express = express;
      common.expressApp = app;
    },

    // Set static path in express.
    // alias may be set to define a new name for that path.
    // alias may be null to use path as the default name for that path.
    // Example: initExpressStaticPath(common, '/jquery', __dirname + '/node_modules/jquery');
    initExpressStaticPath: function(common, alias, path) {
      if (alias == null) {
        common.expressApp.use(common.express.static(path, {index: false}));
      } else {
        common.expressApp.use(alias, common.express.static(path, {index: false}));
      }
    },
  };
};
