import apiClient from "../client";
import type { User, ApiResponse } from "@/types";

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>("/auth/profile");
  return response.data.data;
};
