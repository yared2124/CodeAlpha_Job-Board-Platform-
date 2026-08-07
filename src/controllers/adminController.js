// HTTP handlers for admin panel operations.
import * as adminService from "../services/adminService.js";

export const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const result = await adminService.getAllJobs(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteJob = async (req, res, next) => {
  try {
    const result = await adminService.adminDeleteJob(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
