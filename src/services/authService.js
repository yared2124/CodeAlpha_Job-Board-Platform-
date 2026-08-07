// Handles authentication logic: registration, login, profile management.
import { User, Employer, Candidate } from "../models/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Generates a JWT token for authenticated users.
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

// Register a new user (candidate or employer).
export const registerUser = async (userData) => {
  const { email, password, role, full_name, phone, ...roleSpecificData } =
    userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered.");

  // Start a transaction to ensure both User and role-specific record are created atomically.
  const transaction = await User.sequelize.transaction();
  try {
    // 1. Create base User
    const user = await User.create(
      {
        email,
        password_hash: password, // Hook will hash it
        role,
        full_name,
        phone,
        is_active: true,
      },
      { transaction },
    );

    // 2. Create role-specific profile
    if (role === "employer") {
      await Employer.create(
        {
          id: user.id,
          company_name: roleSpecificData.company_name,
          company_description: roleSpecificData.company_description,
          company_website: roleSpecificData.company_website,
          industry: roleSpecificData.industry,
          headquarters: roleSpecificData.headquarters,
        },
        { transaction },
      );
    } else if (role === "candidate") {
      await Candidate.create(
        {
          id: user.id,
          date_of_birth: roleSpecificData.date_of_birth,
          current_location: roleSpecificData.current_location,
          skills: roleSpecificData.skills,
          linkedin_url: roleSpecificData.linkedin_url,
          experience_years: roleSpecificData.experience_years || 0,
        },
        { transaction },
      );
    }

    await transaction.commit();

    // Generate token for immediate login after registration.
    const token = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      token,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Login existing user.
export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials.");
  if (!user.is_active) throw new Error("Account deactivated. Contact admin.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    token,
  };
};

// Get user profile with role-specific details.
export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
    include: [
      { model: Employer, required: false },
      { model: Candidate, required: false },
    ],
  });
  if (!user) throw new Error("User not found.");
  return user;
};

// Update user profile (generic).
export const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");

  // Prevent role changes
  if (updateData.role) delete updateData.role;

  await user.update(updateData);
  return user;
};
