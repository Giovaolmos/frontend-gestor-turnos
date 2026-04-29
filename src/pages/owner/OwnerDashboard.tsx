import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppointments, useServices } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

export default function OwnerDashboard() {
  const { user } = useAuth()
  const { appointments, fetchOwnerAppointments, isLoading } = useAppointments()
  const { services, fetchOwnerServices } = useServices()
  
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    weeklyEarnings: 0,
    totalClients: 0,
  })

  useEffect(() => {
    fetchOwnerAppointments({ page: 1 })
    fetchOwnerServices()
  }, [fetchOwnerAppointments, fetchOwnerServices])

  useEffect(() => {
    // Calculate stats
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayAppts = appointments.filter((a) => a.date === today)
    const pendingAppts = appointments.filter((a) => a.status === 'pending')
    const completedAppts = appointments.filter((a) => a.status === 'completed')
    
    // Calculate weekly earnings (mock)
    const weeklyEarnings = completedAppts.reduce((sum, a) => {
      const service = services.find((s) => s.id === a.serviceId)
      return sum + (service?.price || 0)
    }, 0)

    setStats({
      todayAppointments: todayAppts.length,
      pendingAppointments: pendingAppts.length,
      weeklyEarnings,
      totalClients: new Set(appointments.map((a) => a.clientId)).size,
    })
  }, [appointments, services])

  const todayAppointments = appointments
    .filter((a) => a.date === format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Bienvenido, {user?.name}. Aquí tienes un resumen de tu negocio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Hoy
            </CardTitle>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{stats.todayAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Pendientes
            </CardTitle>
            <AlertCircle className="h-3.5 w-3.5 text-yellow-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{stats.pendingAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Semana
            </CardTitle>
            <DollarSign className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              ${stats.weeklyEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Clientes
            </CardTitle>
            <Users className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{stats.totalClients}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Turnos de hoy</CardTitle>
                <CardDescription>
                  {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
                </CardDescription>
              </div>
              <Link to="/owner/appointments">
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
            ) : todayAppointments.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No hay turnos para hoy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.client?.name || 'Cliente'} - {appointment.service?.name}
                      </p>
                    </div>
                    <Badge className={statusColors[appointment.status]}>
                      {statusLabels[appointment.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link to="/owner/appointments">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="h-4 w-4" />
                Ver agenda de turnos
              </Button>
            </Link>
            <Link to="/owner/services">
              <Button variant="outline" className="w-full justify-start gap-3">
                <CheckCircle className="h-4 w-4" />
                Gestionar servicios
              </Button>
            </Link>
            <Link to="/owner/schedule">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Clock className="h-4 w-4" />
                Configurar horarios
              </Button>
            </Link>
            <Link to="/owner/earnings">
              <Button variant="outline" className="w-full justify-start gap-3">
                <DollarSign className="h-4 w-4" />
                Ver ganancias
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
