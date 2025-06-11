
"use client";

import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Gestión de Usuarios
        </h1>
      </div>
      <p className="font-body text-muted-foreground">
        Esta sección permitirá a los administradores gestionar las cuentas de los usuarios, como crear, editar o desactivar usuarios.
        (Página de demostración: contenido futuro).
      </p>
    </div>
  );
}
