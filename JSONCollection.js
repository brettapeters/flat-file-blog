var fs = require("fs");

var JSONCollection = module.exports = function(name) {
  this.filename = name + ".json";
  fs.writeFile(this.filename,
               JSON.stringify([]),
               { flag: "wx" },
               function(err) {
    if (err && !err.code == "EEXIST") {
      console.error("There was an error", err);
    }
  });
};

JSONCollection.prototype.findOne = function(slug, callback) {
  fs.readFile(this.filename, "utf8", function(error, data) {
    if (error) {
      callback(error);
    } else {
      var allData = JSON.parse(data);
      var found;
      allData.some(function(doc) {
        if (doc.slug === slug) {
          found = doc;
          return true;
        }
      });
      if (!found) {
        callback(new Error("Not found"));
      } else {
        callback(null, found);
      }
    }
  });
};

JSONCollection.prototype.find = function(search, callback) {
  fs.readFile(this.filename, "utf8", function(error, data) {
    if (error) {
      callback(error);
    } else {
      var keys = Object.keys(search);
      var allData = JSON.parse(data);
      var found;
      allData.forEach(function(doc) {
        if (!doc.deleted &&
            keys.every(function(key) {
            return (doc.hasOwnProperty(key) &&
                    doc[key] === search[key]);
            })) {
              found = found || [];
              found.push(doc);
            }
      });
      callback(null, found);
    }
  });
};

JSONCollection.prototype.insert = function(doc, callback) {
  var self = this;
  fs.readFile(this.filename, "utf8", function(error, data) {
      if (error) {
      callback(error);
    } else {
      doc.id = uuid.v4();
      doc.createdAt = doc.updatedAt = new Date();
      doc.deleted = false;
      
      var allData = JSON.parse(data);
      allData.push(doc);
      fs.writeFile(self.filename, JSON.stringify(allData), callback);
    }
  });
};

JSONCollection.prototype.update = function(docId, updates, callback) {
  var self = this;
  fs.readFile(this.filename, "utf8", function(error, data) {
    if (error) {
      callback(error);
    } else {
      var allData = JSON.parse(data);
      if (!allData.some(function(doc) {
        if (doc.id === docId) {
          merge(doc, updates);
          doc.updatedAt = new Date();
          return true;
        }
      })) {
        callback(new Error("Not found"));
      } else {
        fs.writeFile(self.filename, JSON.stringify(allData), callback);
      }
    }
  });
};

JSONCollection.prototype.delete = function(docId, callback) {
  this.update(docId, { deleted: true }, callback);
};

function merge(doc, other) {
  for (var property in other) {
      doc[property] = other[property];
  }
}
