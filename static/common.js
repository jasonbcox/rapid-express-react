
function setupCommonUtils(common) {

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  common.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  common.formatDate = function (dateStr) {
    var date = new Date(dateStr);
    return common.months[ date.getMonth() ] + ' ' + date.getDay() + ', ' + date.getFullYear();
  };

  common.error = function (r) {
    if (r) {
      console.log(r);
      return true;
    }
    return false;
  };

  common.isEmpty = function (obj) {
    if (typeof obj.length !== 'undefined') return obj.length == 0;
    return ( Object.getOwnPropertyNames(obj).length === 0 );
  };

  // clone() - Deep-copy the given object
  common.clone = function (obj, copyOnly) {
    if (( obj == null ) || ( typeof obj != 'object' )) return obj;

    // Special case for Date object because the time is stored as a hidden member
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Special case for Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0; i < obj.length; i++) {
        // Pass on copyOnly to objects in this array
        copy[i] = common.clone(obj[i], copyOnly);
      }
      return copy;
    }

    // Generic Objects
    if (obj instanceof Object) {
      var copy = {};
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (( typeof copyOnly == 'undefined' ) || ( typeof copyOnly[ property ] != 'undefined' )) {
            var newPropertyName = property;
            if (typeof copyOnly != 'undefined') newPropertyName = copyOnly[ property ];
            copy[ newPropertyName ] = common.clone(obj[ property ]);
          }
        }
      }
      return copy;
    }
    throw new Error("Unable to clone object, as its type isn't supported by clone()");
  };

  common.escape = function (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  };
  common.unescape = function (s) {
    return String(s)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, '\'')
      .replace(/&#x2F;/g, '/')
  };
}

// Export to NodeJS, if it exists
if (typeof module !== 'undefined') {
  module.exports = function(common) {
    setupCommonUtils(common);
  };
} else {
  if (common === undefined) { common = {}; }
  setupCommonUtils(common);
}

