
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, User, Briefcase, UserCog, Shield, Users as UsersIcon, Filter } from "lucide-react";
import type { UserAppRole, UserProfile } from "@/types"; // Import UserProfile
import { useToast } from "@/hooks/use-toast";

// UserForAdminPage now includes isActive, inheriting from UserProfile
interface UserForAdminPage extends UserProfile {}

const roleDisplayInfo: Record<UserAppRole, { icon: React.ElementType, badgeColor: string, translation: string }> = {
  Cliente: { icon: User, badgeColor: "bg-blue-500", translation: "Cliente" },
  Abogado: { icon: Briefcase, badgeColor: "bg-green-500", translation: "Abogado" },
  Gerente: { icon: UserCog, badgeColor: "bg-purple-500", translation: "Gerente" },
  Administrador: { icon: Shield, badgeColor: "bg-red-500", translation: "Administrador" },
};

const availableRolesForFilter: UserAppRole[] = ["Cliente", "Abogado", "Gerente", "Administrador"];

const initialDemoUsers: UserForAdminPage[] = [
  { id: 'user_juan_perez', name: 'Juan Pérez', email: 'user@example.com', role: 'Cliente', avatarUrl: 'https://placehold.co/100x100.png?text=JP', isActive: true },
  { id: 'attorney_juana_garcia', name: 'Juana García', email: 'abogado@example.com', role: 'Abogado', avatarUrl: 'https://placehold.co/100x100.png?text=JG', isActive: true },
  { id: 'client_roberto_sanz', name: 'Roberto "Beto" Sanz', email: 'beto.sanz@example.net', role: 'Cliente', isActive: true },
  { id: 'attorney_miguel_torres', name: 'Miguel Torres', email: 'miguel.torres@example.net', role: 'Abogado', isActive: true },
  { id: 'client_carlos_fernandez', name: 'Carlos Fernández', email: 'carlos.fdz@example.net', role: 'Cliente', isActive: true },
  { id: 'client_diana_jimenez', name: 'Diana Jiménez', email: 'diana.jimenez@example.net', role: 'Cliente', isActive: true },
  { id: 'manager_user', name: 'Gerente User', email: 'gerente@example.com', role: 'Gerente', avatarUrl: 'https://placehold.co/100x100.png?text=G', isActive: true },
  { id: 'admin_user', name: 'Admin User', email: 'admin@example.com', role: 'Administrador', avatarUrl: 'https://placehold.co/100x100.png?text=A', isActive: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserForAdminPage[]>(initialDemoUsers);
  const [userToDeactivate, setUserToDeactivate] = useState<UserForAdminPage | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserAppRole | 'Todos'>('Todos');
  const { toast } = useToast();

  const handleEditUser = (user: UserForAdminPage) => {
    alert(`Simulación: Editar usuario "${user.name}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  const handleDeactivateUser = (user: UserForAdminPage) => {
    setUserToDeactivate(user);
  };

  const confirmDeactivateUser = () => {
    if (!userToDeactivate) return;
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userToDeactivate.id ? { ...u, isActive: false } : u
      )
    );
    toast({
      title: "Usuario Dado de Baja (Simulación)",
      description: `El usuario "${userToDeactivate.name}" ha sido marcado como inactivo (simulación).`,
      variant: "destructive" // Or a more neutral variant if preferred
    });
    setUserToDeactivate(null);
  };

  const filteredUsers = users
    .filter(user => user.isActive !== false) // Only show active users
    .filter(user => selectedRoleFilter === 'Todos' || user.role === selectedRoleFilter);

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <UsersIcon className="mr-3 h-8 w-8" />
          Gestión de Usuarios
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={selectedRoleFilter} onValueChange={(value) => setSelectedRoleFilter(value as UserAppRole | 'Todos')}>
            <SelectTrigger className="w-full sm:w-[200px] font-body">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Rol" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los Roles</SelectItem>
              {availableRolesForFilter.map(role => (
                <SelectItem key={role} value={role}>{roleDisplayInfo[role].translation}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="font-body" onClick={() => alert('Simulación: Abrir formulario para añadir nuevo usuario.')}>
            Añadir Nuevo Usuario
          </Button>
        </div>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores gestionar las cuentas de los usuarios del sistema.
        Las acciones de edición y baja son simuladas en este prototipo.
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
            {filteredUsers.map((user) => {
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
                        <Button variant="destructive" size="sm" onClick={() => handleDeactivateUser(user)} className="font-body">
                          <Trash2 className="mr-1 h-3 w-3" /> Dar de Baja
                        </Button>
                      </AlertDialogTrigger>
                      {userToDeactivate && userToDeactivate.id === user.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">¿Confirmar Baja de Usuario?</AlertDialogTitle>
                            <AlertDialogDescription className="font-body">
                              Esta acción marcará al usuario "{userToDeactivate?.name}" como inactivo. No se eliminará permanentemente.
                              ¿Estás seguro/a?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDeactivate(null)} className="font-body">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeactivateUser} className="font-body bg-destructive hover:bg-destructive/90">Confirmar Baja</AlertDialogAction>
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
      {filteredUsers.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay usuarios activos que coincidan con el filtro seleccionado.</p>
      )}
    </div>
  );
}
