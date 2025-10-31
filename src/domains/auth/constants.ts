export const ROLE_NAMES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;
export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

// TODO: implement permissions mapping
// export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
//   user: [],
//   moderator: [],
//   admin: []
// };
