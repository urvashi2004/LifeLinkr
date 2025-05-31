const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Login = require('../models/Login');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lifelinkr-employees', // or any folder name you want
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});
const upload = multer({ storage });

// Update Employee API (with image upload)
router.put('/employees/:id', upload.single('image'), async (req, res) => {
  try {
    const empId = req.params.id;
    const { name, email, mobile, designation, gender, course } = req.body;
    // Server-side validation
    if (!name || !email || !mobile || !designation || !gender || !course || (Array.isArray(course) ? course.length === 0 : !course)) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Email format validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Mobile numeric validation (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Mobile must be 10 digits' });
    }
    // Find employee to update
    const employee = await Employee.findOne({ f_Id: empId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    // Email duplicate check (exclude self)
    const emailExists = await Employee.findOne({ f_Email: email, f_Id: { $ne: empId } });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    // Mobile duplicate check (exclude self)
    const mobileExists = await Employee.findOne({ f_Mobile: mobile, f_Id: { $ne: empId } });
    if (mobileExists) {
      return res.status(409).json({ message: 'Mobile number already exists' });
    }
    // Image file type validation (already handled by multer, but double check)
    if (req.file && !["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only jpg/png allowed' });
    }
    // Prepare update object
    const updateObj = {
      f_Name: name,
      f_Email: email,
      f_Mobile: mobile,
      f_Designation: designation,
      f_gender: gender,
      f_Course: Array.isArray(course) ? course.join(',') : course,
    };
    if (req.file) {
      updateObj.f_Image = req.file.path || req.file.url;
    }
    // Update employee
    const updated = await Employee.findOneAndUpdate(
      { f_Id: empId },
      { $set: updateObj },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log('Error in /employees/:id PUT:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create Employee API (with image upload)
router.post('/employees', upload.single('image'), async (req, res) => {
  try {
    console.log('--- EMPLOYEE CREATE API HIT ---');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const { name, email, mobile, designation, gender, course } = req.body;
    // Server-side validation
    if (!name || !email || !mobile || !designation || !gender || !course || (Array.isArray(course) ? course.length === 0 : !course)) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Email format validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Mobile numeric validation (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      console.log('Validation failed: invalid mobile');
      return res.status(400).json({ message: 'Mobile must be 10 digits' });
    }
    // Email duplicate check
    const exists = await Employee.findOne({ f_Email: email });
    if (exists) {
      console.log('Validation failed: duplicate email');
      return res.status(409).json({ message: 'Email already exists' });
    }
    // Mobile duplicate check
    const mobileExists = await Employee.findOne({ f_Mobile: mobile });
    if (mobileExists) {
      console.log('Validation failed: duplicate mobile');
      return res.status(409).json({ message: 'Mobile number already exists' });
    }
    // Image file type validation (already handled by multer, but double check)
    if (req.file && !["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      console.log('Validation failed: invalid image type', req.file.mimetype);
      return res.status(400).json({ message: 'Only jpg/png allowed' });
    }

    // Create date
    const createdate = new Date();

    // Find next unique id
    const last = await Employee.findOne().sort({ f_Id: -1 });
    const nextId = last ? last.f_Id + 1 : 1;

    // Debug log for req.file
    console.log('req.file:', req.file);
    // Save employee with image path if uploaded (Cloudinary URL)
    const emp = await Employee.create({
      f_Id: nextId,
      f_Name: name,
      f_Email: email,
      f_Mobile: mobile,
      f_Designation: designation,
      f_gender: gender,
      f_Course: Array.isArray(course) ? course.join(',') : course,
      f_Createdate: createdate,
      f_Image: req.file ? (req.file.path || req.file.url) : undefined // Cloudinary URL fallback
    });
    res.status(201).json(emp);
  } catch (err) {
    console.log('Error in /employees POST:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Employees API
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required' });

  const user = await Login.findOne({ f_userName: username, f_Pwd: password });
  if (user) {
    res.json({ success: true, username, fullName: user.f_fullName || user.f_userName });
  } else {
    res.status(401).json({ message: 'Invalid login details' });
  }
});

module.exports = router;

// Delete Employee API
router.delete('/employees/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const deleted = await Employee.findOneAndDelete({ f_Id: empId });
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.log('Error in /employees/:id DELETE:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});