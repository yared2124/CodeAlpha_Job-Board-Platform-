// HTTP handlers for employer-specific actions (managing applications).
import * as applicationService from "../services/applicationService.js";

export const getJobApplications = async (req, res, next) => {
  try {
    const apps = await applicationService.getApplicationsForJob(
      req.user.id,
      req.params.jobId,
    );
    res.json({ success: true, applications: apps });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const app = await applicationService.updateApplicationStatus(
      req.user.id,
      id,
      status,
      notes,
    );
    res.json({ success: true, application: app });
  } catch (error) {
    next(error);
  }
};

export const getEmployerNotifications = async (req, res, next) => {
  try {
    const { Notification } = await import("../models/index.js");
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { Notification } = await import("../models/index.js");
    const notif = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!notif) throw new Error("Notification not found.");
    notif.is_read = true;
    await notif.save();
    res.json({ success: true, notification: notif });
  } catch (error) {
    next(error);
  }
};
