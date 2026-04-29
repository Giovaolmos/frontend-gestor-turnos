import { format, parseISO, isToday, isTomorrow, isPast, addMinutes } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Date utility functions
 */

/**
 * Format a date string to a localized format
 */
export function formatDate(date: string | Date, formatStr: string = "d 'de' MMMM, yyyy"): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

/**
 * Format a date to a relative description (Hoy, Mañana, or the date)
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return 'Hoy'
  }
  
  if (isTomorrow(dateObj)) {
    return 'Mañana'
  }
  
  return format(dateObj, "EEEE d 'de' MMMM", { locale: es })
}

/**
 * Check if a date is in the past
 */
export function isDatePast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isPast(dateObj)
}

/**
 * Get the end time given a start time and duration
 */
export function getEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)
  const endDate = addMinutes(startDate, durationMinutes)
  return format(endDate, 'HH:mm')
}

/**
 * Generate time slots for a given range
 */
export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 20,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      slots.push(time)
    }
  }
  
  return slots
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Check if a time slot is within working hours
 */
export function isWithinWorkingHours(
  time: string,
  slots: { start: string; end: string }[]
): boolean {
  const timeMinutes = timeToMinutes(time)
  
  return slots.some((slot) => {
    const startMinutes = timeToMinutes(slot.start)
    const endMinutes = timeToMinutes(slot.end)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
  })
}
