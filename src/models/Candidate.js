// Candidate profile: Extends User (1-to-1 via 'id').
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Candidate = sequelize.define(
  "Candidate",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true }, // References User.id
    date_of_birth: { type: DataTypes.DATEONLY },
    current_location: { type: DataTypes.STRING(255) },
    skills: { type: DataTypes.TEXT },
    linkedin_url: { type: DataTypes.STRING(255) },
    experience_years: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: false,
  },
);

export default Candidate;
