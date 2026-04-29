import { useEffect, useState } from 'react'
import { useAppointments } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Loader2,
  User,
  List,
  CalendarDays
} from 'lucide-react'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Appointment, AppointmentStatus, ApiError } from '@/types'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

export default function OwnerAppointmentsPage() {
  const { toast } = useToast()
  const { 
    appointments, 
    fetchWeeklyAppointments,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    isLoading 
  } = useAppointments()

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    fetchWeeklyAppointments(format(weekStart, 'yyyy-MM-dd'))
  }, [weekStart, fetchWeeklyAppointments])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getAppointmentsForSlot = (date: Date, hour: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter((a) => {
      const matchesDate = a.date === dateStr && a.time.startsWith(hour.split(':')[0])
      const matchesFilter = filterStatus === 'all' || a.status === filterStatus
      return matchesDate && matchesFilter
    })
  }

  const filteredAppointments = appointments.filter((a) => {
    return filterStatus === 'all' || a.status === filterStatus
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogOpen(true)
  }

  const handleStatusUpdate = async (newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    if (!selectedAppointment) return

    setIsUpdating(true)
    try {
      if (newStatus === 'confirmed') {
        await confirmAppointment(selectedAppointment.id)
      } else if (newStatus === 'completed') {
        await completeAppointment(selectedAppointment.id)
      } else {
        await cancelAppointment(selectedAppointment.id)
      }

      toast({
        title: 'Estado actualizado',
        description: `El turno ha sido marcado como ${statusLabels[newStatus].toLowerCase()}.`,
      })
      setDialogOpen(false)
      fetchWeeklyAppointments(format(weekStart, 'yyyy-MM-dd'))
    } catch (err) {
      const apiError = err as ApiError
      toast({
        title: 'Error',
        description: apiError.message || 'No se pudo actualizar el estado',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Agenda de turnos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vista semanal de todos tus turnos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle - Only show on larger screens for calendar option */}
          <div className="hidden sm:flex items-center rounded-lg border p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-1.5 px-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Lista</span>
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="gap-1.5 px-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="hidden md:inline">Calendario</span>
            </Button>
          </div>

          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as AppointmentStatus | 'all')}
          >
            <SelectTrigger className="w-[130px] sm:w-[150px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center text-sm sm:text-lg">
              <span className="hidden sm:inline">
                {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: es })}
              </span>
              <span className="sm:hidden">
                {format(weekStart, "d MMM", { locale: es })} - {format(addDays(weekStart, 6), "d MMM", { locale: es })}
              </span>
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center sm:h-96">
              <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
            </div>
          ) : viewMode === 'list' || typeof window !== 'undefined' && window.innerWidth < 640 ? (
            /* List View - Default for mobile and option for desktop */
            <div className="space-y-2 sm:space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <Calendar className="mb-2 h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
                  <p className="text-sm text-muted-foreground">No hay turnos para esta semana</p>
                </div>
              ) : (
                filteredAppointments.map((appt) => (
                  <button
                    key={appt.id}
                    onClick={() => handleAppointmentClick(appt)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 sm:p-4',
                      statusColors[appt.status].replace('bg-', 'border-l-4 border-l-').replace(' text-', ' ')
                    )}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm sm:text-base">
                            {appt.client?.name || 'Cliente'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {appt.service?.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{format(new Date(appt.date), "d MMM", { locale: es })}</span>
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{appt.time}</span>
                        </div>
                        <Badge className={cn('text-xs', statusColors[appt.status])}>
                          {statusLabels[appt.status]}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Calendar View - Only for desktop */
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header - Days of week */}
                <div className="grid grid-cols-8 gap-1 border-b pb-2">
                  <div className="w-20" />
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'text-center',
                        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
                          'rounded-lg bg-primary/10'
                      )}
                    >
                      <p className="text-xs text-muted-foreground">
                        {format(day, 'EEE', { locale: es })}
                      </p>
                      <p className="text-lg font-semibold">{format(day, 'd')}</p>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="mt-2 space-y-1">
                  {HOURS.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 gap-1">
                      <div className="flex w-20 items-center justify-end pr-2 text-sm text-muted-foreground">
                        {hour}
                      </div>
                      {weekDays.map((day) => {
                        const slotAppointments = getAppointmentsForSlot(day, hour)
                        return (
                          <div
                            key={`${day.toISOString()}-${hour}`}
                            className="min-h-[60px] rounded border border-dashed border-muted p-1"
                          >
                            {slotAppointments.map((appt) => (
                              <button
                                key={appt.id}
                                onClick={() => handleAppointmentClick(appt)}
                                className={cn(
                                  'mb-1 w-full rounded border p-1 text-left text-xs transition-colors hover:opacity-80',
                                  statusColors[appt.status]
                                )}
                              >
                                <p className="font-medium truncate">
                                  {appt.time} - {appt.client?.name || 'Cliente'}
                                </p>
                                <p className="truncate text-[10px] opacity-75">
                                  {appt.service?.name}
                                </p>
                              </button>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Detalle del turno</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Información completa y acciones disponibles
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 space-y-2 sm:p-4 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm sm:text-base">
                    {selectedAppointment.client?.name || 'Cliente'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(selectedAppointment.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[selectedAppointment.status]}>
                    {statusLabels[selectedAppointment.status]}
                  </Badge>
                </div>
                {selectedAppointment.notes && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      Notas: {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {(selectedAppointment.status === 'pending' || selectedAppointment.status === 'confirmed') && (
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  {selectedAppointment.status === 'pending' && (
                    <Button
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={isUpdating}
                      className="w-full gap-2 sm:w-auto"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Confirmar
                    </Button>
                  )}
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={isUpdating}
                      className="w-full gap-2 bg-green-600 hover:bg-green-700 sm:w-auto"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Completado
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                    className="w-full gap-2 sm:w-auto"
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Cancelar
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
