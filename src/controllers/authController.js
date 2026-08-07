// HTTP request handlers for authentication endpoints.
import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
