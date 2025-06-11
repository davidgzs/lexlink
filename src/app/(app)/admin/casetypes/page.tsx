
"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Type, FileText, Gavel, Repeat } from "lucide-react";

interface CaseTypeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
}

const caseTypeDefinitions: CaseTypeDefinition[] = [
  {
    id: "judicial",
    name: "Judicial",
    description: "Expedientes que involucran procesos y litigios ante tribunales de justicia.",
    icon: Gavel,
    badgeColor: "bg-orange-500",
  },
  {
    id: "administrative",
    name: "Administrativo",
    description: "Expedientes relacionados con trámites y procedimientos ante organismos de la administración pública.",
    icon: FileText,
    badgeColor: "bg-blue-500",
  },
  {
    id: "appeal",
    name: "Apelación",
    description: "Expedientes que consisten en la revisión de sentencias o resoluciones judiciales previas por un tribunal superior.",
    icon: Repeat,
    badgeColor: "bg-purple-500",
  },
  // Podríamos añadir 'Cerrado' aquí si se considera un tipo gestionable, pero por ahora nos centramos en los activos.
];

export default function AdminCaseTypesPage() {

  const handleEditType = (caseType: CaseTypeDefinition) => {
    alert(`Simulación: Editar tipo "${caseType.name}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  const handleDeleteType = (caseType: CaseTypeDefinition) => {
    alert(`Simulación: Eliminar tipo "${caseType.name}". Se pediría confirmación antes de eliminar.`);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Type className="mr-3 h-8 w-8" />
          Gestión de Tipos de Expedientes
        </h1>
        <Button className="font-body">
          Añadir Nuevo Tipo
        </Button>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores definir y gestionar los diferentes tipos de expedientes o casos que se manejan en el sistema.
        Las acciones de edición y eliminación son simuladas en este prototipo.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre del Tipo</TableHead>
              <TableHead className="font-body">Descripción</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caseTypeDefinitions.map((typeDef) => {
              const Icon = typeDef.icon;
              return (
                <TableRow key={typeDef.id}>
                  <TableCell className="font-medium font-body">
                    <Badge className={`${typeDef.badgeColor} text-white whitespace-nowrap mr-2`}>
                      <Icon className="mr-1 h-3 w-3" />
                      {typeDef.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{typeDef.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditType(typeDef)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteType(typeDef)} className="font-body">
                      <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {caseTypeDefinitions.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay tipos de expedientes definidos.</p>
      )}
    </div>
  );
}
