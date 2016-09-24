var Collection = require('./JSONCollection');

var Things = new Collection('things');

// Things.insert({ title: "TWO", description: "HEYYO" }, function(err) {
//   if (err) console.log(err);
//   console.log("Inserted");
// });

Things.find({}, function(err, data) {
  console.log(data);
});

// Things.findOne("842f1d15-0545-4a76-8a9f-53e99e933d35", function(err, data) {
//   if (err) console.log(err);
//   console.log(data);
// });

// Things.update("f9d9be94-9643-45a5-aadc-416f4f0ce5ad",{}, function(err) {
//   if (err) console.log(err);
//   console.log("updated");
// });

// Things.delete("f9d9be94-9643-45a5-aadc-416f4f0ce5ad", function(err) {
//   if (err) console.log(err);
//   console.log("deleted");
// });