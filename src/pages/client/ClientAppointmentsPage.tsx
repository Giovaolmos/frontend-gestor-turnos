import { useEffect, useState } from 'react'
import { useAppointments } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Calendar, Clock, X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Appointment, AppointmentStatus, ApiError } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export default function ClientAppointmentsPage() {
  const { toast } = useToast()
  const { 
    appointments, 
    fetchClientAppointments, 
    cancelAppointment,
    isLoading,
    pagination 
  } = useAppointments()
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const status = activeTab === 'upcoming' 
      ? undefined // Will show pending and confirmed
      : undefined // Will show all
    fetchClientAppointments({ status })
  }, [activeTab, fetchClientAppointments])

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  )
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  )

  const handleCancelClick = (appointment: Appointment) => {
    setAppointmentToCancel(appointment)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!appointmentToCancel) return

    setIsCancelling(true)
    try {
      await cancelAppointment(appointmentToCancel.id)
      toast({
        title: 'Turno cancelado',
        description: 'Tu turno ha sido cancelado exitosamente.',
      })
      setCancelDialogOpen(false)
      setAppointmentToCancel(null)
    } catch (err) {
      const apiError = err as ApiError
      toast({
        title: 'Error',
        description: apiError.message || 'No se pudo cancelar el turno',
        variant: 'destructive',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div className="flex flex-col gap-2 rounded-lg border p-3 sm:gap-4 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium sm:text-base">{appointment.service?.name || 'Servicio'}</p>
          <Badge className={`text-xs ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            {format(new Date(appointment.date), "EEE d MMM", { locale: es })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            {appointment.time}
          </span>
        </div>
        {appointment.notes && (
          <p className="text-xs text-muted-foreground line-clamp-1 sm:text-sm">
            Notas: {appointment.notes}
          </p>
        )}
      </div>
      
      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-destructive hover:text-destructive sm:w-auto"
          onClick={() => handleCancelClick(appointment)}
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Mis turnos</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Gestiona tus turnos reservados y revisa tu historial
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upcoming' | 'history')}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="upcoming" className="flex-1 text-xs sm:flex-none sm:text-sm">
                Próximos ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 text-xs sm:flex-none sm:text-sm">
                Historial ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No tienes turnos próximos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pastAppointments.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <Clock className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No tienes turnos en tu historial</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Cancelar turno</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              ¿Estás seguro de que deseas cancelar este turno? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {appointmentToCancel && (
            <div className="rounded-lg bg-muted p-3 sm:p-4">
              <p className="text-sm font-medium sm:text-base">{appointmentToCancel.service?.name}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {format(new Date(appointmentToCancel.date), "d 'de' MMMM, yyyy", { locale: es })} a las {appointmentToCancel.time}
              </p>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              No, mantener
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                'Sí, cancelar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
