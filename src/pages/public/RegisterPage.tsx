import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Loader2, User, Store } from "lucide-react";
import type { ApiError, UserRole } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get("role") as UserRole) || "user";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+54"); // Código de país por defecto para Argentina

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Validar formato del número de teléfono
    const phoneRegex = /^\+?\d{10,15}$/; // Acepta números con o sin prefijo internacional
    const formattedPhone = phone.startsWith("+")
      ? phone
      : `${countryCode}${phone}`;
    if (!phoneRegex.test(formattedPhone)) {
      setError("El número de teléfono no es válido");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Registering with data:", {
        name,
        email,
        password,
        phone: formattedPhone,
        confirmPassword,
      });
      await register({
        name,
        email,
        password,
        phone: formattedPhone,
        confirmPassword,
      });
      navigate(role === "owner" ? "/owner" : "/user");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TurnoApp</span>
          </Link>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para comenzar a usar TurnoApp
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client" className="gap-2">
                  <User className="h-4 w-4" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="owner" className="gap-2">
                  <Store className="h-4 w-4" />
                  Negocio
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="client"
                className="mt-4 text-sm text-muted-foreground"
              >
                Regístrate como cliente para reservar turnos
              </TabsContent>
              <TabsContent
                value="owner"
                className="mt-4 text-sm text-muted-foreground"
              >
                Regístrate como negocio para gestionar tus servicios y turnos
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="name">
                {role === "owner" ? "Nombre del negocio" : "Nombre completo"}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={role === "owner" ? "Mi Peluquería" : "Juan Pérez"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryCode">País</Label>
              <Select
                value={countryCode}
                onValueChange={(value) => setCountryCode(value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+54">Argentina (+54)</SelectItem>
                  <SelectItem value="+1">Estados Unidos (+1)</SelectItem>
                  <SelectItem value="+34">España (+34)</SelectItem>
                  <SelectItem value="+52">México (+52)</SelectItem>
                  <SelectItem value="+57">Colombia (+57)</SelectItem>
                  <SelectItem value="+55">Brasil (+55)</SelectItem>
                  {/* Agregar más países según sea necesario */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
