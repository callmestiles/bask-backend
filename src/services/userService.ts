import User, { AccountType } from "../models/user";

interface CreateUserDTO {
  email: string;
  password?: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified?: boolean;
}

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  return await User.create(userData);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
};

export const findUserByGoogleId = async (
  googleId: string
): Promise<User | null> => {
  return await User.findOne({ where: { googleId } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await User.findOne({ where: { email } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await User.findByPk(id, { attributes: { exclude: ["password"] } });
};

export const getUserByGoogleId = async (
  googleId: string
): Promise<User | null> => {
  return await User.findOne({ where: { googleId } });
};

export const creatGoogleUser = async (data: {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isEmailVerified: boolean;
}): Promise<User> => {
  // Default accountType to "Fan" for Google users
  return await User.create({ ...data, accountType: "Fan" });
};

export const updateUser = async (
  id: string,
  updateData: Partial<CreateUserDTO>
): Promise<User | null> => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.update(updateData);
  return user;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const user = await User.findByPk(id);
  if (!user) return false;

  await user.destroy();
  return true;
};

export const getAllUsers = async (
  limit: number = 20,
  offset: number = 0
): Promise<{ users: User[]; total: number }> => {
  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { users: rows, total: count };
};
