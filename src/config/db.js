// Sequelize configuration for MySQL.
import { Sequelize } from "sequelize";
import "dotenv/config";

// Create a single Sequelize instance to be shared across all models.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Set to console.log to see raw SQL queries
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }, // Connection pool settings
  },
);

export default sequelize;
