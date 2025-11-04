import sequelize from "../config/database";
import User from "./user";

const models = {
  User,
};

export { sequelize, User };
export default models;
