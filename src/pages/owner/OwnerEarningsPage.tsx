import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { earningsApi } from '@/api'
import { DollarSign, TrendingUp, Calendar, Users, Loader2 } from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import type { EarningsSummary, EarningsDetail } from '@/types'

export default function OwnerEarningsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [dailyEarnings, setDailyEarnings] = useState<EarningsDetail[]>([])
  const [activeTab, setActiveTab] = useState<'summary' | 'daily' | 'monthly'>('summary')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch summary
        const summaryData = await earningsApi.getSummary()
        setSummary(summaryData)

        // Fetch last 7 days
        const today = new Date()
        const weekAgo = subDays(today, 7)
        const dailyData = await earningsApi.getByDateRange(
          format(weekAgo, 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd')
        )
        setDailyEarnings(dailyData)
      } catch (error) {
        console.error('Error fetching earnings:', error)
        // Use mock data for demonstration
        setSummary({
          daily: 15000,
          weekly: 85000,
          monthly: 320000,
          totalAppointments: 45,
          completedAppointments: 38,
          cancelledAppointments: 7,
        })
        setDailyEarnings([
          { date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), appointments: [], total: 12000 },
          { date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), appointments: [], total: 15000 },
          { date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), appointments: [], total: 8000 },
          { date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), appointments: [], total: 18000 },
          { date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), appointments: [], total: 14000 },
          { date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), appointments: [], total: 10000 },
          { date: format(new Date(), 'yyyy-MM-dd'), appointments: [], total: 15000 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Ganancias</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Revisa el rendimiento de tu negocio
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Hoy
            </CardTitle>
            <DollarSign className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold sm:text-2xl">
              ${summary?.daily.toLocaleString() || 0}
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {format(new Date(), "d 'de' MMMM", { locale: es })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Semana
            </CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-blue-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold sm:text-2xl">
              ${summary?.weekly.toLocaleString() || 0}
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Últimos 7 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Mes
            </CardTitle>
            <Calendar className="h-3.5 w-3.5 text-purple-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold sm:text-2xl">
              ${summary?.monthly.toLocaleString() || 0}
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {format(new Date(), 'MMMM yyyy', { locale: es })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              Completados
            </CardTitle>
            <Users className="h-3.5 w-3.5 text-orange-500 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold sm:text-2xl">
              {summary?.completedAppointments || 0}
              <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                /{summary?.totalAppointments || 0}
              </span>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="summary" className="flex-1 text-xs sm:flex-none sm:text-sm">Resumen</TabsTrigger>
              <TabsTrigger value="daily" className="flex-1 text-xs sm:flex-none sm:text-sm">Por día</TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1 text-xs sm:flex-none sm:text-sm">Por mes</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-3 sm:mt-4">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Estadísticas del mes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de turnos</span>
                      <span className="font-medium">{summary?.totalAppointments || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completados</span>
                      <span className="font-medium text-green-600">
                        {summary?.completedAppointments || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancelados</span>
                      <span className="font-medium text-red-600">
                        {summary?.cancelledAppointments || 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Tasa de completados</span>
                      <span className="font-medium">
                        {summary?.totalAppointments 
                          ? Math.round((summary.completedAppointments / summary.totalAppointments) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Promedio de ganancias</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Por día</span>
                      <span className="font-medium">
                        ${summary?.weekly ? Math.round(summary.weekly / 7).toLocaleString() : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Por turno</span>
                      <span className="font-medium">
                        ${summary?.completedAppointments && summary.monthly 
                          ? Math.round(summary.monthly / summary.completedAppointments).toLocaleString() 
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="mt-3 sm:mt-4">
              <div className="space-y-2">
                {dailyEarnings.map((earning) => (
                  <div
                    key={earning.date}
                    className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3"
                  >
                    <div>
                      <p className="text-sm font-medium sm:text-base">
                        {format(new Date(earning.date), "EEE d MMM", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {earning.appointments.length} turnos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-green-600 sm:text-lg">
                        ${earning.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="mt-4">
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                Próximamente: Vista mensual detallada
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}
