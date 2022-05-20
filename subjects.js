const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  name: String,
});

const Subject = mongoose.model(
  "Subject",
  subjectSchema,
  "Subject_AssignmentOyeLabs"
);

module.exports = Subject;
