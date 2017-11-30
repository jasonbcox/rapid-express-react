
var React = require('react');
var ReactDOMServer = require('react-dom/server');

module.exports = function(appPath) {
  var App = require(appPath);

  return function(initialState) {
    return ReactDOMServer.renderToString(<App initialState={initialState} />);
  };
};
