import bcrypt from "bcryptjs";
import { env } from "@/env";

const hashPassword = async (password: string) => {
  password = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  return password;
};

const verifyPassword = async (inputPassword: string, dbPasswordHash: string) => {
  return bcrypt.compare(inputPassword, dbPasswordHash);
};

export { hashPassword, verifyPassword };
