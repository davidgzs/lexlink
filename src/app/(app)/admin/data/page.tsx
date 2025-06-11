
"use client";

import { useState } from 'react';
import { mockCases } from '@/lib/mockData';
import type { Case, CaseStatus } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

// Mapeo de tipos de caso a traducciones y colores para la columna "Tipo"
const caseTypeTranslations: Record<CaseStatus, string> = {
  Administrative: "Administrativo",
  Judicial: "Judicial",
};

const typeColors: Record<CaseStatus, string> = {
    Administrative: "bg-blue-500",
    Judicial: "bg-orange-500",
};

export default function AdminDataPage() {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const { toast } = useToast();

  const handleEditCase = (caseItem: Case) => {
    alert(`Simulación: Editar caso "${caseItem.caseNumber}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  const handleDeleteCase = (caseItem: Case) => {
    setCaseToDelete(caseItem);
  };

  const confirmDeleteCase = () => {
    if (!caseToDelete) return;
    setCases(prevCases => prevCases.filter(c => c.id !== caseToDelete.id));
    toast({
      title: "Caso Eliminado (Simulación)",
      description: `El caso "${caseToDelete.caseNumber}" ha sido eliminado (simulación).`,
      variant: "destructive"
    });
    setCaseToDelete(null);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8" />
          Gestión de Datos (Administrador)
        </h1>
      </div>

      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores ver y gestionar los datos del sistema.
        Las acciones de edición y eliminación son simuladas en este prototipo.
      </p>

      <h2 className="text-2xl font-headline mb-4 text-foreground">Tabla de Expedientes</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nº Expediente</TableHead>
              <TableHead className="font-body">Cliente</TableHead>
              <TableHead className="font-body">Tipo</TableHead>
              <TableHead className="font-body">Estado</TableHead>
              <TableHead className="font-body">Abogado/a</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium font-body">{caseItem.caseNumber}</TableCell>
                <TableCell className="font-body">{caseItem.clientName}</TableCell>
                <TableCell>
                  <Badge className={`${typeColors[caseItem.status]} text-white whitespace-nowrap font-body`}>
                    {caseTypeTranslations[caseItem.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {caseItem.state === 'Abierto' ? (
                    <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white font-semibold text-base mx-auto" title="Abierto">A</div>
                  ) : (
                    <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full text-white font-semibold text-base mx-auto" title="Cerrado">C</div>
                  )}
                </TableCell>
                <TableCell className="font-body">{caseItem.attorneyAssigned || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditCase(caseItem)} className="font-body">
                    <Edit className="mr-1 h-3 w-3" /> Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCase(caseItem)} className="font-body">
                        <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    {caseToDelete && caseToDelete.id === caseItem.id && (
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">¿Confirmar Eliminación?</AlertDialogTitle>
                            <AlertDialogDescription className="font-body">
                            Esta acción es simulada y no se puede deshacer en el prototipo.
                            ¿Estás seguro/a de que quieres eliminar el expediente: "{caseToDelete?.caseNumber}"?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCaseToDelete(null)} className="font-body">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteCase} className="font-body bg-destructive hover:bg-destructive/90">Confirmar Eliminación</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    )}
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {cases.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay expedientes para mostrar.</p>
      )}
    </div>
  );
}
