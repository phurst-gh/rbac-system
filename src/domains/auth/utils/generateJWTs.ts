import { signAccessToken, signRefreshToken } from "../lib";

export const generateJWTs = (id: string, email: string, role?: string) => {
  // Security best practice: Minimal payload in refresh token (only user ID)
  const refreshToken = signRefreshToken({ sub: id });
  // Access token contains authorization data
  const accessToken = signAccessToken({
    sub: id,
    email: email,
    role: role,
  });

  return { accessToken, refreshToken };
};
