// In-app notification system for both candidates and employers.
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM("application_status", "new_job", "admin_alert"),
      defaultValue: "application_status",
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    related_entity_type: { type: DataTypes.STRING(50) }, // e.g., 'application', 'job'
    related_entity_id: { type: DataTypes.INTEGER },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Notification;
