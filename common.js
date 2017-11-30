
var Path = require('path');

module.exports = function (common) {

// log() - Log the given message to the specified log file
// logFileTag - the filename tag of the log file to append to
// fileOrigin - always __filename from the caller
// message - The message to append to the log file
  common.log = function (fileOrigin, logFileTag) {
    var logFolder = 'logs/';
    var logFilePostfix = '-' + logFileTag + '.log';
    return {
      error: function(message) {
        this._logMessageWithLoggingLevel(message, 'ERROR');
      },
      console: function(message, optionalSpacing) {
        var spacing = "";
        if (optionalSpacing) {
          for (var i = 0; i < optionalSpacing; i++) {
            spacing += "\n";
          }
        }
        if (optionalSpacing) console.log(spacing);
        console.log(message);
        if (optionalSpacing) console.log(spacing);
      },
      info: function(message) {
        this._logMessageWithLoggingLevel(message, 'INFO');
      },
      warn: function(message) {
        this._logMessageWithLoggingLevel(message, 'WARN');
      },
      _logMessageWithLoggingLevel: function (message, loggingLevel) {
      var now = new Date();
      var datePrefix = now.getUTCFullYear().toString() + '_' + (now.getUTCMonth()+1) + '_' + now.getUTCDate();
      var logFileName = logFolder + datePrefix + logFilePostfix;
        message = now.toTimeString() + '[' + loggingLevel + '][' + Path.basename(fileOrigin) + '] ' + message + '\n';
        common.fs.appendFile(
        logFileName,
        message,
        function (err) {
          if (err) console.error("Error: Unable to write '" + message + "' to log file '" + logFileName + "' !");
        }
      );
    }
    }
  };

  var Log = common.log(__filename, 'server');

// serveError() - Send response to client with error code and error message
// response - The response object used to send the error to client.  If null, nothing is sent.
// clientError - The error object to send to the client, which contains errorCode and message.  If null, nothing is sent.
// Note that this can still be used to append extra information to the log, so setting response to null is the preferred
// way of preventing the error from being sent.
  common.serveError = function(response, clientError) {
    if(response.headersSent) {
      return;
    }
    if(response && clientError) {
      if(!clientError.errorCode) {
        clientError.errorCode = 500;
      }
      response.status(clientError.errorCode).json({ error: clientError.message });
    }
  };

  common.serveData = function(response, data) {
    if(response.headersSent) {
      Log.error('Very bad! Headers are already sent! What are you doing?\n data: ' + JSON.stringify(data));
    }
    else{
      response.json(data);
    }
  };

};

