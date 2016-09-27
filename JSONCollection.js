var fs = require("fs");

function JSONCollection(options) {
  options = options || {};
  this.filename = (options.name || "collection") + ".json";
  this.primaryKey = options.primaryKey || "id";
  this.init();
};

JSONCollection.prototype.init = function() {
  var currentId = 0,
      collection = [];
  
  fs.writeFile(this.filename,
               JSON.stringify({ currentId, collection }),
               { flag: "wx" },
    (err) => {
      if (err && !err.code == "EEXIST") {
        return console.log("There was an error:", err);
      }
    }
  );
};

JSONCollection.prototype.findOne = function(key, callback) {
  fs.readFile(this.filename, "utf8", (error, data) => {
    if (error) {
      callback(error);
    } else {
      var allData = JSON.parse(data);
      var found;
      allData.collection.some(function(doc) {
        if (doc[this.primaryKey] === key) {
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
  fs.readFile(this.filename, "utf8", (error, data) => {
    if (error) {
      callback(error);
    } else {
      var keys = Object.keys(search);
      var allData = JSON.parse(data);
      var found;
      allData.collection.forEach(function(doc) {
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
  fs.readFile(this.filename, "utf8", (error, data) => {
      if (error) {
      callback(error);
    } else {
      var allData = JSON.parse(data);
      
      doc.id = allData.currentId;
      doc.createdAt = doc.updatedAt = new Date();
      doc.deleted = false;
      
      allData.collection.push(doc);
      allData.currentId += 1;
      fs.writeFile(this.filename, JSON.stringify(allData), callback);
    }
  });
};

JSONCollection.prototype.update = function(docId, updates, callback) {
  fs.readFile(this.filename, "utf8", (error, data) => {
    if (error) {
      callback(error);
    } else {
      var allData = JSON.parse(data);
      if (!allData.collection.some(function(doc) {
        if (doc.id === docId) {
          merge(doc, updates);
          doc.updatedAt = new Date();
          return true;
        }
      })) {
        callback(new Error("Not found"));
      } else {
        fs.writeFile(this.filename, JSON.stringify(allData), callback);
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

module.exports = JSONCollection;
