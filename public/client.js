function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || "GET", options.pathname, true);
  req.addEventListener("load", function() {
    if (req.status < 400) {
      callback(null, req.responseText);
    } else {
      callback(new Error("Response failed: ", req.statusText));
    }
  });
  req.addEventListener("error", function(error) {
    callback(new Error("Network error"));
  });
  req.send(options.body || null);
}

function reportError(error) {
  if (error)
    alert(error.toString());
}

function postHandler(error, data) {
  if (error) return reportError(error);
  var targetNode = document.getElementById("posts");
  targetNode.appendChild(renderPosts(JSON.parse(data)));
}

function renderPosts(data) {
  var list = document.createElement("ol");
  data.forEach(function(post) {
    var item = document.createElement("li");
    item.textContent = "ID: " + post.id + "\n" +
                       "Title: " + post.title + "\n" +
                       "Author: " + post.author + "\n" +
                       "Slug Base: " + post.slugBase + "\n" +
                       "Slug: " + post.slug + "\n" +
                       "Body: " + post.body + "\n" +
                       "Posted At: " + post.createdAt + "\n" +
                       "Updated At: " + post.updatedAt + "\n\n";
    list.appendChild(item);
  });
  return list;
}

var postForm = document.getElementById("post-form");
postForm.addEventListener("submit", function(event) {
  event.preventDefault();
  request({
    method: "POST",
    pathname: "/posts",
    body: JSON.stringify({
      title: postForm.elements.title.value,
      author: postForm.elements.author.value,
      body: postForm.elements.body.value,
    }),
  }, reportError);
});

request({ method: "GET", pathname: "/posts" }, postHandler);