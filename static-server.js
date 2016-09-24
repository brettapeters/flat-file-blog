var fs = require('fs');
var path = require('path');

var contentType = 'text/html';
var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'applilcation/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
};

module.exports = function(options) {
  options = options || {};
  var root = options.root || __dirname + '/public';
  
  return function(request, response) {
    var filePath = root + (request.url == '/' ? '/index.html' : request.url);

    var extname = String(path.extname(filePath)).toLowerCase();
    contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, function(error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile(root + '/404.html', function(error, content) {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
          });
        } else {
          response.writeHead(500);
          response.end('Internal Server Error: ' + error.code);
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  };
};