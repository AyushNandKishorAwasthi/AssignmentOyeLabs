const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
  },
  address: String,
  mobile: {
    type: Number,
    unique: true,
    required: [true, "Please enter customer mobile contact number"],
  },
  subjects: [{ type: mongoose.Schema.ObjectId, ref: "Subject" }],
});

const Customer = mongoose.model(
  "Customer",
  customerSchema,
  "Customer_AssignmentOyeLabs"
);

module.exports = Customer;
