
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
import { Edit, User, Briefcase, UserCog, Shield, Users } from "lucide-react";
import type { UserAppRole } from "@/types";

interface RoleDefinition {
  id: UserAppRole;
  name: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
}

const roleDefinitions: RoleDefinition[] = [
  {
    id: "Cliente",
    name: "Cliente",
    description: "Usuarios que acceden para consultar sus expedientes, citas y comunicarse con sus abogados.",
    icon: User,
    badgeColor: "bg-blue-500",
  },
  {
    id: "Abogado",
    name: "Abogado",
    description: "Profesionales del derecho que gestionan expedientes, interactúan con clientes y actualizan el estado de los casos.",
    icon: Briefcase,
    badgeColor: "bg-green-500",
  },
  {
    id: "Gerente",
    name: "Gerente",
    description: "Usuarios con permisos para supervisar operaciones generales, ver estadísticas y gestionar el personal del despacho.",
    icon: UserCog,
    badgeColor: "bg-purple-500",
  },
  {
    id: "Administrador",
    name: "Administrador",
    description: "Usuarios con acceso total al sistema, incluyendo la configuración de roles, usuarios y tipos de expedientes.",
    icon: Shield,
    badgeColor: "bg-red-500",
  },
];

export default function AdminRolesPage() {

  const handleEditRole = (role: RoleDefinition) => {
    alert(`Simulación: Editar rol "${role.name}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Gestión de Roles
        </h1>
        <Button className="font-body">
          Añadir Nuevo Rol
        </Button>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores definir y gestionar los roles de los usuarios en el sistema.
        Las acciones de edición son simuladas en este prototipo. La eliminación de roles predefinidos no está permitida.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre del Rol</TableHead>
              <TableHead className="font-body">Descripción</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleDefinitions.map((roleDef) => {
              const Icon = roleDef.icon;
              return (
                <TableRow key={roleDef.id}>
                  <TableCell className="font-medium font-body">
                    <Badge className={`${roleDef.badgeColor} text-white whitespace-nowrap mr-2`}>
                      <Icon className="mr-1 h-3 w-3" />
                      {roleDef.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{roleDef.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRole(roleDef)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {roleDefinitions.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay roles definidos.</p>
      )}
    </div>
  );
}
