// Job Listing: Created by an Employer.
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Job = sequelize.define(
  "Job",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employer_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    requirements: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING(255) },
    job_type: {
      type: DataTypes.ENUM(
        "full-time",
        "part-time",
        "contract",
        "internship",
        "remote",
      ),
      defaultValue: "full-time",
    },
    salary_min: { type: DataTypes.DECIMAL(10, 2) },
    salary_max: { type: DataTypes.DECIMAL(10, 2) },
    currency: { type: DataTypes.STRING(3), defaultValue: "USD" },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    expiry_date: { type: DataTypes.DATE }, // Jobs expire after this date
  },
  {
    timestamps: true,
    createdAt: "posted_date", // Maps 'posted_date' to createdAt
    updatedAt: "updated_at",
  },
);

export default Job;
