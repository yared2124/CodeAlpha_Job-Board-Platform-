// Entry point: Bootstraps the database connection and starts the HTTP server.
import "dotenv/config"; // Load environment variables first
import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ MySQL connection established successfully.");

    // Sync models with database (alter: true safely updates schema without dropping data)
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
})();
