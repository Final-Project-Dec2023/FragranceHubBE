
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { cloudinary } from "../helpers/cloudinary.config.js";
import { hashPassword } from "../helpers/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({ success: true, message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch users", errorMsg: err });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({_id: userId});

    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }

    res.json({ success: true, message: "User fetched successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve user", errorMsg: err.message });
  }
};

export const updateUser = async (req, res) => {
    try {
      const { _id } = req.user; 
      const { name, password, street, city, state, zip } = req.body; 
      const imageFile = req.file; 

      console.log(_id);
  
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User Not Found" });
      }
  
      const updateUserData = {
        name: name || user.name,
        address: {
          street: street || user.address.street,
          city: city || user.address.city,
          state: state || user.address.state,
          zip: zip || user.address.zip
        }
      };
  
      if (imageFile) {
        // Delete image from cloudinary
        if (user.image && user.imagePublicId) {
          await cloudinary.uploader.destroy(user.imagePublicId);
        }
        // upload new image to cloudinaryu
        const imageResult = await cloudinary.uploader.upload(imageFile.path);
        updateUserData.image = imageResult.secure_url;
        updateUserData.imagePublicId = imageResult.public_id;
      }
  
      // Update user data
      const updatedUser = await User.findByIdAndUpdate(_id, updateUserData, {
        new: true,
      }).select("-password");
  
      return res.json({
        success: true,
        message: "User Profile updated successfully",
        updatedUser,
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ success: false, message: "Failed to update user profile", error: err });
    }
  };
  
  export const updateUserRole = async (req, res) => {
    try {
      const { _id } = req.user;
      const { role } = req.body;
  
      console.log("Role is: ", role);

      const updateQuery = {
        role: role,
        isAdmin: role === 1 ? true : false,
      };
  
      const updatedUser = await User.findByIdAndUpdate(_id, updateQuery, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      updatedUser.password = undefined;
      res.json({ message: "User role updated successfully", user: updatedUser });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Failed to update user role", errorMsg: err.message });
    }
  };
  