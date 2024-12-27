import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Users from '../models/User.js'
import jwt from 'jsonwebtoken';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const otpStore = new Map();

// 1. Request OTP for Signup
export const requestOtpForSignup = async (req, res) => {
  const { username, dateOfBirth, email } = req.body;

  if (!username || !dateOfBirth || !email) {
    return res.status(400).json({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'All fields are required.' });
  }
 const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) return res.status(409).send({ code: process.env.STATUS_CODE_EXISTS, error: 'User already exists.' });

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    otpStore.set(email, { otp, otpExpiry, username, dateOfBirth });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your SignUp OTP Code',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send OTP email.' });
  }
};

// 2. Verify OTP and Complete Signup
export const verifyOtpForSignup = async (req, res) => {
  const { username, dateOfBirth, email, otp } = req.body;
  if (!username || !dateOfBirth || !email || !otp) return res.status(400).send({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'All fields are required.' });

  const storedData = otpStore.get(email);
  if (!storedData || storedData.otp !== otp || Date.now() > storedData.expiresAt) {
    return res.status(400).send({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'Invalid or expired OTP.' });
  }

  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) return res.status(409).send({ code: process.env.STATUS_CODE_EXISTS, error: 'User already exists.' });

    await Users.create({ username, dateOfBirth, email, isVerified: true });
    otpStore.delete(email);
    res.status(201).send({ code: process.env.STATUS_CODE_CREATED, message: 'Signup successful.' });
  } catch (error) {
    res.status(500).send({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Error during signup.' });
  }
};


//method for login with OTP
export const requestOtpForLogin = async (req, res) => {
  const { email } = req.body;
  if (!email) { 
    return res.status(400).send({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'Email is required.' });
  }

  try {
    // Check if the user exists
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'User not found.' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 600000 }); // OTP valid for 10 mins

    // Send OTP to email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).send({code: process.env.STATUS_CODE_SUCCESS,message:'OTP sent to your email.'});
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).send( { code: process.env.STATUS_CODE_INTERNAL_ERROR, error:'Failed to send OTP.'});
  }
}


//user login method 
export const verifyOtpForLogin = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'Email and OTP are required.' });

  try {
    // Check OTP
    const storedOtpData = otpStore.get(email);
    if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expiresAt) {
      return res.status(401).send({ code: process.env.STATUS_CODE_UNAUTHORIZED, error: 'Invalid or expired OTP.' });
    }

    // Verify user existence
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'User not found.' });
    }

    // Clear OTP store
    otpStore.delete(email);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY,);

    res.status(200).send({ code: process.env.STATUS_CODE_SUCCESS, message: 'Login successful.', token: token ,data:user});
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
  }
};
