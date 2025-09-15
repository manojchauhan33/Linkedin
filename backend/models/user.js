// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
// },

//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
// },

//   password: { 
//     type: String, 
//     required: true 
// },

//   isVerified: { 
//     type: Boolean, 
//     default: false 
// },

//   verificationToken: { 
//     type: String 
// },

//   tokenExpires: { 
//     type: Date 
// },

// resetPasswordToken: { 
//   type: String 
// },
// resetPasswordExpires: { 
//   type: Date 
// },

// role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user"
//   }

// });



// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: function () {
      // password required only if the user did not sign up with Google ok
      return !this.googleId;
    }
  },

  googleId: { 
    type: String, 
    default: null 
  },

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  verificationToken: { 
    type: String 
  },

  tokenExpires: { 
    type: Date 
  },

  resetPasswordToken: { 
    type: String 
  },

  resetPasswordExpires: { 
    type: Date 
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

export default mongoose.model("User", userSchema);
