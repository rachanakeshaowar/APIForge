const express =require('express');
const app= express;
app.length('/',(req,res)=>{
  res.status(200).json({
    status: 'success',
    message:'heyy REST APIs are working',

  });
});
app.listen(3000,()=>{
  console.log('Sever upa and running ');
});