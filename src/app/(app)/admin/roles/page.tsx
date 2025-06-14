
"use client";

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, User, Briefcase, UserCog, Shield, Users } from "lucide-react";
import type { UserAppRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface RoleDefinition {
  id: UserAppRole;
  name: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
}

const initialRoleDefinitions: RoleDefinition[] = [
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
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>(initialRoleDefinitions);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditRole = (role: RoleDefinition) => {
    setEditingRole(role);
    setNewDescription(role.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveDescription = () => {
    if (!editingRole) return;

    setRoleDefinitions(prevRoles =>
      prevRoles.map(role =>
        role.id === editingRole.id ? { ...role, description: newDescription } : role
      )
    );
    toast({
      title: "Descripción Actualizada",
      description: `La descripción del rol "${editingRole.name}" ha sido actualizada.`,
    });
    setIsEditDialogOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Gestión de Roles
        </h1>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores visualizar y modificar la descripción de los roles de los usuarios en el sistema.
        La creación o eliminación de roles predefinidos no está permitida.
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
                      <Edit className="mr-1 h-3 w-3" /> Editar Descripción
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

      {editingRole && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px] font-body">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Descripción del Rol: {editingRole.name}</DialogTitle>
              <DialogDescription>
                Modifica la descripción para el rol de {editingRole.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentDescription" className="font-semibold">Descripción Actual:</Label>
                <p id="currentDescription" className="text-sm text-muted-foreground p-3 bg-muted rounded-md min-h-[60px]">
                  {editingRole.description}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newDescription" className="font-semibold">Nueva Descripción:</Label>
                <Textarea
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Introduce la nueva descripción del rol..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveDescription}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
