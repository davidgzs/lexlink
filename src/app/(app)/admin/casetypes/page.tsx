
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Edit, Trash2, Type, FileText, Gavel, PlusCircle, CornerDownRight, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BaseTypeIdentifier = 'judicial' | 'administrativo';

interface BaseCaseType {
  id: BaseTypeIdentifier;
  name: string; // "Judicial" o "Administrativo"
  description: string;
  icon: React.ElementType;
  badgeColor: string;
  isBaseType: true;
}

interface SubCaseType {
  id: string; // e.g., "JU-001", "AD-001"
  baseTypeId: BaseTypeIdentifier;
  name: string; // Nombre del subtipo
  description: string;
  icon: React.ElementType; // Heredado del base
  badgeColor: string; // Heredado del base
  isBaseType: false;
}

type CaseTypeOrSubtype = BaseCaseType | SubCaseType;

const initialBaseTypes: BaseCaseType[] = [
  {
    id: "judicial",
    name: "Judicial",
    description: "Expedientes que involucran procesos y litigios ante tribunales de justicia.",
    icon: Gavel,
    badgeColor: "bg-orange-500",
    isBaseType: true,
  },
  {
    id: "administrativo",
    name: "Administrativo",
    description: "Expedientes relacionados con trámites y procedimientos ante organismos de la administración pública.",
    icon: FileText,
    badgeColor: "bg-blue-500",
    isBaseType: true,
  },
];

const initialSubtypes: SubCaseType[] = [
  { id: "JU-001", baseTypeId: "judicial", name: "Civil", description: "Subtipo para casos relacionados con el derecho civil (contratos, familia, sucesiones, etc.).", icon: Gavel, badgeColor: "bg-orange-500", isBaseType: false },
  { id: "JU-002", baseTypeId: "judicial", name: "Laboral", description: "Subtipo para casos relacionados con el derecho laboral (despidos, reclamaciones de cantidad, etc.).", icon: Gavel, badgeColor: "bg-orange-500", isBaseType: false },
  { id: "AD-001", baseTypeId: "administrativo", name: "Sanciones", description: "Subtipo para expedientes sancionadores iniciados por administraciones públicas.", icon: FileText, badgeColor: "bg-blue-500", isBaseType: false },
  { id: "AD-002", baseTypeId: "administrativo", name: "Contratos", description: "Subtipo para la gestión y litigiosidad de contratos con el sector público.", icon: FileText, badgeColor: "bg-blue-500", isBaseType: false },
];

