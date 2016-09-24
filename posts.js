var JSONCollection = require("./JSONCollection");
var Posts = new JSONCollection("posts");

module.exports = Posts;

Posts.insertPost = function(newPost, callback) {
  var title = newPost.title;
  if (!title) {
    callback(new Error("Title Required"));
  } else {
    var base = slugify(title);
    newPost.slugBase = base;
    
    Posts.find({}, function(error, posts) {
      if (error) return callback(error);
      
      if (posts) {
        var n = posts.filter(function(post) {
          return base == post.slugBase;
        }).length;
        if (n > 0) base += "-" + n;
      }
      
      newPost.slug = base;
      Posts.insert(newPost, callback);
    });
  }
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/\s\&\s/g, " and ")
    .replace(/[^\w\s\-\/]/g, "")
    .replace(/[\s\_\-\/]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

var samplePost = { title: "Sample Post",
                   author: "Brett",
                   body: "abcdefghijklmnopqrstuvwxyz" };

// Posts.insertPost(samplePost, function() {
//   Posts.insertPost(samplePost);
// });