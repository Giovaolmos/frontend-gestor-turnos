import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useServices } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, Calendar } from 'lucide-react'

export default function ServicesPage() {
  const { services, fetchServices, isLoading, error } = useServices()

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-destructive">Error al cargar los servicios</p>
        <Button onClick={() => fetchServices()} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Servicios</h1>
        <p className="mt-1 text-muted-foreground">
          Explora todos los servicios disponibles y reserva tu turno
        </p>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No hay servicios disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge variant="secondary">
                    ${service.price.toLocaleString()}
                  </Badge>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${service.price.toLocaleString()}
                  </span>
                </div>
                <Link to={`/user/book/${service.id}`}>
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Reservar turno
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
