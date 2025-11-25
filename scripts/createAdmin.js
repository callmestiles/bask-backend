"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../src/models");
const database_1 = __importDefault(require("../src/config/database"));
dotenv_1.default.config();
const createAdmin = async () => {
    try {
        await database_1.default.authenticate();
        console.log("Connected to database.");
        const adminEmail = process.env.ADMIN_EMAIL || "admin@bask.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
        const existingAdmin = await models_1.User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log(`Admin user ${adminEmail} already exists.`);
            if (existingAdmin.accountType !== "Admin") {
                console.log("Updating account type to Admin...");
                existingAdmin.accountType = "Admin";
                await existingAdmin.save();
                console.log("Account type updated.");
            }
        }
        else {
            console.log(`Creating admin user ${adminEmail}...`);
            await models_1.User.create({
                email: adminEmail,
                password: adminPassword,
                accountType: "Admin",
                firstName: "Admin",
                lastName: "User",
                isEmailVerified: true,
            });
            console.log("Admin user created successfully.");
        }
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
    finally {
        await database_1.default.close();
    }
};
createAdmin();
