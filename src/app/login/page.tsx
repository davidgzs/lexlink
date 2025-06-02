
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Fingerprint, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LoginStep = 'credentials' | 'fingerprint' | 'verifying' | 'error';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginStep('verifying');
    setErrorMessage('');

    // Mock credential check
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'user@example.com' && password === 'password123') {
      setLoginStep('fingerprint');
    } else {
      setErrorMessage('Invalid email or password.');
      setLoginStep('error');
    }
  };

  const handleFingerprintVerify = async () => {
    setLoginStep('verifying');
    setErrorMessage('');
    // Mock fingerprint scan
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you'd use WebAuthn here.
    // For this mock, we'll assume success.
    router.push('/dashboard');
  };

  const handleTryAgain = () => {
    setLoginStep('credentials');
    setPassword(''); // Clear password for security
    setErrorMessage('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Briefcase className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline text-primary">Lex Connect</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Secure Portal Login</CardTitle>
          {loginStep === 'credentials' && (
            <CardDescription className="text-center font-body">
              Enter your credentials to access your account.
            </CardDescription>
          )}
          {loginStep === 'fingerprint' && (
            <CardDescription className="text-center font-body">
              Verify your identity using your fingerprint.
            </CardDescription>
          )}
           {loginStep === 'verifying' && (
            <CardDescription className="text-center font-body">
              Please wait...
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {loginStep === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="font-headline">Login Failed</AlertTitle>
              <AlertDescription className="font-body">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {loginStep === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body">Password</Label>
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
              <Button type="submit" className="w-full font-body">
                Login
              </Button>
            </form>
          )}

          {loginStep === 'fingerprint' && (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-center text-muted-foreground font-body">
                Tap the fingerprint icon to verify with your smartphone.
              </p>
              <Button
                variant="outline"
                size="icon"
                className="h-24 w-24 rounded-full border-4 border-primary hover:bg-primary/10"
                onClick={handleFingerprintVerify}
                aria-label="Verify with fingerprint"
              >
                <Fingerprint className="h-12 w-12 text-primary" />
              </Button>
              <Button variant="link" onClick={handleTryAgain} className="font-body">
                Use password instead
              </Button>
            </div>
          )}

          {loginStep === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-body text-muted-foreground">Verifying your identity...</p>
            </div>
          )}
        </CardContent>
        {loginStep === 'error' && (
            <CardFooter className="flex-col gap-2">
                 <Button onClick={handleTryAgain} className="w-full font-body">
                    Try Again
                </Button>
            </CardFooter>
        )}
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground font-body">
        This is a UI demonstration. For actual fingerprint authentication, WebAuthn and backend integration would be required.
        <br /> For this demo, use email: <code className="bg-muted p-1 rounded-sm">user@example.com</code> and password: <code className="bg-muted p-1 rounded-sm">password123</code>.
      </p>
    </div>
  );
}
