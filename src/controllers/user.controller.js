// controllers/user.controller.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

exports.createAdminAccount = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Check if the admin account already exists
    const existingAdmin = await UserModel.findOne({email});
    if (existingAdmin) {
      return res.status(400).json({message: 'Admin account already exists'});
    }

    // Create a new admin user
    const newAdmin = new UserModel({email, password});
    await newAdmin.save();

    res.status(201).json({message: 'Admin account created successfully'});
  } catch (error) {
    console.error('Error during admin account creation:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Check if the user with the provided email exists
    const user = await UserModel.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Setting cookie...', token);
    res.cookie('authToken', token, { maxAge: 900000, secure: true, sameSite: 'None' });
    res.status(200).json({message: 'Admin login successful', token });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie('authToken');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};