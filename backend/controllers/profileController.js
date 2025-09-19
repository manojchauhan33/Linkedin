import Profile from "../models/profile.js";
import User from "../models/user.js";


export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    let profileData = { ...req.body };

    
    if (profileData.experience && typeof profileData.experience === "string") {
      profileData.experience = JSON.parse(profileData.experience);
    }
    if (profileData.education && typeof profileData.education === "string") {
      profileData.education = JSON.parse(profileData.education);
    }
    if (profileData.skills && typeof profileData.skills === "string") {
      profileData.skills = JSON.parse(profileData.skills);
    }
    if (profileData.socialLinks && typeof profileData.socialLinks === "string") {
      profileData.socialLinks = JSON.parse(profileData.socialLinks);
    }

    if (req.files?.profilePicture) {
      profileData.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }
    if (req.files?.bannerImage) {
      profileData.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    }

    let profile = await Profile.findOne({ where: { userId } });

    console.log(profile);

    if (profile) {
      await profile.update(profileData);
    } else {
      profile = await Profile.create({ ...profileData, userId });
    }

    res.json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.error("Error in upsertProfile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



// export const getMyProfile = async (req, res) => {
//   try {
//     const profile = await Profile.findOne({
//       where: { userId: req.user.userId },
//       include: [{ model: User, attributes: ["name", "email"] }],
//     });

//     if (!profile) {
//       const user = await User.findByPk(req.user.userId, {
//         attributes: ["name", "email"],
//       });

//       return res.json({
//         user: user || null,
//         profilePicture: "", 
//       });
//     }

//     res.json(profile);
//   } catch (error) {
//     console.error("Error in getMyProfile:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// };


export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.userId },
      include: [{ model: User, attributes: ["name", "email"] }],
    });

    if (!profile) {
      const user = await User.findByPk(req.user.userId, {
        attributes: ["name", "email"],
      });

      return res.json({
        user: user || null,
        profile: {}, // always return an object instead of null
        profilePicture: "",
      });
    }

    res.json({
      user: profile.User,
      profile: profile, // always under profile
      profilePicture: profile.profilePicture || "",
    });
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
