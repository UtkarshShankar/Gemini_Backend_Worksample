const express  = require('express');

const router  = express.Router()
router.post("/signup", async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      data: '{ user }',
    })
  } catch (error) {
    next(error)
  }
})

//added for testing error cases
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
module.exports = router;