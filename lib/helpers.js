var _  = require('lodash');
var fs = require('fs');

//
// Path to absolute
//
// normalize both relative and absolute paths to be absolue (relative start with `.`)
//
// Parameters:
//   basePath
//     [String] - base path to resolve relative paths
//
//   initPath
//     [String] - path to build to, abolute or relative
//
//
exports.pathToAbsolute = function (basePath, initPath) {
  if (!(_.isString(basePath) && _.isString(initPath))) { throw new Error('pathtoAbsolute requires both basePath and initPath to be strings'); }

  var result = null;

  // relative
  if (~initPath.indexOf('.')) {
    pathSplit = initPath.split('/')
    pathSplit.shift();
    initPath = pathSplit.join('/');
    initPath = initPath.indexOf('/') === 0 ? initPath : '/' + initPath;
    result   = basePath + initPath;

  // absolute
  } else {
    result = initPath;
  }

  return result;
}


//
// Join Paths
//
// join path with a leading / and /'s between them
//
// Parameters
//  leading
//    [String] - first path to join
//
//  trailing
//    [String] - second path to join
//
exports.joinPaths = function (leading, trailing) {
  if (!(_.isString(leading) && _.isString(trailing))) { throw new Error('joinPaths requires both leading and trailing to be strings'); }
  if (!(leading && trailing)) { return leading + trailing; }

  var newPath = leading;
  newPath = newPath.indexOf('/') === 0 ? newPath : '/' + newPath;

  if (/\/$/.test(newPath) && ~trailing.indexOf('/')) {
    trailing = trailing.substring(1);

  } else if (!/\/$/.test(newPath) && trailing.indexOf('/')) {
    newPath +=  '/'
  }

  return newPath + trailing;
}



//
// Join Paths
//
//  get whether of not the request is authorized
//
// Parameters
//  config
//    [Object] - config object
//
//  buckets
//    [Object] - obhjec tof buckets to get authorization from
//
exports.isAuthorized = function (config, buckets, cookieValue) {
  var isAuthorized = false;
  if (!config.restrict) { return true; }
  if (cookieValue === config.restrict.key.value) { return true; }
  _.each(config.restrict.accept, function (acceptVal) {
    acceptVal = acceptVal.toLowerCase();
    if (buckets[acceptVal] && buckets[acceptVal][config.restrict.key.name]  === config.restrict.key.value) {
      isAuthorized = true
    }
  });

  return isAuthorized;
}


//
// Static File
//
// return the text of a /dist file
//
// Parameters
//  fileName
//    [String] - file path to access
//
exports.staticFile = function (fileName) {
    var absolute = (fileName.indexOf('/') === 0) ? fileName : (__dirname + '/../dist/' + fileName);
    var file = fs.readFileSync(absolute);
    if (!file) {
      throw new Error('Failed to read file ' + fileName);
    } else {
      return file;
    }
  }
