// Handles in-app notifications and email sending (if configured).
import { Notification } from "../models/index.js";
import nodemailer from "nodemailer";
import "dotenv/config";

// Create an in-app notification.
export const createInAppNotification = async (
  userId,
  title,
  message,
  type,
  entityType,
  entityId,
) => {
  return await Notification.create({
    user_id: userId,
    type: type || "application_status",
    title,
    message,
    related_entity_type: entityType,
    related_entity_id: entityId,
  });
};

// Send notification to candidate when application status changes.
export const sendApplicationStatusNotification = async (
  candidateId,
  jobTitle,
  oldStatus,
  newStatus,
  appId,
) => {
  const message = `Your application for "${jobTitle}" has been updated from ${oldStatus} to ${newStatus}.`;
  return await createInAppNotification(
    candidateId,
    "Application Status Update",
    message,
    "application_status",
    "application",
    appId,
  );
};

// (Optional) Configure Nodemailer for email alerts.
// export const sendEmail = async (to, subject, html) => { ... };
