// Script to add a dummy login user to the database
const mongoose = require('mongoose');
const Login = require('../models/Login');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lifelinkr';

async function addDummyUser() {
  await mongoose.connect(MONGO_URI);
  const exists = await Login.findOne({ f_userName: 'hukum123' });
  if (!exists) {
    const last = await Login.findOne().sort({ f_sno: -1 });
    const nextSno = last ? last.f_sno + 1 : 1;
    await Login.create({ f_sno: nextSno, f_userName: 'hukum123', f_Pwd: 'Hello01.!', f_fullName: 'Hukum Gupta' });
    console.log('Dummy user added.');
  } else {
    console.log('Dummy user already exists.');
  }
  mongoose.disconnect();
}

addDummyUser();
