const express  = require('express');

const router  = express.Router()
router.get("/", async (req, res, next) => {
  try {

    // throw new Error('err');
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