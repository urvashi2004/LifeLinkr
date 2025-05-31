const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  f_Id: { type: Number, required: true, unique: true },
  f_Image: String,
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true },
  f_Mobile: { type: String, required: true },
  f_Designation: String,
  f_gender: String,
  f_Course: String,
  f_Createdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('t_Employee', employeeSchema);