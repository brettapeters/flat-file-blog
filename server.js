var http = require("http");

var config = require("./config");
var Posts = require("./posts");
var Routes = require("./routes");
var staticServer = require("./static-server")();

http.createServer(function(request, response) {
  if(!Routes.resolve(request, response))
    staticServer(request, response);
}).listen(config, function() {
  console.log("App running at: " + config.root);
})