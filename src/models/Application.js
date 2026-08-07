// Job Application: Links Candidate, Job, and Resume.
// Includes a state machine for status transitions.
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Application = sequelize.define(
  "Application",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    job_id: { type: DataTypes.INTEGER, allowNull: false },
    candidate_id: { type: DataTypes.INTEGER, allowNull: false },
    resume_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "reviewed",
        "shortlisted",
        "interviewed",
        "offered",
        "hired",
        "rejected",
        "withdrawn",
      ),
      defaultValue: "pending",
    },
    cover_letter: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT }, // Internal notes for employers
  },
  {
    timestamps: true,
    createdAt: "applied_date",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["job_id", "candidate_id"] }, // Prevents duplicate applications
    ],
  },
);

export default Application;
