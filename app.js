require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');
const authRouter = require('./routes/authRoutes'); 
const projectRouter = require('./routes/projectRoute');
const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');



const app = express();
app.use(express.json());

// Root route
console.log('DB_PASSWORD:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);


// All routes
app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/projects', projectRouter); 
app.use('*',catchAsync( async(req,res,next)=>{
throw new AppError('Cannot find ${req.originalUrl} on this server',404);


})
);

app.use(globalErrorHandler);

const PORT=process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log('Server up and running',PORT);
});







