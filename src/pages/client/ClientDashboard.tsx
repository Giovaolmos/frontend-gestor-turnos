import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppointments } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, Scissors } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Appointment } from '@/types'

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

export default function ClientDashboard() {
  const { user } = useAuth()
  const { appointments, fetchClientAppointments, isLoading } = useAppointments()
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    fetchClientAppointments({ page: 1 })
  }, [fetchClientAppointments])

  useEffect(() => {
    // Filter to show only upcoming appointments (not cancelled/completed)
    const upcoming = appointments
      .filter((a) => a.status === 'pending' || a.status === 'confirmed')
      .slice(0, 3)
    setUpcomingAppointments(upcoming)
  }, [appointments])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">¡Hola, {user?.name}!</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Bienvenido a tu panel de cliente
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
              <Calendar className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-base sm:text-lg">Reservar turno</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Agenda un nuevo turno para el servicio que necesites
            </CardDescription>
            <Link to="/user/book">
              <Button className="mt-3 w-full gap-2 sm:mt-4 sm:w-auto" size="sm">
                Reservar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
              <Scissors className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-base sm:text-lg">Ver servicios</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Explora todos los servicios disponibles
            </CardDescription>
            <Link to="/user/services">
              <Button className="mt-3 w-full gap-2 sm:mt-4 sm:w-auto" size="sm" variant="outline">
                Ver servicios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
              <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-base sm:text-lg">Mis turnos</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Revisa tu historial y próximos turnos
            </CardDescription>
            <Link to="/user/appointments">
              <Button className="mt-3 w-full gap-2 sm:mt-4 sm:w-auto" size="sm" variant="outline">
                Ver historial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Próximos turnos</CardTitle>
              <CardDescription>Tus reservas pendientes y confirmadas</CardDescription>
            </div>
            <Link to="/user/appointments">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No tienes turnos próximos</p>
              <Link to="/user/book">
                <Button variant="link" className="mt-2">
                  Reservar un turno
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between sm:justify-start">
                      <p className="text-sm font-medium sm:text-base">
                        {appointment.service?.name || 'Servicio'}
                      </p>
                      <Badge className={`ml-2 sm:hidden ${statusColors[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {format(new Date(appointment.date), "d 'de' MMMM", { locale: es })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                  <Badge className={`hidden sm:inline-flex ${statusColors[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
