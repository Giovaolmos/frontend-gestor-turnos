import { useState, useCallback } from "react";
import type {
  Service,
  CreateServiceData,
  UpdateServiceData,
  ApiError,
} from "@/types";
import { servicesApi } from "@/api";

interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: ApiError | null;
  fetchServices: (ownerId?: string) => Promise<void>;
  fetchOwnerServices: () => Promise<void>;
  createService: (data: CreateServiceData) => Promise<Service>;
  updateService: (id: string, data: UpdateServiceData) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceActive: (id: string) => Promise<Service>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchServices = useCallback(async (ownerId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getAll(ownerId);
      setServices(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOwnerServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getOwnerServices();
      setServices(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createService = useCallback(async (data: CreateServiceData) => {
    const newService = await servicesApi.create(data);
    setServices((prev) => [...prev, newService]);
    return newService;
  }, []);

  const updateService = useCallback(
    async (id: string, data: UpdateServiceData) => {
      const updatedService = await servicesApi.update(id, data);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? updatedService : s)),
      );
      return updatedService;
    },
    [],
  );

  const deleteService = useCallback(async (id: string) => {
    await servicesApi.delete(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleServiceActive = useCallback(async (id: string) => {
    const updatedService = await servicesApi.toggleActive(id);
    setServices((prev) => prev.map((s) => (s.id === id ? updatedService : s)));
    return updatedService;
  }, []);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    fetchOwnerServices,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
  };
}
