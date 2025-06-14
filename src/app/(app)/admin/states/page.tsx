
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity } from "lucide-react";
import type { CaseState } from "@/types";

interface StateDefinition {
  id: CaseState;
  name: string;
  description: string;
}

const stateDefinitions: StateDefinition[] = [
  {
    id: "Abierto",
    name: "Abierto / Activo",
    description: "Expedientes que están actualmente en curso y requieren atención.",
  },
  {
    id: "Cerrado",
    name: "Cerrado / Inactivo",
    description: "Expedientes que han concluido y no requieren más acciones.",
  },
];

export default function AdminStatesPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Activity className="mr-3 h-8 w-8" />
          Gestión de Estados de Expedientes
        </h1>
        {/* Podríamos añadir un botón "Añadir Nuevo Estado" si fuera necesario, pero para este caso solo hay dos. */}
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección define los posibles estados en los que puede encontrarse un expediente.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre del Estado</TableHead>
              <TableHead className="font-body">Descripción</TableHead>
              <TableHead className="text-center font-body">Visualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stateDefinitions.map((stateDef) => (
              <TableRow key={stateDef.id}>
                <TableCell className="font-medium font-body">
                  {stateDef.name}
                </TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">
                  {stateDef.description}
                </TableCell>
                <TableCell className="text-center">
                  {stateDef.id === 'Abierto' ? (
                    <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white font-semibold text-base mx-auto" title="Abierto">A</div>
                  ) : (
                    <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full text-white font-semibold text-base mx-auto" title="Cerrado">C</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {stateDefinitions.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay estados definidos.</p>
      )}
    </div>
  );
}
