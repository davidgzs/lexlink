
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Fingerprint, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserAppRole, UserProfile } from '@/types'; 

type LoginStep = 'credentials' | 'fingerprint' | 'verifying' | 'error';

const availableRoles: UserAppRole[] = ["Cliente", "Abogado", "Gerente", "Administrador"];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserAppRole | undefined>(undefined);
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [errorMessage, setErrorMessage] = useState('');

  // Clear any existing "logged in user" on page load to ensure a fresh login
  useEffect(() => {
    localStorage.removeItem('loggedInUserRole');
    localStorage.removeItem('loggedInUserName');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('loggedInUserAvatar');
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

    if (
      (email === 'user@example.com' && password === 'password123' && selectedRole === 'Cliente') ||
      (email === 'abogado@example.com' && password === 'password123' && selectedRole === 'Abogado') ||
      (email === 'gerente@example.com' && password === 'password123' && selectedRole === 'Gerente') ||
      (email === 'admin@example.com' && password === 'password123' && selectedRole === 'Administrador')
    ) {
      setLoginStep('fingerprint');
    } else {
      setErrorMessage('Correo electrónico, contraseña o rol incorrectos.');
      setLoginStep('error');
    }
  };

  const handleFingerprintVerify = async () => {
    setLoginStep('verifying');
    setErrorMessage('');
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedRole && email) {
      localStorage.setItem('loggedInUserRole', selectedRole);
      const userName = email.split('@')[0].replace(/\./g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()); // Basic name from email
      localStorage.setItem('loggedInUserName', userName || 'Usuario');
      localStorage.setItem('loggedInUserEmail', email);
      localStorage.setItem('loggedInUserAvatar', `https://placehold.co/100x100.png?text=${userName.substring(0,1) || 'U'}`);
    }
    
    router.push('/dashboard'); 
  };

  const handleTryAgain = () => {
    setLoginStep('credentials');
    setPassword(''); 
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
          <CardTitle className="text-2xl font-headline text-center">Acceso Seguro al Portal</CardTitle>
          {loginStep === 'credentials' && (
            <CardDescription className="text-center font-body">
              Introduce tus credenciales y selecciona tu rol para acceder.
            </CardDescription>
          )}
          {loginStep === 'fingerprint' && (
            <CardDescription className="text-center font-body">
              Verifica tu identidad usando tu huella dactilar (simulado).
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
              <AlertTitle className="font-headline">Fallo de Inicio de Sesión</AlertTitle>
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
                  placeholder="nombre@ejemplo.com"
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
            <div className="flex flex-col items-center space-y-6">
              <p className="text-center text-muted-foreground font-body">
                Toca el icono de huella dactilar para verificar (simulado).
              </p>
              <Button
                variant="outline"
                size="icon"
                className="h-24 w-24 rounded-full border-4 border-primary hover:bg-primary/10"
                onClick={handleFingerprintVerify}
                aria-label="Verificar con huella dactilar (simulado)"
              >
                <Fingerprint className="h-12 w-12 text-primary" />
              </Button>
              <Button variant="link" onClick={handleTryAgain} className="font-body">
                Usar credenciales en su lugar
              </Button>
            </div>
          )}

          {loginStep === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-body text-muted-foreground">Verificando tu identidad...</p>
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
      <p className="mt-8 text-center text-xs text-muted-foreground font-body">
        Esto es una demostración. La persistencia del rol es simulada con localStorage.
        <br />Prueba con: <code className="bg-muted p-1 rounded-sm">user@example.com</code>, pw: <code className="bg-muted p-1 rounded-sm">password123</code>, rol: <code className="bg-muted p-1 rounded-sm">Cliente</code>.
        <br />O: <code className="bg-muted p-1 rounded-sm">abogado@example.com</code>, pw: <code className="bg-muted p-1 rounded-sm">password123</code>, rol: <code className="bg-muted p-1 rounded-sm">Abogado</code>.
        <br />O: <code className="bg-muted p-1 rounded-sm">gerente@example.com</code>, pw: <code className="bg-muted p-1 rounded-sm">password123</code>, rol: <code className="bg-muted p-1 rounded-sm">Gerente</code>.
        <br />O: <code className="bg-muted p-1 rounded-sm">admin@example.com</code>, pw: <code className="bg-muted p-1 rounded-sm">password123</code>, rol: <code className="bg-muted p-1 rounded-sm">Administrador</code>.
      </p>
    </div>
  );
}
