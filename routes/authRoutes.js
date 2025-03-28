const { signup } = require('../controller/authController');

const router =require('express').Router();
router.route('/signup').post(signup)

module.exports = router;
