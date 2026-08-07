// Admin-only operations: user management, platform statistics, and reporting.
import {
  User,
  Employer,
  Candidate,
  Job,
  Application,
  sequelize,
} from "../models/index.js";
import { Op } from "sequelize";

// Get all users with filters (role, active status, pagination).
export const getUsers = async (filters = {}) => {
  const { role, is_active, page = 1, limit = 20 } = filters;
  const where = {};
  if (role) where.role = role;
  if (is_active !== undefined) where.is_active = is_active === "true";

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ["password_hash"] },
    include: [
      { model: Employer, required: false },
      { model: Candidate, required: false },
    ],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    order: [["created_at", "DESC"]],
  });

  return { total: count, page, limit, users: rows };
};

// Toggle user active status (ban/unban).
export const toggleUserStatus = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");
  user.is_active = !user.is_active;
  await user.save();
  return user;
};

// Hard delete a user (cascade deletes employer/candidate profile).
export const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");
  await user.destroy();
  return { message: "User permanently deleted." };
};

// Get platform-wide statistics for the admin dashboard.
export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalEmployers,
    totalCandidates,
    totalJobs,
    activeJobs,
    totalApplications,
    statusBreakdown,
    dailyApplications,
  ] = await Promise.all([
    User.count(),
    User.count({ where: { role: "employer" } }),
    User.count({ where: { role: "candidate" } }),
    Job.count(),
    Job.count({ where: { is_active: true } }),
    Application.count(),
    Application.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    }),
    Application.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("applied_date")), "date"],
        [sequelize.fn("COUNT", "*"), "count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("applied_date"))],
      order: [[sequelize.fn("DATE", sequelize.col("applied_date")), "DESC"]],
      limit: 30,
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      employers: totalEmployers,
      candidates: totalCandidates,
    },
    jobs: { total: totalJobs, active: activeJobs },
    applications: { total: totalApplications, byStatus: statusBreakdown },
    trends: dailyApplications,
  };
};

// Get all jobs (including inactive) for admin moderation.
export const getAllJobs = async (filters = {}) => {
  const { is_active, page = 1, limit = 20 } = filters;
  const where = {};
  if (is_active !== undefined) where.is_active = is_active === "true";

  const { count, rows } = await Job.findAndCountAll({
    where,
    include: [{ model: Employer, include: [User] }],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    order: [["posted_date", "DESC"]],
  });

  return { total: count, page, limit, jobs: rows };
};

// Admin hard-deletes a job.
export const adminDeleteJob = async (jobId) => {
  const job = await Job.findByPk(jobId);
  if (!job) throw new Error("Job not found.");
  await job.destroy();
  return { message: "Job permanently deleted." };
};
