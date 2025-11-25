import dotenv from "dotenv";
import { User } from "../src/models";
import sequelize from "../src/config/database";

dotenv.config();

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@bask.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log(`Admin user ${adminEmail} already exists.`);
      if (existingAdmin.accountType !== "Admin") {
        console.log("Updating account type to Admin...");
        existingAdmin.accountType = "Admin";
        await existingAdmin.save();
        console.log("Account type updated.");
      }
    } else {
      console.log(`Creating admin user ${adminEmail}...`);
      await User.create({
        email: adminEmail,
        password: adminPassword,
        accountType: "Admin",
        firstName: "Admin",
        lastName: "User",
        isEmailVerified: true,
      });
      console.log("Admin user created successfully.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
