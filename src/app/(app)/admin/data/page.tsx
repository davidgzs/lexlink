
"use client";

import { useState, useEffect, useMemo } from 'react';
import { mockCases } from '@/lib/mockData';
import type { Case, CaseStatus, CaseState } from '@/types';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, ShieldAlert, Filter } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const typeColors: Record<CaseStatus, string> = {
  Administrativo: "bg-blue-500",
  Judicial: "bg-orange-500",
};

const availableStates: CaseState[] = ["Abierto", "Cerrado"];
const availableBaseTypes: CaseStatus[] = ["Judicial", "Administrativo"];

const availableSubtypesForFilter: Record<CaseStatus, string[]> = {
  Judicial: ["Civil", "Laboral"],
  Administrativo: ["Sanciones", "Contratos"],
};

const NO_SUBTYPE_VALUE = "_NONE_";


export default function AdminDataPage() {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editedCaseData, setEditedCaseData] = useState<Partial<Case>>({});
  
  const [baseTypeFilter, setBaseTypeFilter] = useState<CaseStatus | 'todos'>('todos');
  const [subtypeFilter, setSubtypeFilter] = useState<string>('todos');
  const [stateFilter, setStateFilter] = useState<CaseState | 'todos'>('todos');

  const { toast } = useToast();

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setEditedCaseData({ ...caseItem });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCase || !editedCaseData) return;

    const finalPayload = { ...editedCaseData };
    if (finalPayload.subtype === NO_SUBTYPE_VALUE) {
      finalPayload.subtype = undefined;
    }

    const updatedCases = cases.map((c) =>
      c.id === editingCase.id ? { ...c, ...finalPayload, lastUpdate: format(new Date(), 'yyyy-MM-dd') } : c
    );
    setCases(updatedCases as Case[]);
    toast({
      title: "Expediente Actualizado",
      description: `El expediente "${finalPayload.caseNumber || editingCase.caseNumber}" ha sido actualizado.`,
    });
    setIsEditDialogOpen(false);
    setEditingCase(null);
  };

  const handleEditInputChange = (field: keyof Case, value: string | CaseStatus | CaseState) => {
    setEditedCaseData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleBaseTypeFilterChange = (value: CaseStatus | 'todos') => {
    setBaseTypeFilter(value);
    setSubtypeFilter('todos'); 
  };

  const currentSubtypeOptions = useMemo(() => {
    if (baseTypeFilter === 'todos' || !availableSubtypesForFilter[baseTypeFilter]) {
      let allSubs: string[] = [];
      if (baseTypeFilter === 'todos') {
         Object.values(availableSubtypesForFilter).forEach(subs => allSubs.push(...subs));
         return ['todos', ...new Set(allSubs)];
      }
      return ['todos'];
    }
    return ['todos', ...availableSubtypesForFilter[baseTypeFilter]];
  }, [baseTypeFilter]);

  const filteredCases = useMemo(() => {
    return cases
      .filter(c => baseTypeFilter === 'todos' || c.status === baseTypeFilter)
      .filter(c => {
        if (subtypeFilter === 'todos') return true;
        if (baseTypeFilter === 'todos') return c.subtype === subtypeFilter;
        return c.status === baseTypeFilter && c.subtype === subtypeFilter;
      })
      .filter(c => stateFilter === 'todos' || c.state === stateFilter);
  }, [cases, baseTypeFilter, subtypeFilter, stateFilter]);


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
        La eliminación de expedientes no está permitida.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={baseTypeFilter} onValueChange={handleBaseTypeFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px] font-body">
            <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Tipo Base" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Tipos Base</SelectItem>
            {availableBaseTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={subtypeFilter} onValueChange={(value) => setSubtypeFilter(value)} disabled={baseTypeFilter !== 'todos' && !availableSubtypesForFilter[baseTypeFilter]?.length}>
          <SelectTrigger className="w-full sm:w-[200px] font-body">
             <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Subtipo" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {currentSubtypeOptions.map(sub => (
              <SelectItem key={sub} value={sub}>{sub === 'todos' ? `Todos los Subtipos${baseTypeFilter !== 'todos' ? ` de ${baseTypeFilter}` : ''}` : sub}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={stateFilter} onValueChange={(value) => setStateFilter(value as CaseState | 'todos')}>
          <SelectTrigger className="w-full sm:w-[200px] font-body">
            <div className="flex items-center">
                 <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Estado" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Estados</SelectItem>
            {availableStates.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-2xl font-headline mb-4 text-foreground">Tabla de Expedientes</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body text-center">Estado</TableHead>
              <TableHead className="font-body">Nº Expediente</TableHead>
              <TableHead className="font-body">Tipo / Subtipo</TableHead>
              <TableHead className="font-body">Cliente</TableHead>
              <TableHead className="font-body">Abogado/a</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="text-center">
                  {caseItem.state === 'Abierto' ? (
                    <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white font-semibold text-base mx-auto" title="Abierto">A</div>
                  ) : (
                    <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full text-white font-semibold text-base mx-auto" title="Cerrado">C</div>
                  )}
                </TableCell>
                <TableCell className="font-medium font-body">{caseItem.caseNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center justify-center w-7 h-7 rounded-full text-white font-semibold text-xs",
                              typeColors[caseItem.status]
                            )}
                          >
                            {caseItem.status === 'Judicial' ? 'JU' : 'AD'}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{caseItem.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Badge 
                      className={cn(
                        "text-white whitespace-nowrap font-body",
                        typeColors[caseItem.status]
                      )}
                    >
                      {caseItem.subtype || "Sin Subtipo"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-body">{caseItem.clientName}</TableCell>
                <TableCell className="font-body">{caseItem.attorneyAssigned || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditCase(caseItem)} className="font-body">
                    <Edit className="mr-1 h-3 w-3" /> Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {filteredCases.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center font-body text-muted-foreground py-6">
                        No hay expedientes que coincidan con los filtros seleccionados.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingCase && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px] font-body">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Expediente: {editingCase.caseNumber}</DialogTitle>
              <DialogDescription>
                Modifica los detalles del expediente. Los cambios se guardarán localmente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caseNumber" className="text-right">Nº Expediente</Label>
                <Input
                  id="caseNumber"
                  value={editedCaseData.caseNumber || ''}
                  onChange={(e) => handleEditInputChange('caseNumber', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">Cliente</Label>
                <Input
                  id="clientName"
                  value={editedCaseData.clientName || ''}
                  onChange={(e) => handleEditInputChange('clientName', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attorneyAssigned" className="text-right">Abogado/a</Label>
                <Input
                  id="attorneyAssigned"
                  value={editedCaseData.attorneyAssigned || ''}
                  onChange={(e) => handleEditInputChange('attorneyAssigned', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Tipo Base</Label>
                <Select
                  value={editedCaseData.status}
                  onValueChange={(value) => {
                    handleEditInputChange('status', value as CaseStatus);
                    // If base type changes, reset subtype as available subtypes will change
                    if (editedCaseData.status !== value) {
                        handleEditInputChange('subtype', NO_SUBTYPE_VALUE);
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona tipo base" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBaseTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subtype" className="text-right">Subtipo</Label>
                <Select
                  value={editedCaseData.subtype || NO_SUBTYPE_VALUE}
                  onValueChange={(value) => handleEditInputChange('subtype', value)}
                  disabled={!editedCaseData.status || !availableSubtypesForFilter[editedCaseData.status!]?.length}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un subtipo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_SUBTYPE_VALUE}>Ninguno</SelectItem>
                    {editedCaseData.status && availableSubtypesForFilter[editedCaseData.status!]?.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">Estado</Label>
                <Select
                  value={editedCaseData.state}
                  onValueChange={(value) => handleEditInputChange('state', value as CaseState)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Descripción</Label>
                <Textarea
                  id="description"
                  value={editedCaseData.description || ''}
                  onChange={(e) => handleEditInputChange('description', e.target.value)}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Introduce la descripción del expediente..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveEdit}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

