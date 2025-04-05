const{Sequelize} =require('sequelize');
const env=process.env.NODE_ENV||'development';
const config=require('./config');
// const sequelize=new Sequelize(config[env]);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // <-- THIS is the key
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5433,
  }
);
module.exports=sequelize;