var Router = module.exports = function() {
  this.routes = [];
};

Router.prototype.add = function(method, path, handler) {
  var re = pathToRegExp(path);
  this.routes.push({ method, path, re, handler });
};

Router.prototype.resolve = function(request, response) {
  var path = require("url").parse(request.url).pathname;
  
  return this.routes.some(function(route) {
    var match = route.re.exec(path);
    if (!match || route.method !== request.method) return false;
    
    var urlParts = match.slice(1).map(decodeURIComponent);
    route.handler.apply(null, [request, response].concat(urlParts));
    
    return true;
  });
};

function pathToRegExp(path) {
  return new RegExp("^" + path.replace(/\/\:(\w+)/, "/([^\\/]+)") + "$");
}
