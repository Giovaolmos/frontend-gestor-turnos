import { useState, useCallback } from "react";
import type {
  Appointment,
  CreateAppointmentData,
  AvailableSlot,
  ApiError,
  AppointmentStatus,
} from "@/types";
import { appointmentsApi } from "@/api";

interface UseAppointmentsReturn {
  appointments: Appointment[];
  availableSlots: AvailableSlot[];
  isLoading: boolean;
  error: ApiError | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  fetchClientAppointments: (params?: {
    page?: number;
    status?: AppointmentStatus;
  }) => Promise<void>;
  fetchOwnerAppointments: (params?: {
    page?: number;
    status?: AppointmentStatus;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  fetchWeeklyAppointments: (startDate: string) => Promise<void>;
  fetchAvailableSlots: (
    ownerId: string,
    serviceId: string,
    date: string,
  ) => Promise<void>;
  createAppointment: (
    ownerId: string,
    data: CreateAppointmentData,
  ) => Promise<Appointment>;
  cancelAppointment: (id: string, reason?: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
}

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchClientAppointments = useCallback(
    async (params?: { page?: number; status?: AppointmentStatus }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await appointmentsApi.getClientAppointments(params);
        setAppointments(response.data);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchOwnerAppointments = useCallback(
    async (params?: {
      page?: number;
      status?: AppointmentStatus;
      startDate?: string;
      endDate?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await appointmentsApi.getOwnerAppointments(params);
        setAppointments(response.data);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchWeeklyAppointments = useCallback(async (startDate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.getWeeklyAppointments(startDate);
      setAppointments(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableSlots = useCallback(
    async (ownerId: string, serviceId: string, date: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const slots = await appointmentsApi.getAvailableSlots(
          ownerId,
          serviceId,
          date,
        );
        setAvailableSlots(slots);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createAppointment = useCallback(
    async (ownerId: string, data: CreateAppointmentData) => {
      const newAppointment = await appointmentsApi.create(ownerId, data);
      setAppointments((prev) => [newAppointment, ...prev]);
      return newAppointment;
    },
    [],
  );

  const cancelAppointment = useCallback(async (id: string, reason?: string) => {
    const updated = await appointmentsApi.cancel(id, reason);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const confirmAppointment = useCallback(async (id: string) => {
    const updated = await appointmentsApi.confirm(id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const completeAppointment = useCallback(async (id: string) => {
    const updated = await appointmentsApi.complete(id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  return {
    appointments,
    availableSlots,
    isLoading,
    error,
    pagination,
    fetchClientAppointments,
    fetchOwnerAppointments,
    fetchWeeklyAppointments,
    fetchAvailableSlots,
    createAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
  };
}
