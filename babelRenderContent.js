
var fs = require('fs');
var ReactDOMServer = require('react-dom/server');

// Setup function for fetchContent
var fetchContent = function(staticDir, appPath) {
  var initApp = require('./initServerSideApp')(appPath);

  // Fetch contents of a local file and transform it as JSX
  return function(pagePartial, filename) {
    return function(request, response) {
      if (filename[0] != '/') { filename = '/' + filename; }
      if (fs.existsSync(staticDir + filename + '.js')) {
        // Render the page from JSX and provide the initial state for rehydration
        var pageData = require(staticDir + filename);
        var pageContent = pageData.content;
        var initialState = {content: ReactDOMServer.renderToString(pageContent)};
        response.render(pagePartial, {
          title: pageData.title,
          description: pageData.description,
          content: initApp(pageContent),
          initialState: JSON.stringify(initialState),
        });
      } else {
        response.status(404).send({error: "404: Content Not Found"});
      }
    };
  };
};

module.exports = function(projectRootPath, staticDir, appPath, nodeModulesWhitelist) {
  var babelOptions = {
    presets: [require('babel-preset-env'), require('babel-preset-react')],
    plugins: [require('babel-plugin-transform-runtime')],
    only: function(filename) {
      nodeModulesDir = '/node_modules/';
      localPath = filename.substr(projectRootPath.length);

      // By default, all non-node_modules paths are whitelisted to be transformed by babel
      if (localPath.indexOf(nodeModulesDir) == -1) {
        return true;
      }

      // Check nodeModulesWhitelist for paths that should be transformed by babel
      nodeModulesPath = localPath.substr(nodeModulesDir.length);
      for (w in nodeModulesWhitelist) {
        var whitelistedPath = nodeModulesWhitelist[w] + '/';
        if (nodeModulesPath.indexOf(whitelistedPath) == 0) {
          return true;
        }
      }
      return false;
    },
    babelrc: false,
  };
  require('babel-register')(babelOptions);

  // Make sure static/shared can be transformed by babel
  require('./static/shared');

  return {
    fetchContent: fetchContent(staticDir, appPath),
  };
};

