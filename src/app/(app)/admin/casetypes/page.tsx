
"use client";

import { useState } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Type as PageIcon, Gavel, FileText, ListTree, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CaseTypeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
  isMaster: boolean;
  parentMasterId?: 'judicial' | 'administrativo';
}

const initialCaseTypes: CaseTypeDefinition[] = [
  {
    id: "judicial",
    name: "Judicial",
    description: "Expedientes que involucran procesos y litigios ante tribunales de justicia.",
    icon: Gavel,
    badgeColor: "bg-orange-500",
    isMaster: true,
  },
  {
    id: "administrativo",
    name: "Administrativo",
    description: "Expedientes relacionados con trámites y procedimientos ante organismos de la administración pública.",
    icon: FileText,
    badgeColor: "bg-blue-500",
    isMaster: true,
  },
];

export default function AdminCaseTypesPage() {
  const [caseTypes, setCaseTypes] = useState<CaseTypeDefinition[]>(initialCaseTypes);
  const [isSubtypeDialogOpen, setIsSubtypeDialogOpen] = useState(false);
  const [isEditMasterDialogOpen, setIsEditMasterDialogOpen] = useState(false);
  const [subtypeDialogMode, setSubtypeDialogMode] = useState<'add' | 'edit'>('add');
  
  const [editingCaseType, setEditingCaseType] = useState<CaseTypeDefinition | null>(null);
  const [deletingCaseType, setDeletingCaseType] = useState<CaseTypeDefinition | null>(null);

  const [formParentMasterId, setFormParentMasterId] = useState<'judicial' | 'administrativo' | undefined>(undefined);
  const [formSubtypeName, setFormSubtypeName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const { toast } = useToast();

  const getNextSubtypeId = (parentId: 'judicial' | 'administrativo'): string => {
    const prefix = parentId === 'judicial' ? 'JU' : 'AD';
    const subtypesOfParent = caseTypes.filter(
      ct => ct.parentMasterId === parentId && ct.id.startsWith(prefix + '-')
    );
    if (subtypesOfParent.length === 0) {
      return `${prefix}-001`;
    }
    const maxNum = subtypesOfParent.reduce((max, ct) => {
      const numPart = parseInt(ct.id.split('-')[1], 10);
      return numPart > max ? numPart : max;
    }, 0);
    return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const resetForms = () => {
    setFormParentMasterId(undefined);
    setFormSubtypeName('');
    setFormDescription('');
    setEditingCaseType(null);
  };

  const handleOpenAddSubtypeDialog = () => {
    resetForms();
    setSubtypeDialogMode('add');
    setIsSubtypeDialogOpen(true);
  };

  const handleOpenEditDialog = (caseType: CaseTypeDefinition) => {
    setEditingCaseType(caseType);
    setFormDescription(caseType.description);
    if (caseType.isMaster) {
      setIsEditMasterDialogOpen(true);
    } else {
      setSubtypeDialogMode('edit');
      setFormSubtypeName(caseType.name);
      setFormParentMasterId(caseType.parentMasterId); // Should not be editable, but good to have
      setIsSubtypeDialogOpen(true);
    }
  };

  const handleSaveMasterDescription = () => {
    if (!editingCaseType || !editingCaseType.isMaster) return;
    setCaseTypes(prev => 
      prev.map(ct => 
        ct.id === editingCaseType.id ? { ...ct, description: formDescription } : ct
      )
    );
    toast({ title: "Descripción Actualizada", description: `La descripción para "${editingCaseType.name}" ha sido actualizada.` });
    setIsEditMasterDialogOpen(false);
    resetForms();
  };

  const handleSaveSubtype = () => {
    if (subtypeDialogMode === 'add' && (!formParentMasterId || !formSubtypeName.trim())) {
      toast({ title: "Error", description: "Debe seleccionar un tipo padre y un nombre para el subtipo.", variant: "destructive" });
      return;
    }
    if (subtypeDialogMode === 'edit' && (!editingCaseType || !formSubtypeName.trim())) {
         toast({ title: "Error", description: "El nombre del subtipo no puede estar vacío.", variant: "destructive" });
      return;
    }

    if (subtypeDialogMode === 'add' && formParentMasterId) {
      const newId = getNextSubtypeId(formParentMasterId);
      const newSubtype: CaseTypeDefinition = {
        id: newId,
        name: formSubtypeName,
        description: formDescription,
        icon: ListTree, // Generic icon for subtypes
        badgeColor: formParentMasterId === 'judicial' ? "bg-orange-400" : "bg-blue-400", // Slightly different color
        isMaster: false,
        parentMasterId: formParentMasterId,
      };
      setCaseTypes(prev => [...prev, newSubtype]);
      toast({ title: "Subtipo Añadido", description: `El subtipo "${formSubtypeName}" ha sido añadido.` });
    } else if (subtypeDialogMode === 'edit' && editingCaseType) {
      setCaseTypes(prev => 
        prev.map(ct => 
          ct.id === editingCaseType.id 
          ? { ...ct, name: formSubtypeName, description: formDescription } 
          : ct
        )
      );
      toast({ title: "Subtipo Actualizado", description: `El subtipo "${formSubtypeName}" ha sido actualizado.` });
    }
    setIsSubtypeDialogOpen(false);
    resetForms();
  };
  
  const handleDeleteSubtype = (caseType: CaseTypeDefinition) => {
    if (caseType.isMaster) return; // Should not happen as button won't be there
    setDeletingCaseType(caseType);
  };

  const confirmDeleteSubtype = () => {
    if (!deletingCaseType) return;
    setCaseTypes(prev => prev.filter(ct => ct.id !== deletingCaseType.id));
    toast({ title: "Subtipo Eliminado", description: `El subtipo "${deletingCaseType.name}" ha sido eliminado.`, variant: "destructive" });
    setDeletingCaseType(null);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <PageIcon className="mr-3 h-8 w-8" />
          Gestión de Tipos y Subtipos de Expedientes
        </h1>
        <Button className="font-body" onClick={handleOpenAddSubtypeDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Subtipo
        </Button>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Esta sección permite definir y gestionar los tipos maestros (Judicial, Administrativo) y sus subtipos.
        Los tipos maestros solo permiten editar su descripción. Los subtipos pueden ser creados, editados y eliminados.
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre del Tipo/Subtipo</TableHead>
              <TableHead className="font-body">Descripción</TableHead>
              <TableHead className="font-body">Tipo</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caseTypes.map((typeDef) => {
              const IconToRender = typeDef.icon;
              const parentName = typeDef.parentMasterId 
                ? caseTypes.find(ct => ct.id === typeDef.parentMasterId)?.name 
                : null;
              const displayName = parentName ? `${parentName} / ${typeDef.name}` : typeDef.name;

              return (
                <TableRow key={typeDef.id}>
                  <TableCell className="font-medium font-body">
                    <Badge className={`${typeDef.badgeColor} text-white whitespace-nowrap mr-2`}>
                      <IconToRender className="mr-1 h-3 w-3" />
                      {displayName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{typeDef.description}</TableCell>
                  <TableCell className="font-body">
                    {typeDef.isMaster ? "Maestro" : "Subtipo"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(typeDef)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    {!typeDef.isMaster && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSubtype(typeDef)} className="font-body">
                        <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {caseTypes.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay tipos/subtipos de expedientes definidos.</p>
      )}

      {/* Dialog for Adding/Editing Subtype */}
      <Dialog open={isSubtypeDialogOpen} onOpenChange={(isOpen) => { setIsSubtypeDialogOpen(isOpen); if (!isOpen) resetForms();}}>
        <DialogContent className="sm:max-w-[525px] font-body">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {subtypeDialogMode === 'add' ? "Añadir Nuevo Subtipo" : "Editar Subtipo"}
            </DialogTitle>
            <DialogDescription>
              {subtypeDialogMode === 'add' 
                ? "Selecciona el tipo maestro y completa los detalles del nuevo subtipo." 
                : `Editando el subtipo: ${editingCaseType?.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {subtypeDialogMode === 'add' && (
              <div className="space-y-2">
                <Label htmlFor="parentMasterId" className="font-semibold">Tipo Maestro Padre</Label>
                <Select value={formParentMasterId} onValueChange={(value) => setFormParentMasterId(value as 'judicial' | 'administrativo')}>
                  <SelectTrigger id="parentMasterId">
                    <SelectValue placeholder="Selecciona un tipo maestro" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialCaseTypes.filter(ct => ct.isMaster).map(master => (
                      <SelectItem key={master.id} value={master.id}>{master.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
             {subtypeDialogMode === 'edit' && editingCaseType && (
                 <div className="space-y-1">
                    <Label className="font-semibold text-sm">Tipo Maestro Padre:</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                        {caseTypes.find(ct => ct.id === editingCaseType.parentMasterId)?.name || 'N/A'}
                    </p>
                 </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="subtypeName" className="font-semibold">Nombre del Subtipo</Label>
              <Input 
                id="subtypeName" 
                value={formSubtypeName} 
                onChange={(e) => setFormSubtypeName(e.target.value)} 
                placeholder="Ej: Laboral, Mercantil, Multas de Tráfico..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtypeDescription" className="font-semibold">Descripción (Opcional)</Label>
              <Textarea 
                id="subtypeDescription" 
                value={formDescription} 
                onChange={(e) => setFormDescription(e.target.value)} 
                placeholder="Describe brevemente este subtipo..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveSubtype}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing Master Type Description */}
      <Dialog open={isEditMasterDialogOpen} onOpenChange={(isOpen) => { setIsEditMasterDialogOpen(isOpen); if (!isOpen) resetForms(); }}>
        <DialogContent className="sm:max-w-[525px] font-body">
          <DialogHeader>
            <DialogTitle className="font-headline">Editar Descripción del Tipo Maestro: {editingCaseType?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="masterDescription" className="font-semibold">Descripción</Label>
              <Textarea 
                id="masterDescription" 
                value={formDescription} 
                onChange={(e) => setFormDescription(e.target.value)} 
                className="min-h-[100px]"
                placeholder="Introduce la nueva descripción..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveMasterDescription}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Subtype */}
      {deletingCaseType && (
        <AlertDialog open={!!deletingCaseType} onOpenChange={() => setDeletingCaseType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">¿Confirmar Eliminación?</AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                ¿Estás seguro/a de que quieres eliminar el subtipo: "{deletingCaseType?.name}"? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingCaseType(null)} className="font-body">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSubtype} className="font-body bg-destructive hover:bg-destructive/90">Confirmar Eliminación</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
