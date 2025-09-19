// import mongoose from "mongoose";


// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log("DB Connected");
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectDB;


import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,   
  process.env.MYSQL_USER, 
  process.env.MYSQL_PASS, 
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);




const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL");
  } catch (error) {
    console.error(" Error connecting DB:", error);
  }
};

export { sequelize, connectDB };
