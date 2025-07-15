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

//added for testing error cases
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(409).send('User Aleready Exists!');
});
module.exports = router;