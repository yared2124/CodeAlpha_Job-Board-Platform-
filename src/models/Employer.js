// Employer profile: Extends User (1-to-1 via 'id').
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Employer = sequelize.define(
  "Employer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true }, // References User.id
    company_name: { type: DataTypes.STRING(255), allowNull: false },
    company_description: { type: DataTypes.TEXT },
    company_website: { type: DataTypes.STRING(255) },
    industry: { type: DataTypes.STRING(100) },
    headquarters: { type: DataTypes.STRING(255) },
  },
  {
    timestamps: false, // No extra timestamps needed; inherited from User
  },
);

export default Employer;
