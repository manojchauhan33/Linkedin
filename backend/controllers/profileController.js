import Profile from "../models/profile.js";
import User from "../models/user.js"; 

export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 

    const profileDataToUpdate = { ...req.body };

    
    if (profileDataToUpdate.education) {
      profileDataToUpdate.education = JSON.parse(profileDataToUpdate.education);
    }
    if (profileDataToUpdate.experience) {
      profileDataToUpdate.experience = JSON.parse(profileDataToUpdate.experience);
    }
    if (profileDataToUpdate.skills) {
      profileDataToUpdate.skills = JSON.parse(profileDataToUpdate.skills);
    }
    if (profileDataToUpdate.socialLinks) {
      profileDataToUpdate.socialLinks = JSON.parse(profileDataToUpdate.socialLinks);
    }

    
    if (req.files?.profilePicture) {
      profileDataToUpdate.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }
    if (req.files?.bannerImage) {
      profileDataToUpdate.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    }

    
    delete profileDataToUpdate.user;

    console.log("Data being set in $set:", JSON.stringify(profileDataToUpdate, null, 2));
    console.log("Extracted userId:", userId);

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: profileDataToUpdate },
        { new: true, runValidators: true }
      );
      if (!profile) {
        return res.status(404).json({ msg: "Profile not found after initial check, could not update." });
      }
    } else {
      profile = new Profile({
        user: userId,
        ...profileDataToUpdate,
      });
      await profile.save();
    }

    res.json(profile);

  } catch (error) {
    console.error("Error in upsertProfile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId })
      .populate("user", ["email"]); 

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};