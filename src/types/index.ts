// ==================== USER TYPES ====================
export type UserRole = 'client' | 'owner'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  phone?: string
  role: UserRole
}

// ==================== SERVICE TYPES ====================
export interface Service {
  id: string
  ownerId: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  isActive: boolean
  createdAt: string
}

export interface CreateServiceData {
  name: string
  description: string
  duration: number
  price: number
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  isActive?: boolean
}

// ==================== SCHEDULE TYPES ====================
export interface TimeSlot {
  start: string // HH:mm format
  end: string   // HH:mm format
}

export interface DaySchedule {
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean
  slots: TimeSlot[]
}

export interface Schedule {
  id: string
  ownerId: string
  schedule: DaySchedule[]
}

// ==================== APPOINTMENT TYPES ====================
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  clientId: string
  ownerId: string
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: AppointmentStatus
  notes?: string
  createdAt: string
  // Populated fields
  client?: User
  service?: Service
}

export interface CreateAppointmentData {
  serviceId: string
  date: string
  time: string
  notes?: string
}

export interface AvailableSlot {
  date: string
  time: string
  available: boolean
}

// ==================== EARNINGS TYPES ====================
export interface EarningsSummary {
  daily: number
  weekly: number
  monthly: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
}

export interface EarningsDetail {
  date: string
  appointments: Appointment[]
  total: number
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
