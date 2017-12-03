
var React = require('react');
var ReactDOMServer = require('react-dom/server');

module.exports = function(appPath) {
  var App = require(appPath);

  return function(content) {
    return ReactDOMServer.renderToString(<App content={content} />);
  };
};
