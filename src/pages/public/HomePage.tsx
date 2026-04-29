import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Users, Scissors, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Reserva fácil',
    description: 'Agenda tu turno en segundos, elige el día y horario que mejor te convenga.',
  },
  {
    icon: Clock,
    title: 'Gestión de horarios',
    description: 'Los negocios pueden configurar sus horarios de atención de forma flexible.',
  },
  {
    icon: Users,
    title: 'Historial completo',
    description: 'Accede a tu historial de turnos y gestiona tus reservas fácilmente.',
  },
  {
    icon: Scissors,
    title: 'Múltiples servicios',
    description: 'Ideal para peluquerías, estéticas, consultorios y cualquier negocio con turnos.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <span className="text-lg font-bold sm:text-xl">TurnoApp</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="text-xs sm:text-sm">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center sm:py-16 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="block">Gestiona tus turnos</span>
          <span className="mt-1 block text-primary sm:mt-2">de forma simple</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
          La plataforma perfecta para negocios que necesitan gestionar citas y reservas.
          Ideal para peluquerías, estéticas, consultorios y más.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link to="/register?role=client" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              Soy cliente
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register?role=owner" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
              Tengo un negocio
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Todo lo que necesitas
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Una solución completa para la gestión de turnos y citas
          </p>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-background">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-center sm:py-16 md:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">¿Listo para empezar?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
          Únete a los miles de negocios y clientes que ya usan TurnoApp
        </p>
        <div className="mt-6 sm:mt-8">
          <Link to="/register" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">Crear cuenta gratis</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TurnoApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
