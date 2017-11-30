
var React = require('react');
var createReactClass = require('create-react-class');

// Styles

var StyleZDepth1 = {
  boxSizing: 'border-box',
  boxShadow: 'rgba(0,0,0,0.14) 0px 2px 2px 0px, rgba(0,0,0,0.12) 0px 1px 5px 0px, rgba(0,0,0,0.2) 0px 3px 1px -2px',
};

// React Components

var Link = createReactClass({
  render: function() {
    var target = this.props.target || '_self';
    var href = this.props.href;
    var hrefHasHttp = href.indexOf('http');
    if (hrefHasHttp != -1 && hrefHasHttp < 3) {
      target = '_blank';
    }
    return (
      <a href={this.props.href} target={target}>{this.props.children}</a>
    )
  }
});

var Img = createReactClass({
  render: function() {
    var width = this.props.width || 'auto';
    var height = this.props.height || 'auto';
    var style = {
      'width': width + 'px',
      'height': height + 'px',
    };
    return (
      <Link href={this.props.src}><img src={this.props.src} style={style} /></Link>
    )
  }
});

var H1 = createReactClass({
  render: function() {
    var style = {
      'font-size': '18px',
      'font-weight': 'bold',
    };
    return (
      <span style={style}>{this.props.children}</span>
    )
  }
});

var H2 = createReactClass({
  render: function() {
    var style = {
      'font-size': '26px',
      'font-weight': 'bold',
    };
    return (
      <span style={style}>{this.props.children}</span>
    )
  }
});

module.exports = {
  // Styles
  StyleZDepth1: StyleZDepth1,

  // React Components
  Link: Link,
  Img: Img,
  H1: H1,
  H2: H2,
};

