// Core application logic: apply, withdraw, status updates, and state machine.
import { Job, Application, Resume, Notification } from "../models/index.js";
import { sendApplicationStatusNotification } from "./notificationService.js";

// State machine: Defines valid status transitions.
const VALID_TRANSITIONS = {
  pending: ["reviewed", "rejected", "withdrawn"],
  reviewed: ["shortlisted", "rejected", "withdrawn"],
  shortlisted: ["interviewed", "rejected", "withdrawn"],
  interviewed: ["offered", "rejected", "withdrawn"],
  offered: ["hired", "rejected", "withdrawn"],
  hired: [], // Terminal
  rejected: [], // Terminal
  withdrawn: [], // Terminal
};

// Check if a status transition is allowed.
const canTransition = (from, to) => {
  return VALID_TRANSITIONS[from]?.includes(to) || false;
};

// Candidate applies to a job.
export const applyToJob = async (candidateId, jobId, resumeId, coverLetter) => {
  // 1. Validate job exists and is active
  const job = await Job.findOne({ where: { id: jobId, is_active: true } });
  if (!job) throw new Error("Job not found or not active.");

  // 2. Prevent duplicate applications (unique constraint will also catch this)
  const existing = await Application.findOne({
    where: { job_id: jobId, candidate_id: candidateId },
  });
  if (existing) throw new Error("You have already applied to this job.");

  // 3. Verify resume belongs to candidate
  const resume = await Resume.findOne({
    where: { id: resumeId, candidate_id: candidateId },
  });
  if (!resume) throw new Error("Invalid resume selected.");

  // 4. Create the application
  const application = await Application.create({
    job_id: jobId,
    candidate_id: candidateId,
    resume_id: resumeId,
    cover_letter: coverLetter,
    status: "pending",
  });

  // 5. Notify employer (in-app)
  await Notification.create({
    user_id: job.employer_id,
    type: "new_job",
    title: "New Job Application",
    message: `A candidate has applied for "${job.title}"`,
    related_entity_type: "application",
    related_entity_id: application.id,
  });

  // Send email notification to employer (async - we don't await to avoid blocking)
  // emailService.sendNewApplicationEmail(job.employer_id, application.id).catch(console.error);

  return application;
};

// Candidate withdraws an application.
export const withdrawApplication = async (candidateId, applicationId) => {
  const app = await Application.findOne({
    where: { id: applicationId, candidate_id: candidateId },
  });
  if (!app) throw new Error("Application not found.");

  if (!canTransition(app.status, "withdrawn")) {
    throw new Error(`Cannot withdraw from status: ${app.status}`);
  }

  app.status = "withdrawn";
  await app.save();
  return app;
};

// Employer updates application status.
export const updateApplicationStatus = async (
  employerId,
  applicationId,
  newStatus,
  notes,
) => {
  const app = await Application.findByPk(applicationId, {
    include: [{ model: Job, attributes: ["employer_id", "title"] }],
  });
  if (!app) throw new Error("Application not found.");
  if (app.Job.employer_id !== employerId)
    throw new Error("You do not own this job.");

  if (!canTransition(app.status, newStatus)) {
    throw new Error(
      `Invalid status transition from ${app.status} to ${newStatus}.`,
    );
  }

  const oldStatus = app.status;
  app.status = newStatus;
  if (notes) app.notes = notes;
  await app.save();

  // Notify candidate of the status change.
  await sendApplicationStatusNotification(
    app.candidate_id,
    app.Job.title,
    oldStatus,
    newStatus,
    applicationId,
  );

  return app;
};

// Get all applications for a specific job (employer view).
export const getApplicationsForJob = async (employerId, jobId) => {
  // Verify employer owns the job
  const job = await Job.findOne({
    where: { id: jobId, employer_id: employerId },
  });
  if (!job) throw new Error("Job not found or not owned by you.");

  return await Application.findAll({
    where: { job_id: jobId },
    include: [{ model: Candidate, include: [User] }, { model: Resume }],
    order: [["applied_date", "DESC"]],
  });
};

// Get all applications for a specific candidate.
export const getMyApplications = async (candidateId) => {
  return await Application.findAll({
    where: { candidate_id: candidateId },
    include: [{ model: Job, include: [Employer] }],
    order: [["applied_date", "DESC"]],
  });
};
