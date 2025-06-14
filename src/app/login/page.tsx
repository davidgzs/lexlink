
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Fingerprint, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserAppRole } from '@/types';
import { mockUsers } from '@/lib/mockData';

type LoginStep = 'credentials' | 'fingerprint' | 'otpCodeInput' | 'verifying' | 'error';

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

  const proceedToDashboard = (user: typeof mockUsers[0]) => {
    localStorage.setItem('loggedInUserRole', user.role);
    localStorage.setItem('loggedInUserName', user.name);
    localStorage.setItem('loggedInUserEmail', user.email);
    localStorage.setItem('loggedInUserAvatar', user.avatarUrl || `https://placehold.co/100x100.png?text=${user.name.substring(0,1).toUpperCase() || 'U'}`);
    localStorage.setItem('loggedInUserId', user.id);
    router.push('/dashboard');
  };

  const handleCredentialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setErrorMessage('Por favor, selecciona un rol.');
      setLoginStep('error'); // Go to general error step if role not selected
      return;
    }
    setLoginStep('verifying');
    setErrorMessage('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const userToLogin = mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.role === selectedRole
    );

    if (userToLogin && password === 'password123') {
      setLoginStep('fingerprint'); // Proceed to fingerprint step
    } else {
      setErrorMessage('Correo electrónico, contraseña o rol incorrectos.');
      setLoginStep('error'); // Go to general error step
    }
  };

  const handleFingerprintAttempt = async () => {
    setLoginStep('verifying');
    setErrorMessage('');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate fingerprint scan

    const userToLogin = mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.role === selectedRole
    );

    if (!userToLogin) { // Should not happen if credentials were correct
        setErrorMessage('Error inesperado, usuario no encontrado tras validación inicial.');
        setLoginStep('error');
        return;
    }

    // Simulate 50% chance of fingerprint failure for demonstration
    if (Math.random() < 0.7) { // Simulate success (70% success rate)
      proceedToDashboard(userToLogin);
    } else { // Simulate failure
      setErrorMessage('Verificación biométrica fallida. Por favor, inténtalo con un código de verificación.');
      setLoginStep('otpCodeInput'); // Go to OTP code input step
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginStep('verifying');
    setErrorMessage('');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userToLogin = mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.role === selectedRole
    );
    
    if (!userToLogin) {
        setErrorMessage('Error inesperado, usuario no encontrado.');
        setLoginStep('error');
        return;
    }

    if (otpCode === '1234') {
      proceedToDashboard(userToLogin);
    } else {
      setErrorMessage('Código de verificación incorrecto.');
      setLoginStep('otpCodeInput'); // Stay on OTP input, error will be shown
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
            {loginStep === 'fingerprint' ? "Autenticación Biométrica" :
             loginStep === 'otpCodeInput' ? "Verificación por Código" :
             "Acceso Seguro al Portal"}
          </CardTitle>
          {loginStep === 'credentials' && (
            <CardDescription className="text-center font-body">
              Introduce tus credenciales y selecciona tu rol para acceder.
            </CardDescription>
          )}
          {loginStep === 'fingerprint' && (
            <CardDescription className="text-center font-body">
              Por favor, utiliza tu huella dactilar para verificar tu identidad.
            </CardDescription>
          )}
          {loginStep === 'otpCodeInput' && (
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
          {errorMessage && (loginStep === 'otpCodeInput' || loginStep === 'credentials' || loginStep === 'error' || loginStep === 'fingerprint') && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-headline">Aviso de Autenticación</AlertTitle>
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

          {loginStep === 'fingerprint' && (
            <div className="space-y-6 text-center">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-32 flex flex-col items-center justify-center border-dashed border-2 hover:border-primary group"
                onClick={handleFingerprintAttempt}
              >
                <Fingerprint className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="mt-2 font-body text-muted-foreground group-hover:text-primary">Verificar Huella</span>
              </Button>
              <Button variant="link" onClick={() => { setErrorMessage(''); setLoginStep('otpCodeInput');}} className="font-body w-full">
                Usar un código de verificación en su lugar
              </Button>
            </div>
          )}

          {loginStep === 'otpCodeInput' && (
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
              <Button variant="link" onClick={() => {setErrorMessage(''); setLoginStep('fingerprint');}} className="font-body w-full">
                 Volver a verificación biométrica
              </Button>
            </form>
          )}

          {loginStep === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-body text-muted-foreground">Verificando...</p>
            </div>
          )}
        </CardContent>
        {loginStep === 'error' && ( // This step is for critical errors like initial credential failure
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
        <br />Código OTP simulado: <code className="bg-muted p-1 rounded-sm">1234</code>. La huella tiene un 30% de probabilidad de fallo simulado.
        <br />Ejemplos de acceso (usa el rol correspondiente en el desplegable):
        <br />- Cliente (Juan Pérez): <code className="bg-muted p-1 rounded-sm">user@example.com</code>
        <br />- Abogado (Juana García): <code className="bg-muted p-1 rounded-sm">abogado@example.com</code>
        <br />- Gerente: <code className="bg-muted p-1 rounded-sm">gerente@example.com</code>
        <br />- Administrador: <code className="bg-muted p-1 rounded-sm">admin@example.com</code>
      </p>
    </div>
  );
}

    