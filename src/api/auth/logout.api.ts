import apiClient from "../client";

/**
 * Logout user (invalidate token on server)
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
