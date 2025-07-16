const express  = require('express');
const authService = require('../services/authService');
const router  = express.Router()



router.post("/signup", async (req, res, next) => {
  try {
   const { mobileNumber, fullName, email } = req.body

    const user = await authService.signup(mobileNumber, fullName, email);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { user },
    })
  } catch (error) {
    next(error)
  }
})

router.post("/send-otp", async (req, res, next) => {
  try {
    const { mobileNumber } = req.body

    const result = await authService.sendOTP(mobileNumber)

    res.status(200).json({
      status: "success",
      message: result.message,
      data: {
        otp: result.otp, 
        expiresAt: result.expiresAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post("/verify-otp", async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body

    const result = await authService.isValidOTP(mobileNumber,otp)

    res.status(200).json({
      status: "success",
      message: result.message,
      userDetails: result.userDetails
    })
  } catch (error) {
    res.status(401).send(error.message);
    // next(error)
  }
})


//added for testing error cases
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(409).send('User Aleready Exists!');
});
module.exports = router;