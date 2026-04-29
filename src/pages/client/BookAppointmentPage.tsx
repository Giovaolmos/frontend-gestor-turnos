import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useServices, useAppointments } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { Clock, Check, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Service, ApiError } from '@/types'
import { cn } from '@/lib/utils'

// Mock owner ID - in real app this would come from selecting a business
const MOCK_OWNER_ID = 'owner-1'

export default function BookAppointmentPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { services, fetchServices, isLoading: servicesLoading } = useServices()
  const { availableSlots, fetchAvailableSlots, createAppointment, isLoading: slotsLoading } = useAppointments()

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Set initial service from URL param
  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        setSelectedService(service)
      }
    }
  }, [serviceId, services])

  // Fetch available slots when date and service are selected
  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots(
        MOCK_OWNER_ID,
        selectedService.id,
        format(selectedDate, 'yyyy-MM-dd')
      )
    }
  }, [selectedService, selectedDate, fetchAvailableSlots])

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    setSelectedService(service || null)
    setSelectedTime(null) // Reset time when service changes
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time when date changes
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await createAppointment(MOCK_OWNER_ID, {
        serviceId: selectedService.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        notes: notes || undefined,
      })

      toast({
        title: '¡Turno reservado!',
        description: 'Tu turno ha sido reservado exitosamente.',
      })

      navigate('/client/appointments')
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al reservar el turno')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableTimes = availableSlots.filter((slot) => slot.available)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Reservar turno</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Selecciona el servicio, fecha y horario para tu turno
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Left Column - Selection */}
        <div className="space-y-4 sm:space-y-6">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Selecciona el servicio</CardTitle>
              <CardDescription>Elige el servicio que deseas reservar</CardDescription>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex h-20 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Select
                  value={selectedService?.id || ''}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{service.name}</span>
                          <span className="text-muted-foreground">
                            ${service.price} - {service.duration}min
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">2. Selecciona la fecha</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Elige el día para tu turno</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={es}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border p-2 sm:p-3"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Time and Confirmation */}
        <div className="space-y-4 sm:space-y-6">
          {/* Time Selection */}
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">3. Selecciona el horario</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {selectedDate
                  ? `Horarios disponibles para ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
                  : 'Primero selecciona una fecha'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Selecciona una fecha para ver los horarios disponibles
                </p>
              ) : slotsLoading ? (
                <div className="flex h-24 items-center justify-center sm:h-32">
                  <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                </div>
              ) : availableTimes.length === 0 ? (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  No hay horarios disponibles para esta fecha
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
                  {availableTimes.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(slot.time)}
                      className="gap-1 px-2 text-xs sm:px-3 sm:text-sm"
                    >
                      <Clock className="hidden h-3 w-3 sm:block" />
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">4. Notas adicionales</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Opcional: agrega información relevante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs sm:text-sm">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Ej: Tengo alergia a ciertos productos..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary and Confirm */}
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Resumen de tu reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-medium text-right max-w-[60%] truncate">
                    {selectedService?.name || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">
                    {selectedDate
                      ? format(selectedDate, "d 'de' MMM, yyyy", { locale: es })
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">{selectedTime || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span className="font-medium">
                    {selectedService ? `${selectedService.duration} min` : '-'}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Precio:</span>
                  <span className="text-base font-bold sm:text-lg">
                    {selectedService ? `$${selectedService.price.toLocaleString()}` : '-'}
                  </span>
                </div>
              </div>

              <Button
                className={cn('w-full gap-2')}
                onClick={handleSubmit}
                disabled={!selectedService || !selectedDate || !selectedTime || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reservando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirmar reserva
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
