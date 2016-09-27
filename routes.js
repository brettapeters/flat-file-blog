var Router = require("./router");
var Posts = require("./posts");

var router = module.exports = new Router();

router.add("GET", "/posts", function(request, response) {
  Posts.find({}, function(error, data) {
    if (error) return respondError(response, error);
    respondJSON(response, 200, data);
  });
});

router.add("GET", "/posts/:slug", function(request, response, slug) {
  Posts.findOne(slug, function(error, data) {
    if (error) return respondError(response, error);
    respondJSON(response, 200, data);
  });
});

router.add("POST", "/posts", function(request, response) {
  readStreamAsJSON(request, function(error, post) {
    if (error) return respondError(response, error);
    if (check(post.title, String) &&
        check(post.author, String) &&
        check(post.body, String)) {
          Posts.insertPost(post);
        }
  });
  response.end();
});

router.add("DELETE", "/posts/:slug", function(request, response, slug) {
  Posts.findOne(slug, function(error, post) {
    if (error) return respondError(response, error);
    // Posts.delete()
  });
})

// Helpers

function respondJSON(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

function respondError(response, error) {
  response.writeHead(500, { "Content-Type": "text/plain" });
  response.end("Internal Server Error: " + error.toString());
}

function readStreamAsJSON(stream, callback) {
  var data = "";
  stream.on("data", function(chunk) {
    data += chunk;
  });
  stream.on("end", function() {
    var result, error;
    try { result = JSON.parse(data); }
    catch(e) { error = e; }
    callback(error, result);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}

function check(value, type) {
  return value.constructor === type;
}