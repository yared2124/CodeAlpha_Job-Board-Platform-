// Manages job CRUD operations, search/filter logic, and employer-specific queries.
import { Job, Employer, User, Application } from "../models/index.js";
import { Op } from "sequelize";

// Create a new job listing.
export const createJob = async (employerId, jobData) => {
  // Verify employer exists
  const employer = await Employer.findByPk(employerId);
  if (!employer) throw new Error("Employer profile not found.");

  const job = await Job.create({ ...jobData, employer_id: employerId });
  return job;
};

// Advanced search with filters and pagination.
export const searchJobs = async (filters) => {
  const {
    keyword,
    location,
    jobType,
    minSalary,
    maxSalary,
    postedAfter,
    page = 1,
    limit = 20,
  } = filters;

  const where = { is_active: true };
  const Op = require("sequelize").Op;

  // Text search across title, description, and requirements
  if (keyword) {
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } },
      { requirements: { [Op.like]: `%${keyword}%` } },
    ];
  }
  if (location) where.location = { [Op.like]: `%${location}%` };
  if (jobType) where.job_type = jobType;
  if (minSalary) where.salary_min = { [Op.gte]: parseFloat(minSalary) };
  if (maxSalary) where.salary_max = { [Op.lte]: parseFloat(maxSalary) };
  if (postedAfter) where.posted_date = { [Op.gte]: new Date(postedAfter) };

  const { count, rows } = await Job.findAndCountAll({
    where,
    include: [
      {
        model: Employer,
        include: [{ model: User, attributes: { exclude: ["password_hash"] } }],
      },
    ],
    order: [["posted_date", "DESC"]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  return { total: count, page, limit, jobs: rows };
};

// Get job details by ID (includes employer info).
export const getJobById = async (jobId) => {
  const job = await Job.findByPk(jobId, {
    include: [{ model: Employer, include: [User] }],
  });
  if (!job) throw new Error("Job not found.");
  return job;
};

// Update an existing job (only owner).
export const updateJob = async (jobId, employerId, updateData) => {
  const job = await Job.findOne({
    where: { id: jobId, employer_id: employerId },
  });
  if (!job) throw new Error("Job not found or you do not own it.");
  await job.update(updateData);
  return job;
};

// Soft delete a job (set is_active = false).
export const deleteJob = async (jobId, employerId) => {
  const job = await Job.findOne({
    where: { id: jobId, employer_id: employerId },
  });
  if (!job) throw new Error("Job not found or you do not own it.");
  job.is_active = false;
  await job.save();
  return { message: "Job deactivated successfully." };
};

// Get all jobs posted by a specific employer.
export const getEmployerJobs = async (employerId) => {
  return await Job.findAll({
    where: { employer_id: employerId },
    order: [["posted_date", "DESC"]],
  });
};
