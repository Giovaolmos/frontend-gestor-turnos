import { useEffect, useState } from 'react'
import { useServices } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Pencil, Trash2, Clock, DollarSign, Loader2 } from 'lucide-react'
import type { Service, CreateServiceData, ApiError } from '@/types'

export default function OwnerServicesPage() {
  const { toast } = useToast()
  const { 
    services, 
    fetchOwnerServices, 
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
    isLoading 
  } = useServices()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    duration: number | '';
    price: number | '';
  }>({
    name: '',
    description: '',
    duration: 30,
    price: '',
  })

  useEffect(() => {
    fetchOwnerServices()
  }, [fetchOwnerServices])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: '',
    })
    setEditingService(null)
  }

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const durationVal = typeof formData.duration === 'number' ? formData.duration : 0;
    const priceVal = typeof formData.price === 'number' ? formData.price : -1;

    if (!formData.name || durationVal <= 0 || priceVal < 0) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos correctamente',
        variant: 'destructive',
      })
      return
    }

    const submitData: CreateServiceData = {
      name: formData.name,
      description: formData.description,
      duration: durationVal,
      price: priceVal,
    }

    setIsSubmitting(true)
    try {
      if (editingService) {
        await updateService(editingService.id, submitData)
        toast({
          title: 'Servicio actualizado',
          description: 'El servicio ha sido actualizado exitosamente.',
        })
      } else {
        await createService(submitData)
        toast({
          title: 'Servicio creado',
          description: 'El nuevo servicio ha sido creado exitosamente.',
        })
      }
      setDialogOpen(false)
      resetForm()
    } catch (err) {
      const apiError = err as ApiError
      toast({
        title: 'Error',
        description: apiError.message || 'No se pudo guardar el servicio',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return

    setIsSubmitting(true)
    try {
      await deleteService(serviceToDelete.id)
      toast({
        title: 'Servicio eliminado',
        description: 'El servicio ha sido eliminado exitosamente.',
      })
      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    } catch (err) {
      const apiError = err as ApiError
      toast({
        title: 'Error',
        description: apiError.message || 'No se pudo eliminar el servicio',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      await toggleServiceActive(service.id)
      toast({
        title: service.isActive ? 'Servicio desactivado' : 'Servicio activado',
        description: `El servicio ha sido ${service.isActive ? 'desactivado' : 'activado'}.`,
      })
    } catch (err) {
      const apiError = err as ApiError
      toast({
        title: 'Error',
        description: apiError.message || 'No se pudo cambiar el estado',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Servicios</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Gestiona los servicios que ofreces a tus clientes
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="w-full gap-2 sm:w-auto">
              <Plus className="h-4 w-4" />
              Nuevo servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar servicio' : 'Nuevo servicio'}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? 'Modifica los datos del servicio'
                  : 'Completa los datos para crear un nuevo servicio'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del servicio</Label>
                <Input
                  id="name"
                  placeholder="Ej: Corte de pelo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el servicio..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={5}
                    step={5}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : editingService ? (
                  'Guardar cambios'
                ) : (
                  'Crear servicio'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">
              No tienes servicios creados todavía
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear primer servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className={!service.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate sm:text-lg">{service.name}</CardTitle>
                    {!service.isActive && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => {
                        setServiceToDelete(service)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs line-clamp-2 sm:text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ${service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${service.id}`} className="text-xs sm:text-sm">
                      Activo
                    </Label>
                    <Switch
                      id={`active-${service.id}`}
                      checked={service.isActive}
                      onCheckedChange={() => handleToggleActive(service)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar servicio</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {serviceToDelete && (
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium">{serviceToDelete.name}</p>
              <p className="text-sm text-muted-foreground">
                ${serviceToDelete.price} - {serviceToDelete.duration} min
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
