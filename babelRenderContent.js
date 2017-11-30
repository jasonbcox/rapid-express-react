
var babelOptions = {
  presets: [require('babel-preset-es2015'), require('babel-preset-react')],
  plugins: [require('babel-plugin-transform-runtime')],
  ignore: false,
  babelrc: false,
};
require('babel-register')(babelOptions);
var fs = require('fs');

var shared = require('./static/shared');

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
        var initialState = {content: ReactDOMServer.renderToString(pageData.content)};
        response.render(pagePartial, {
          title: pageData.title,
          description: pageData.description,
          content: initApp(initialState),
          initialState: JSON.stringify(initialState),
        });
      } else {
        response.status(404).send({error: "404: Content Not Found"});
      }
    };
  };
};

module.exports = function(staticDir, appPath) {
  return {
    fetchContent: fetchContent(staticDir, appPath),
  };
};

