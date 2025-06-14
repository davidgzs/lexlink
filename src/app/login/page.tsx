
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, KeyRound, Loader2 } from "lucide-react"; // Changed Fingerprint to KeyRound
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserAppRole } from '@/types'; 
import { mockUsers } from '@/lib/mockData';

type LoginStep = 'credentials' | 'otp' | 'verifying' | 'error';

const availableRoles: UserAppRole[] = ["Cliente", "Abogado", "Gerente", "Administrador"];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserAppRole | undefined>(undefined);
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.removeItem('loggedInUserRole');
    localStorage.removeItem('loggedInUserName');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('loggedInUserAvatar');
    localStorage.removeItem('loggedInUserId');
  }, []);

  const handleCredentialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setErrorMessage('Por favor, selecciona un rol.');
      setLoginStep('error');
      return;
    }
    setLoginStep('verifying');
    setErrorMessage('');

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const userToLogin = mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.role === selectedRole
    );

    if (userToLogin && password === 'password123') {
      localStorage.setItem('loggedInUserRole', userToLogin.role);
      localStorage.setItem('loggedInUserName', userToLogin.name);
      localStorage.setItem('loggedInUserEmail', userToLogin.email);
      localStorage.setItem('loggedInUserAvatar', userToLogin.avatarUrl || `https://placehold.co/100x100.png?text=${userToLogin.name.substring(0,1).toUpperCase() || 'U'}`);
      localStorage.setItem('loggedInUserId', userToLogin.id);
      setLoginStep('otp'); // Change to OTP step
    } else {
      setErrorMessage('Correo electrónico, contraseña o rol incorrectos.');
      setLoginStep('error');
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginStep('verifying');
    setErrorMessage('');
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    if (otpCode === '1234') {
      router.push('/dashboard'); 
    } else {
      setErrorMessage('Código de verificación incorrecto.');
      setLoginStep('error');
    }
  };

  const handleTryAgain = () => {
    setLoginStep('credentials');
    setPassword(''); 
    setOtpCode('');
    setErrorMessage('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Scale className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline text-primary">LexLINK</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">
            {loginStep === 'otp' ? "Verificación por Código" : "Acceso Seguro al Portal"}
          </CardTitle>
          {loginStep === 'credentials' && (
            <CardDescription className="text-center font-body">
              Introduce tus credenciales y selecciona tu rol para acceder.
            </CardDescription>
          )}
          {loginStep === 'otp' && (
            <CardDescription className="text-center font-body">
              Introduce el código de verificación (simulado: 1234).
            </CardDescription>
          )}
           {loginStep === 'verifying' && (
            <CardDescription className="text-center font-body">
              Por favor espera...
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {loginStep === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="font-headline">Fallo de Autenticación</AlertTitle>
              <AlertDescription className="font-body">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {loginStep === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="font-body">Rol</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserAppRole)} required>
                  <SelectTrigger id="role" className="font-body">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full font-body">
                Iniciar Sesión
              </Button>
            </form>
          )}

          {loginStep === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="font-body">Código de Verificación</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Introduce el código"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  className="font-body text-center tracking-widest"
                  maxLength={6} 
                />
              </div>
              <Button type="submit" className="w-full font-body">
                Verificar Código
              </Button>
              <Button variant="link" onClick={handleTryAgain} className="font-body w-full">
                Usar un código de verificación en su lugar 
              </Button> 
              {/* Text changed as per user request, even if contextually a bit odd.
                  It functionally takes the user back to the credential input step. */}
            </form>
          )}

          {loginStep === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-body text-muted-foreground">Verificando...</p>
            </div>
          )}
        </CardContent>
        {loginStep === 'error' && (
            <CardFooter className="flex-col gap-2">
                 <Button onClick={handleTryAgain} className="w-full font-body">
                    Intentar de Nuevo
                </Button>
            </CardFooter>
        )}
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground font-body max-w-xl">
        Esto es una demostración. La persistencia del rol es simulada con localStorage.
        <br />Contraseña para todos los usuarios: <code className="bg-muted p-1 rounded-sm">password123</code>
        <br />Código OTP simulado: <code className="bg-muted p-1 rounded-sm">1234</code>
        <br />Ejemplos de acceso (usa el rol correspondiente en el desplegable):
        <br />- Cliente (Juan Pérez): <code className="bg-muted p-1 rounded-sm">user@example.com</code> (ID: client_juan_perez)
        <br />- Abogado (Juana García): <code className="bg-muted p-1 rounded-sm">abogado@example.com</code> (ID: attorney_juana_garcia)
        <br />- Gerente: <code className="bg-muted p-1 rounded-sm">gerente@example.com</code> (ID: manager_user)
        <br />- Administrador: <code className="bg-muted p-1 rounded-sm">admin@example.com</code> (ID: admin_user)
      </p>
    </div>
  );
}
