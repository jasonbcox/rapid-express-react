
var ReactHtmlParser = require('react-html-parser').default;

module.exports = function(content) {
  return ReactHtmlParser(content, {
    transform: function(node) {
      // Remove data-reactroot from top level element because it was added by ReactDOMServer.renderToString
      if (node.attribs) {
        delete node.attribs['data-reactroot'];
      }
    }
  });
}
