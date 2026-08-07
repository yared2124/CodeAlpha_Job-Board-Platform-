// Centralizes model definitions and sets up associations.
import sequelize from "../config/db.js";
import User from "./User.js";
import Employer from "./Employer.js";
import Candidate from "./Candidate.js";
import Job from "./Job.js";
import Resume from "./Resume.js";
import Application from "./Application.js";
import Notification from "./Notification.js";

// 1. Define associations (Class Table Inheritance pattern)
User.hasOne(Employer, { foreignKey: "id", onDelete: "CASCADE" });
Employer.belongsTo(User, { foreignKey: "id" });

User.hasOne(Candidate, { foreignKey: "id", onDelete: "CASCADE" });
Candidate.belongsTo(User, { foreignKey: "id" });

// 2. Employer -> Jobs (One-to-Many)
Employer.hasMany(Job, { foreignKey: "employer_id", onDelete: "CASCADE" });
Job.belongsTo(Employer, { foreignKey: "employer_id" });

// 3. Candidate -> Resumes (One-to-Many)
Candidate.hasMany(Resume, { foreignKey: "candidate_id", onDelete: "CASCADE" });
Resume.belongsTo(Candidate, { foreignKey: "candidate_id" });

// 4. Job -> Applications (One-to-Many)
Job.hasMany(Application, { foreignKey: "job_id", onDelete: "CASCADE" });
Application.belongsTo(Job, { foreignKey: "job_id" });

// 5. Candidate -> Applications (One-to-Many)
Candidate.hasMany(Application, {
  foreignKey: "candidate_id",
  onDelete: "CASCADE",
});
Application.belongsTo(Candidate, { foreignKey: "candidate_id" });

// 6. Resume -> Application (One-to-Many) - tracks which resume was used
Resume.hasMany(Application, { foreignKey: "resume_id" });
Application.belongsTo(Resume, { foreignKey: "resume_id" });

// 7. User -> Notifications (One-to-Many)
User.hasMany(Notification, { foreignKey: "user_id", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "user_id" });

// Export all models for use in controllers/services.
export {
  sequelize,
  User,
  Employer,
  Candidate,
  Job,
  Resume,
  Application,
  Notification,
};
