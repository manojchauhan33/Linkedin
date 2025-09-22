import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.js";

const Post = sequelize.define("Post", {
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  media: {
    type: DataTypes.STRING, 
    allowNull: true,
  },

  mediaType: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});


Post.belongsTo(User, { foreignKey: "userId" });

export default Post;
