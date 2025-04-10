const { createProject } = require('../controller/projectController');

const router = require('express').Router();

router.route('/').post(createProject);
module.exports=router;