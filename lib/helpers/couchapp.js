// this stuff should be properly namespaced etc

// from couch.js
function encodeOptions(options) {
  var buf = []
  if (typeof(options) == "object" && options !== null) {
    for (var name in options) {
      if (!options.hasOwnProperty(name)) continue;
      var value = options[name];
      if (name == "key" || name == "startkey" || name == "endkey") {
        value = toJSON(value);
      }
      buf.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
  }
  if (!buf.length) {
    return "";
  }
  return "?" + buf.join("&");
}

function concatArgs(array, args) {
  for (var i=0; i < args.length; i++) {
    array.push(args[i]);
  };
  return array;
};

function makePath(array) {
  var options, path;

  if (typeof array[array.length - 1] != "string") {
    // it's a params hash
    options = array.pop();
    log({options:options});
  }
  path = array.map(function(item) {return encodeURIComponent(item)}).join('/');
  if (options) {
    return path + encodeOptions(options);
  } else {
    return path;
  }
};

function assetPath() {
  if (req.headers['X-Orig-Host']) {
    return '/media';
  }
  var parts = ['',req.path[0], '_design', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};

function showPath() {
  var parts = ['',req.path[0], '_show', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};

function listPath() {
  var parts = ['',req.path[0], '_list', req.path[2]];
  return makePath(concatArgs(parts, arguments));
};

function makeAbsolute(req, path) {
  return 'http://' + req.headers.Host + path;
}

function f_(n) {    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

Date.prototype.rfc3339 = function() {
    return this.getUTCFullYear()   + '-' +
         f_(this.getUTCMonth() + 1) + '-' +
         f_(this.getUTCDate())      + 'T' +
         f_(this.getUTCHours())     + ':' +
         f_(this.getUTCMinutes())   + ':' +
         f_(this.getUTCSeconds())   + 'Z';
};

function url(s) {
  return s;
}

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
