/**
 * API Layer - Centralized exports for all API modules
 *
 * This is where all API calls should be imported from.
 * Keeps the API logic separate from components.
 *
 * Usage:
 * import { authApi, servicesApi, appointmentsApi } from '@/api'
 */

export { default as apiClient } from "./client";
export * from "./auth";
export { servicesApi } from "./services.api";
export { appointmentsApi } from "./appointments.api";
export { scheduleApi } from "./schedule.api";
export { earningsApi } from "./earnings.api";
export { professionalsApi } from "./professionals.api";