export default function AdminCaseTypesPage() {
  const [caseDefinitions, setCaseDefinitions] = useState<CaseTypeOrSubtype[]>([...initialBaseTypes, ...initialSubtypes]);
  const [isAddSubtypeDialogOpen, setIsAddSubtypeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<CaseTypeOrSubtype | null>(null);
  
  const [newSubtypeName, setNewSubtypeName] = useState('');
  const [newSubtypeDescription, setNewSubtypeDescription] = useState('');
  const [selectedBaseTypeForNewSubtype, setSelectedBaseTypeForNewSubtype] = useState<BaseTypeIdentifier | undefined>(undefined);

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [nextJudicialSubtypeNum, setNextJudicialSubtypeNum] = useState(3); // Start after JU-002
  const [nextAdminSubtypeNum, setNextAdminSubtypeNum] = useState(3); // Start after AD-002

  const [definitionToDelete, setDefinitionToDelete] = useState<SubCaseType | null>(null);

  const [baseTypeFilter, setBaseTypeFilter] = useState<BaseTypeIdentifier | 'todos'>('todos');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'tipo' | 'subtipo'>('todos');


  const { toast } = useToast();

  const openAddSubtypeDialog = () => {
    setNewSubtypeName('');
    setNewSubtypeDescription('');
    setSelectedBaseTypeForNewSubtype(undefined);
    setIsAddSubtypeDialogOpen(true);
  };

  const handleSaveNewSubtype = () => {
    if (!selectedBaseTypeForNewSubtype || !newSubtypeName.trim()) {
      toast({ title: "Error", description: "Selecciona un tipo base y un nombre para el subtipo.", variant: "destructive" });
      return;
    }

    const baseType = initialBaseTypes.find(bt => bt.id === selectedBaseTypeForNewSubtype);
    if (!baseType) return;

    let newSubtypeId: string;

    if (selectedBaseTypeForNewSubtype === 'judicial') {
      newSubtypeId = `JU-${String(nextJudicialSubtypeNum).padStart(3, '0')}`;
      setNextJudicialSubtypeNum(prev => prev + 1);
    } else {
      newSubtypeId = `AD-${String(nextAdminSubtypeNum).padStart(3, '0')}`;
      setNextAdminSubtypeNum(prev => prev + 1);
    }

    const newSubtype: SubCaseType = {
      id: newSubtypeId,
      baseTypeId: selectedBaseTypeForNewSubtype,
      name: newSubtypeName.trim(),
      description: newSubtypeDescription.trim(),
      icon: baseType.icon,
      badgeColor: baseType.badgeColor,
      isBaseType: false,
    };

    setCaseDefinitions(prev => [...prev, newSubtype].sort((a,b) => {
        if (a.isBaseType && !b.isBaseType) return -1;
        if (!a.isBaseType && b.isBaseType) return 1;
        if (!a.isBaseType && !b.isBaseType) {
            if ((a as SubCaseType).baseTypeId < (b as SubCaseType).baseTypeId) return -1;
            if ((a as SubCaseType).baseTypeId > (b as SubCaseType).baseTypeId) return 1;
        }
        return a.id.localeCompare(b.id);
    }));
    toast({ title: "Subtipo Creado", description: `El subtipo "${newSubtype.name}" ha sido añadido.` });
    setIsAddSubtypeDialogOpen(false);
  };

  const openEditDialog = (definition: CaseTypeOrSubtype) => {
    setEditingDefinition(definition);
    setEditName(definition.name);
    setEditDescription(definition.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingDefinition) return;

    if (!editingDefinition.isBaseType && !editName.trim()) {
         toast({ title: "Error", description: "El nombre del subtipo no puede estar vacío.", variant: "destructive" });
         return;
    }

    setCaseDefinitions(prevDefs => prevDefs.map(def => {
      if (def.id === editingDefinition.id) {
        return {
          ...def,
          name: def.isBaseType ? def.name : editName.trim(),
          description: editDescription.trim(),
        };
      }
      return def;
    }));

    toast({ title: "Definición Actualizada", description: `Los cambios en "${editingDefinition.name}" han sido guardados.` });
    setIsEditDialogOpen(false);
    setEditingDefinition(null);
  };

  const openDeleteConfirmDialog = (subtype: SubCaseType) => {
    setDefinitionToDelete(subtype);
  };

  const confirmDeleteSubtype = () => {
    if (!definitionToDelete) return;
    setCaseDefinitions(prevDefs => prevDefs.filter(def => def.id !== definitionToDelete.id));
    toast({ title: "Subtipo Eliminado", description: `El subtipo "${definitionToDelete.name}" ha sido eliminado.`, variant: "destructive" });
    setDefinitionToDelete(null);
  };

  const filteredDefinitions = useMemo(() => {
    return caseDefinitions
      .filter(def => {
        if (baseTypeFilter === 'todos') return true;
        return def.isBaseType ? def.id === baseTypeFilter : (def as SubCaseType).baseTypeId === baseTypeFilter;
      })
      .filter(def => {
        if (categoryFilter === 'todos') return true;
        if (categoryFilter === 'tipo') return def.isBaseType;
        if (categoryFilter === 'subtipo') return !def.isBaseType;
        return true;
      });
  }, [caseDefinitions, baseTypeFilter, categoryFilter]);


  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary flex items-center">
          <Type className="mr-3 h-8 w-8" />
          Gestión de Tipos y Subtipos de Expedientes
        </h1>
        <Button onClick={openAddSubtypeDialog} className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Subtipo
        </Button>
      </div>
      <p className="font-body text-muted-foreground mb-6">
        Define y gestiona los tipos (Judicial, Administrativo) y sus subtipos.
        Los tipos solo permiten modificar su descripción. Los subtipos pueden ser editados y eliminados.
      </p>

      <div className="flex gap-4 mb-4">
        <Select value={baseTypeFilter} onValueChange={(value) => setBaseTypeFilter(value as BaseTypeIdentifier | 'todos')}>
          <SelectTrigger className="w-[200px] font-body">
            <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Tipo" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Tipos</SelectItem>
            {initialBaseTypes.map(bt => (
              <SelectItem key={bt.id} value={bt.id}>{bt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as 'todos' | 'tipo' | 'subtipo')}>
          <SelectTrigger className="w-[200px] font-body">
            <div className="flex items-center">
                 <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Categoría" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las Categorías</SelectItem>
            <SelectItem value="tipo">Solo Tipos</SelectItem>
            <SelectItem value="subtipo">Solo Subtipos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Nombre</TableHead>
              <TableHead className="font-body">Categoría</TableHead>
              <TableHead className="font-body">Descripción</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDefinitions.map((def) => {
              const Icon = def.icon;
              const isSubtype = !def.isBaseType;
              const baseTypeName = isSubtype ? initialBaseTypes.find(bt => bt.id === (def as SubCaseType).baseTypeId)?.name : '';
              
              return (
                <TableRow key={def.id} className={isSubtype ? "bg-muted/30" : ""}>
                  <TableCell className="font-medium font-body">
                    <div className="flex items-center">
                      {isSubtype && <CornerDownRight className="mr-2 h-4 w-4 text-muted-foreground opacity-70" />}
                      <Badge className={`${def.badgeColor} text-white whitespace-nowrap mr-2`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {def.name}
                      </Badge>
                      {isSubtype && <span className="text-xs text-muted-foreground ml-1">({baseTypeName})</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-body">
                    {def.isBaseType ? "Tipo" : "Subtipo"}
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground">{def.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(def)} className="font-body">
                      <Edit className="mr-1 h-3 w-3" /> {def.isBaseType ? 'Editar Descripción' : 'Editar'}
                    </Button>
                    {!def.isBaseType && (
                      <Button variant="destructive" size="sm" onClick={() => openDeleteConfirmDialog(def as SubCaseType)} className="font-body">
                        <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
             {filteredDefinitions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center font-body text-muted-foreground py-6">
                        No hay tipos o subtipos que coincidan con los filtros seleccionados.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      

      {/* Dialog para Añadir Nuevo Subtipo */}
      <Dialog open={isAddSubtypeDialogOpen} onOpenChange={setIsAddSubtypeDialogOpen}>
        <DialogContent className="sm:max-w-[525px] font-body">
          <DialogHeader>
            <DialogTitle className="font-headline">Añadir Nuevo Subtipo de Expediente</DialogTitle>
            <DialogDescription>
              Selecciona el tipo al que pertenece y proporciona un nombre y descripción para el nuevo subtipo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseType" className="text-right">Tipo</Label>
              <Select value={selectedBaseTypeForNewSubtype} onValueChange={(value) => setSelectedBaseTypeForNewSubtype(value as BaseTypeIdentifier)}>
                <SelectTrigger id="baseType" className="col-span-3">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {initialBaseTypes.map(bt => (
                    <SelectItem key={bt.id} value={bt.id}>{bt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subtypeName" className="text-right">Nombre del Subtipo</Label>
              <Input
                id="subtypeName"
                value={newSubtypeName}
                onChange={(e) => setNewSubtypeName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Divorcio Contencioso"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="subtypeDescription" className="text-right pt-2">Descripción</Label>
              <Textarea
                id="subtypeDescription"
                value={newSubtypeDescription}
                onChange={(e) => setNewSubtypeDescription(e.target.value)}
                className="col-span-3 min-h-[100px]"
                placeholder="Describe brevemente este subtipo..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveNewSubtype}>Guardar Subtipo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Tipo/Subtipo */}
      {editingDefinition && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px] font-body">
            <DialogHeader>
              <DialogTitle className="font-headline">
                Editar {editingDefinition.isBaseType ? "Tipo" : "Subtipo"}: {editingDefinition.name}
              </DialogTitle>
              <DialogDescription>
                {editingDefinition.isBaseType 
                  ? "Solo puedes modificar la descripción del tipo."
                  : "Modifica el nombre y/o la descripción del subtipo."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!editingDefinition.isBaseType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editName" className="text-right">Nombre</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="col-span-3"
                    disabled={editingDefinition.isBaseType}
                  />
                </div>
              )}
               <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="editDescription" className="text-right pt-2">Descripción</Label>
                  <Textarea
                    id="editDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="button" onClick={handleSaveEdit}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* AlertDialog para Confirmar Eliminación de Subtipo */}
      {definitionToDelete && (
        <AlertDialog open={!!definitionToDelete} onOpenChange={() => setDefinitionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">¿Confirmar Eliminación?</AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                ¿Estás seguro de que deseas eliminar el subtipo "{definitionToDelete.name}"? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDefinitionToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSubtype} className="bg-destructive hover:bg-destructive/90">
                Eliminar Subtipo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

    