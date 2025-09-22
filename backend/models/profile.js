import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.js";

const Profile = sequelize.define("Profile", {
  headline: { 
    type: DataTypes.STRING, 
    defaultValue: "" 
  },
  bio: { 
    type: DataTypes.TEXT, 
    defaultValue: "" 
  },
  location: { 
    type: DataTypes.STRING, 
    defaultValue: "" 
  },
  profilePicture: { 
    type: DataTypes.STRING, 
    defaultValue: "" 
  },
  bannerImage: { 
    type: DataTypes.STRING, 
    defaultValue: "" 
  },

  
  experience: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  }, 
  education: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  }, 
  skills: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  },     
  socialLinks: { 
    type: DataTypes.JSON, 
    defaultValue: {} 
  } 
});


User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

export default Profile;


// Profile → user ke personal info ke liye 1:1 relation
// Post → user ke posts ke liye 1:N relation
// belongsTo → child model me foreign key hota hai, aur parent info fetch kar sakte ho
// hasOne / hasMany → parent model se child fetch kar sakte ho