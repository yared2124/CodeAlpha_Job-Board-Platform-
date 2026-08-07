// Resume document uploaded by a candidate.
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Resume = sequelize.define(
  "Resume",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    candidate_id: { type: DataTypes.INTEGER, allowNull: false },
    file_path: { type: DataTypes.STRING(500), allowNull: false }, // Local or cloud path
    original_filename: { type: DataTypes.STRING(255) },
    mime_type: { type: DataTypes.STRING(100) },
    file_size: { type: DataTypes.INTEGER },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: false,
  },
);

export default Resume;
