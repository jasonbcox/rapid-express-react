
module.exports = function() {
  return function( request, response, next ) {
    response.type( 'application/json' );
    response.header( 'Access-Control-Allow-Origin', '*' );
    response.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
    next();
  };
};

