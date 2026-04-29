import apiClient from "../client";

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  password: string,
): Promise<void> => {
  await apiClient.post("/auth/reset-password", { token, password });
};
