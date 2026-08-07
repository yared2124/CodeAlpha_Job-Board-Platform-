// HTTP handlers for candidate-specific actions (resumes, applications).
import * as applicationService from "../services/applicationService.js";
import * as resumeService from "../services/resumeService.js"; // We'll add this below.

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("No file uploaded.");
    const resume = await resumeService.uploadResume(req.user.id, req.file);
    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await resumeService.getResumesByCandidate(req.user.id);
    res.json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const result = await resumeService.deleteResume(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { resumeId, coverLetter } = req.body;
    const app = await applicationService.applyToJob(
      req.user.id,
      jobId,
      resumeId,
      coverLetter,
    );
    res.status(201).json({ success: true, application: app });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const apps = await applicationService.getMyApplications(req.user.id);
    res.json({ success: true, applications: apps });
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const app = await applicationService.withdrawApplication(
      req.user.id,
      req.params.id,
    );
    res.json({ success: true, application: app });
  } catch (error) {
    next(error);
  }
};
