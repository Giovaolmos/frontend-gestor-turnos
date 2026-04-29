import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { scheduleApi } from "@/api";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import type { DaySchedule, TimeSlot, ApiError } from "@/types";

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS_OF_WEEK.map(({ value }) => ({
  dayOfWeek: value,
  isOpen: value >= 1 && value <= 5, // Mon-Fri open by default
  slots:
    value >= 1 && value <= 5
      ? [
          { start: "09:00", end: "13:00" },
          { start: "14:00", end: "18:00" },
        ]
      : [],
}));

export default function OwnerSchedulePage() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await scheduleApi.getOwnerSchedule();
        if (data.schedule && data.schedule.length > 0) {
          setSchedule(data.schedule);
        }
      } catch {
        // If no schedule exists, use default
        console.log("No schedule found, using default");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleDayToggle = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              isOpen: !day.isOpen,
              slots:
                !day.isOpen && day.slots.length === 0
                  ? [{ start: "09:00", end: "18:00" }]
                  : day.slots,
            }
          : day,
      ),
    );
  };

  const handleSlotChange = (
    dayOfWeek: number,
    slotIndex: number,
    field: "start" | "end",
    value: string,
  ) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: day.slots.map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: value } : slot,
              ),
            }
          : day,
      ),
    );
  };

  const handleAddSlot = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: [...day.slots, { start: "09:00", end: "18:00" }],
            }
          : day,
      ),
    );
  };

  const handleRemoveSlot = (dayOfWeek: number, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              slots: day.slots.filter((_, idx) => idx !== slotIndex),
            }
          : day,
      ),
    );
  };

  const handleSave = async () => {
    // Validate slots
    for (const day of schedule) {
      if (day.isOpen && day.slots.length === 0) {
        toast({
          title: "Error",
          description: `El día ${DAYS_OF_WEEK.find((d) => d.value === day.dayOfWeek)?.label} está abierto pero no tiene horarios definidos`,
          variant: "destructive",
        });
        return;
      }

      for (const slot of day.slots) {
        if (slot.start >= slot.end) {
          toast({
            title: "Error",
            description: "La hora de inicio debe ser menor que la hora de fin",
            variant: "destructive",
          });
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      await scheduleApi.upsert(schedule);
      toast({
        title: "Horarios guardados",
        description: "Tus horarios de atención han sido actualizados.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "No se pudieron guardar los horarios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Horarios de atención
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Configura los días y horarios en que atiendes
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full gap-2 sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {DAYS_OF_WEEK.map(({ value, label }) => {
          const daySchedule = schedule.find((d) => d.dayOfWeek === value);
          if (!daySchedule) return null;

          return (
            <Card key={value}>
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Switch
                      checked={daySchedule.isOpen}
                      onCheckedChange={() => handleDayToggle(value)}
                    />
                    <CardTitle
                      className={`text-base sm:text-lg ${!daySchedule.isOpen ? "text-muted-foreground" : ""}`}
                    >
                      {label}
                    </CardTitle>
                  </div>
                  {daySchedule.isOpen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSlot(value)}
                      className="gap-1 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Agregar</span>
                    </Button>
                  )}
                </div>
                {!daySchedule.isOpen && (
                  <CardDescription className="text-xs sm:text-sm">
                    Cerrado
                  </CardDescription>
                )}
              </CardHeader>

              {daySchedule.isOpen && (
                <CardContent className="pt-0">
                  {daySchedule.slots.length === 0 ? (
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      No hay horarios definidos. Agrega al menos uno.
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {daySchedule.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <div className="flex flex-1 flex-col gap-2 xs:flex-row xs:items-center">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Label className="w-12 text-xs sm:w-16 sm:text-sm">
                                Desde:
                              </Label>
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) =>
                                  handleSlotChange(
                                    value,
                                    slotIndex,
                                    "start",
                                    e.target.value,
                                  )
                                }
                                className="w-24 text-sm sm:w-32"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Label className="w-12 text-xs sm:w-16 sm:text-sm">
                                Hasta:
                              </Label>
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) =>
                                  handleSlotChange(
                                    value,
                                    slotIndex,
                                    "end",
                                    e.target.value,
                                  )
                                }
                                className="w-24 text-sm sm:w-32"
                              />
                            </div>
                          </div>
                          {daySchedule.slots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                              onClick={() => handleRemoveSlot(value, slotIndex)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
