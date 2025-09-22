import Post from "../models/post.js";
import User from "../models/user.js";
import Profile from "../models/Profile.js";


export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    let media = [];
    let mediaType = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        media.push(`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        mediaType.push(file.mimetype.startsWith("image") ? "image" : "video");
      });
    }

    const post = await Post.create({
      content,
      media: JSON.stringify(media),
      mediaType: JSON.stringify(mediaType),
      userId,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          include: {
            model: Profile,
            attributes: ["profilePicture", "bannerImage"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "name", "email"],
        include: {
          model: Profile,
          attributes: ["profilePicture", "bannerImage"],
          required: true,
        },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// // Update a post
// export const updatePost = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });
//     if (post.userId !== req.user.userId) return res.status(403).json({ success: false, message: "Unauthorized" });

//     const { content, mediaType } = req.body;

//     if (req.file) {
//       post.media = JSON.stringify([`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`]);
//       post.mediaType = JSON.stringify([req.file.mimetype.startsWith("image") ? "image" : "video"]);
//     }

//     post.content = content || post.content;
//     post.mediaType = mediaType || post.mediaType;

//     await post.save();
//     res.json({ success: true, post });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Delete a post
// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });
//     if (post.userId !== req.user.userId) return res.status(403).json({ success: false, message: "Unauthorized" });

//     await post.destroy();
//     res.json({ success: true, message: "Post deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
