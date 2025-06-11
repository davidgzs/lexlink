
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
import { Edit, Trash2, User, Briefcase, UserCog, Shield, Users as UsersIcon } from "lucide-react";
import type { UserAppRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UserForAdminPage {
  id: string;
  name: string;
  email: string;
  role: UserAppRole;
  avatarUrl?: string; // Not directly used in table but good for consistency
}

const roleDisplayInfo: Record<UserAppRole, { icon: React.ElementType, badgeColor: string, translation: string }> = {
  Cliente: { icon: User, badgeColor: "bg-blue-500", translation: "Cliente" },
  Abogado: { icon: Briefcase, badgeColor: "bg-green-500", translation: "Abogado" },
  Gerente: { icon: UserCog, badgeColor: "bg-purple-500", translation: "Gerente" },
  Administrador: { icon: Shield, badgeColor: "bg-red-500", translation: "Administrador" },
};

const initialDemoUsers: UserForAdminPage[] = [
  { id: 'user_juan_perez', name: 'Juan Pérez', email: 'user@example.com', role: 'Cliente', avatarUrl: 'https://placehold.co/100x100.png?text=JP' },
  { id: 'attorney_juana_garcia', name: 'Juana García', email: 'abogado@example.com', role: 'Abogado', avatarUrl: 'https://placehold.co/100x100.png?text=JG' },
  { id: 'client_roberto_sanz', name: 'Roberto "Beto" Sanz', email: 'beto.sanz@example.net', role: 'Cliente' },
  { id: 'attorney_miguel_torres', name: 'Miguel Torres', email: 'miguel.torres@example.net', role: 'Abogado' },
  { id: 'client_carlos_fernandez', name: 'Carlos Fernández', email: 'carlos.fdz@example.net', role: 'Cliente' },
  { id: 'client_diana_jimenez', name: 'Diana Jiménez', email: 'diana.jimenez@example.net', role: 'Cliente' },
  { id: 'manager_user', name: 'Gerente User', email: 'gerente@example.com', role: 'Gerente', avatarUrl: 'https://placehold.co/100x100.png?text=G' },
  { id: 'admin_user', name: 'Admin User', email: 'admin@example.com', role: 'Administrador', avatarUrl: 'https://placehold.co/100x100.png?text=A' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserForAdminPage[]>(initialDemoUsers);
  const [userToDelete, setUserToDelete] = useState<UserForAdminPage | null>(null);
  const { toast } = useToast();

  const handleEditUser = (user: UserForAdminPage) => {
    alert(`Simulación: Editar usuario "${user.name}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  const handleDeleteUser = (user: UserForAdminPage) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
    toast({
      title: "Usuario Eliminado (Simulación)",
      description: `El usuario "${userToDelete.name}" ha sido eliminado (simulación).`,
      variant: "destructive"
    });
    setUserToDelete(null);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <UsersIcon className="mr-3 h-8 w-8" />
          Gestión de Usuarios
        </h1>
        <Button className="font-body" onClick={() => alert('Simulación: Abrir formulario para añadir nuevo usuario.')}>
          Añadir Nuevo Usuario
        </Button>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores gestionar las cuentas de los usuarios del sistema.
        Las acciones de edición y eliminación son simuladas en este prototipo.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre</TableHead>
              <TableHead className="font-body">Correo Electrónico</TableHead>
              <TableHead className="font-body">Rol</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const RoleIcon = roleDisplayInfo[user.role].icon;
              const roleBadgeColor = roleDisplayInfo[user.role].badgeColor;
              const roleTranslation = roleDisplayInfo[user.role].translation;
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium font-body">{user.name}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="font-body">
                    <Badge className={`${roleBadgeColor} text-white whitespace-nowrap`}>
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {roleTranslation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)} className="font-body">
                          <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      {userToDelete && userToDelete.id === user.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">¿Confirmar Eliminación?</AlertDialogTitle>
                            <AlertDialogDescription className="font-body">
                              Esta acción es simulada. ¿Estás seguro/a de que quieres eliminar al usuario "{userToDelete?.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)} className="font-body">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteUser} className="font-body bg-destructive hover:bg-destructive/90">Confirmar Eliminación</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {users.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay usuarios para mostrar.</p>
      )}
    </div>
  );
}
