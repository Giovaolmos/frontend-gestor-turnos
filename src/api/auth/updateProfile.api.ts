import apiClient from "../client";
import type { User, ApiResponse } from "@/types";

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(
    "/auth/profile",
    data,
  );
  return response.data.data;
};
