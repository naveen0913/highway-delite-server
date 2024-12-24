import express from 'express';
import {requestOtpForLogin, requestOtpForSignup,verifyOtpForLogin,verifyOtpForSignup} from '../controllers/UserController.js';


const router = express.Router();
router.post('/signup/otp', requestOtpForSignup);
router.post('/signup/verify-otp', verifyOtpForSignup);
router.post('/login/otp',requestOtpForLogin);
router.post('/login/verify-otp',verifyOtpForLogin)

export default router;