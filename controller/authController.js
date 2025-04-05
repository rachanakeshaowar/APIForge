const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🔐 Token Generator
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 📝 Signup Function
const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!['1', '2'].includes(body.userType)) {
    throw new AppError('Invalid user Type',400);
    return res.status(400).json({
      status: 'fail',
      message: '',
    });
  }

  if (body.password !== body.confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Passwords do not match',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 12);

    const newUser = await user.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashedPassword,
    });

    if(!newUser){
      return next(new AppError('Failed to create the user',400));
      
    }
    const result = newUser.toJSON();
  
    delete result.password;
    delete result.deleteAt;

    result.token = generateToken({ 
      id: result.id });

    return res.status(201).json({
      status: 'success',
      data: result,
    });

  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
});

// 🔐 Login Function (Now outside the signup)
const login = catchAsync (async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next (new AppError('Please provide email and password',400)); 
  }
  const result = await user.findOne({where:{email}});
  if(!result || !(await bcrypt.compare(password,result.password))){
    return next(new AppError('Incorrect email or password',401));
  }

  try {
    const foundUser = await user.findOne({ where: { email } });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    const token = generateToken({ id: foundUser.id });

    return res.status(200).json({
      status: 'success',
      token,
    });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    });
  }
});

module.exports = { signup, login };
