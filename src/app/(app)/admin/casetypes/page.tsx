
"use client";

import { Type } from "lucide-react";

export default function AdminCaseTypesPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Type className="mr-3 h-8 w-8" />
          Gestión de Tipos de Expedientes
        </h1>
      </div>
      <p className="font-body text-muted-foreground">
        Esta sección permitirá a los administradores definir los diferentes tipos de expedientes o casos que se manejan en el sistema.
        (Página de demostración: contenido futuro).
      </p>
    </div>
  );
}
