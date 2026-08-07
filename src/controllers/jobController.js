// HTTP handlers for job listing operations.
import * as jobService from "../services/jobService.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.user.id, req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const searchJobs = async (req, res, next) => {
  try {
    const result = await jobService.searchJobs(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const result = await jobService.deleteJob(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getEmployerJobs(req.user.id);
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};
