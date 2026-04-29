import apiClient from "../client";

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};
