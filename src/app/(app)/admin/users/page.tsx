
"use client";

import { useState, useMemo } from 'react'; // Added useMemo
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
import { Edit, User, Briefcase, UserCog, Shield, Users as UsersIcon, Filter, CheckCircle, XCircle, Power, PowerOff } from "lucide-react";
import type { UserAppRole, UserProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UserForAdminPage extends UserProfile {}

const roleDisplayInfo: Record<UserAppRole, { icon: React.ElementType, badgeColor: string, translation: string }> = {
  Cliente: { icon: User, badgeColor: "bg-blue-500", translation: "Cliente" },
  Abogado: { icon: Briefcase, badgeColor: "bg-green-500", translation: "Abogado" },
  Gerente: { icon: UserCog, badgeColor: "bg-purple-500", translation: "Gerente" },
  Administrador: { icon: Shield, badgeColor: "bg-red-500", translation: "Administrador" },
};

const roleSortOrder: Record<UserAppRole, number> = {
  Administrador: 1,
  Gerente: 2,
  Abogado: 3,
  Cliente: 4,
};

const availableRolesForFilter: UserAppRole[] = ["Administrador", "Gerente", "Abogado", "Cliente"];
type ActivityFilterStatus = 'Todos' | 'Activos' | 'Inactivos';

const initialDemoUsers: UserForAdminPage[] = [
  { id: 'user_juan_perez', name: 'Juan Pérez', email: 'user@example.com', role: 'Cliente', avatarUrl: 'https://placehold.co/100x100.png?text=JP', isActive: true },
  { id: 'attorney_juana_garcia', name: 'Juana García', email: 'abogado@example.com', role: 'Abogado', avatarUrl: 'https://placehold.co/100x100.png?text=JG', isActive: true },
  { id: 'client_roberto_sanz', name: 'Roberto "Beto" Sanz', email: 'beto.sanz@example.net', role: 'Cliente', isActive: true },
  { id: 'attorney_miguel_torres', name: 'Miguel Torres', email: 'miguel.torres@example.net', role: 'Abogado', isActive: true },
  { id: 'client_carlos_fernandez', name: 'Carlos Fernández', email: 'carlos.fdz@example.net', role: 'Cliente', isActive: true },
  { id: 'client_diana_jimenez', name: 'Diana Jiménez', email: 'diana.jimenez@example.net', role: 'Cliente', isActive: true },
  { id: 'manager_user', name: 'Gerente User', email: 'gerente@example.com', role: 'Gerente', avatarUrl: 'https://placehold.co/100x100.png?text=G', isActive: true },
  { id: 'admin_user', name: 'Admin User', email: 'admin@example.com', role: 'Administrador', avatarUrl: 'https://placehold.co/100x100.png?text=A', isActive: true },
  { id: 'user_david_gonzalez', name: 'David González', email: 'david.gonzalez@example.com', role: 'Cliente', isActive: false, avatarUrl: 'https://placehold.co/100x100.png?text=DG' },
  { id: 'attorney_angela_diaz', name: 'Ángela Díaz', email: 'angela.diaz@example.com', role: 'Abogado', isActive: false, avatarUrl: 'https://placehold.co/100x100.png?text=AD' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserForAdminPage[]>(initialDemoUsers);
  const [userToToggleActiveState, setUserToToggleActiveState] = useState<UserForAdminPage | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserAppRole | 'Todos'>('Todos');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<ActivityFilterStatus>('Todos');
  const { toast } = useToast();

  const handleEditUser = (user: UserForAdminPage) => {
    alert(`Simulación: Editar usuario "${user.name}". En una aplicación real, esto abriría un formulario de edición.`);
  };

  const handleToggleActiveState = (user: UserForAdminPage) => {
    setUserToToggleActiveState(user);
  };

  const confirmToggleActiveState = () => {
    if (!userToToggleActiveState) return;
    
    const newActiveState = !userToToggleActiveState.isActive;

    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userToToggleActiveState.id ? { ...u, isActive: newActiveState } : u
      )
    );

    toast({
      title: `Usuario ${newActiveState ? 'Activado' : 'Inactivado'} (Simulación)`,
      description: `El usuario "${userToToggleActiveState.name}" ha sido ${newActiveState ? 'activado' : 'inactivado'} (simulación).`,
      variant: newActiveState ? "default" : "destructive"
    });
    setUserToToggleActiveState(null);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => selectedRoleFilter === 'Todos' || user.role === selectedRoleFilter)
      .filter(user => {
        if (selectedActivityFilter === 'Activos') return user.isActive === true;
        if (selectedActivityFilter === 'Inactivos') return user.isActive === false;
        return true; // 'Todos'
      })
      .sort((a, b) => {
        const roleOrderA = roleSortOrder[a.role];
        const roleOrderB = roleSortOrder[b.role];
        if (roleOrderA !== roleOrderB) {
          return roleOrderA - roleOrderB;
        }
        // Optional: secondary sort by name if roles are the same
        return a.name.localeCompare(b.name);
      });
  }, [users, selectedRoleFilter, selectedActivityFilter]);


  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <UsersIcon className="mr-3 h-8 w-8" />
          Gestión de Usuarios
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={selectedRoleFilter} onValueChange={(value) => setSelectedRoleFilter(value as UserAppRole | 'Todos')}>
            <SelectTrigger className="w-full sm:w-[180px] font-body">
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
          
          <Select value={selectedActivityFilter} onValueChange={(value) => setSelectedActivityFilter(value as ActivityFilterStatus)}>
            <SelectTrigger className="w-full sm:w-[180px] font-body">
                 <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar por Estado" />
                </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activos">Solo Activos</SelectItem>
              <SelectItem value="Inactivos">Solo Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Button className="font-body" onClick={() => alert('Simulación: Abrir formulario para añadir nuevo usuario.')}>
            Añadir Nuevo Usuario
          </Button>
        </div>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite a los administradores gestionar las cuentas de los usuarios del sistema.
        Las acciones de edición, activación e inactivación son simuladas en este prototipo.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre</TableHead>
              <TableHead className="font-body">Correo Electrónico</TableHead>
              <TableHead className="font-body">Rol</TableHead>
              <TableHead className="font-body text-center">Estado</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const RoleIcon = roleDisplayInfo[user.role].icon;
              const roleBadgeColor = roleDisplayInfo[user.role].badgeColor;
              const roleTranslation = roleDisplayInfo[user.role].translation;
              return (
                <TableRow key={user.id} className={user.isActive === false ? 'opacity-60 bg-muted/30' : ''}>
                  <TableCell className="font-medium font-body">{user.name}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="font-body">
                    <Badge className={`${roleBadgeColor} text-white whitespace-nowrap`}>
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {roleTranslation}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body text-center">
                    {user.isActive === true ? (
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-500/10">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-600 bg-red-500/10">
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant={user.isActive === true ? "destructive" : "outline"} 
                          size="sm" 
                          onClick={() => handleToggleActiveState(user)} 
                          className="font-body"
                        >
                          {user.isActive === true ? <PowerOff className="mr-1 h-3 w-3" /> : <Power className="mr-1 h-3 w-3" />}
                          {user.isActive === true ? "Inactivar" : "Activar"}
                        </Button>
                      </AlertDialogTrigger>
                      {userToToggleActiveState && userToToggleActiveState.id === user.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">
                              ¿Confirmar {userToToggleActiveState.isActive ? "Inactivación" : "Activación"} de Usuario?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-body">
                              Esta acción marcará al usuario "{userToToggleActiveState?.name}" como {userToToggleActiveState.isActive ? "inactivo" : "activo"}.
                              No se eliminará permanentemente.
                              ¿Estás seguro/a?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToToggleActiveState(null)} className="font-body">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={confirmToggleActiveState} 
                              className={`font-body ${userToToggleActiveState.isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            >
                              Confirmar {userToToggleActiveState.isActive ? "Inactivación" : "Activación"}
                            </AlertDialogAction>
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
        <p className="text-center font-body text-muted-foreground mt-6">
          No hay usuarios que coincidan con los filtros seleccionados.
        </p>
      )}
    </div>
  );
}
    

    
