import bcrypt from "bcryptjs";
import { env } from "@/env";

export const hashPassword = async (password: string) => {
  password = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  return password;
};
