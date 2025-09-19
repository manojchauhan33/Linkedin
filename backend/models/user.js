// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },

//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },

//   password: { 
//     type: String, 
//     required: function () {
//       // password required only if the user did not sign up with Google ok
//       return !this.googleId;
//     }
//   },

//   googleId: { 
//     type: String, 
//     default: null 
//   },

//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },

//   verificationToken: { 
//     type: String 
//   },

//   tokenExpires: { 
//     type: Date 
//   },

//   resetPasswordToken: { 
//     type: String 
//   },

//   resetPasswordExpires: { 
//     type: Date 
//   },

//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user"
//   }
// });

// export default mongoose.model("User", userSchema);



import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // keep only email as unique
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true, // null if google login
  },

  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  verificationToken: {
    type: DataTypes.STRING, 
  },

  tokenExpires: {
    type: DataTypes.DATE,
  },

  resetPasswordToken: {
    type: DataTypes.STRING, 
  },

  resetPasswordExpires: {
    type: DataTypes.DATE,
  },

  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
});



export default User;
