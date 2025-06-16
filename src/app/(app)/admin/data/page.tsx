
"use client";

import { useState, useEffect } from 'react';
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
import { Edit, ShieldAlert } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const caseTypeTranslations: Record<CaseStatus, string> = {
  Administrativo: "Administrativo",
  Judicial: "Judicial",
};

const typeColors: Record<CaseStatus, string> = {
  Administrativo: "bg-blue-500",
  Judicial: "bg-orange-500",
};

const availableStates: CaseState[] = ["Abierto", "Cerrado"];
const availableTypes: CaseStatus[] = ["Administrativo", "Judicial"];

export default function AdminDataPage() {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editedCaseData, setEditedCaseData] = useState<Partial<Case>>({});
  const { toast } = useToast();

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setEditedCaseData({ ...caseItem });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCase || !editedCaseData) return;

    const updatedCases = cases.map((c) =>
      c.id === editingCase.id ? { ...c, ...editedCaseData, lastUpdate: format(new Date(), 'yyyy-MM-dd') } : c
    );
    setCases(updatedCases as Case[]); // Cast to Case[] as editedCaseData is Partial<Case> but merged with full Case
    toast({
      title: "Expediente Actualizado",
      description: `El expediente "${editedCaseData.caseNumber || editingCase.caseNumber}" ha sido actualizado.`,
    });
    setIsEditDialogOpen(false);
    setEditingCase(null);
  };

  const handleEditInputChange = (field: keyof Case, value: string | CaseStatus | CaseState) => {
    setEditedCaseData((prev) => ({ ...prev, [field]: value }));
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
        La eliminación de expedientes no está permitida en este prototipo.
      </p>

      <h2 className="text-2xl font-headline mb-4 text-foreground">Tabla de Expedientes</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body text-center">Estado</TableHead>
              <TableHead className="font-body">Nº Expediente</TableHead>
              <TableHead className="font-body">Tipo</TableHead>
              <TableHead className="font-body">Cliente</TableHead>
              <TableHead className="font-body">Abogado/a</TableHead>
              <TableHead className="text-right font-body">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
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
                  <Badge className={`${typeColors[caseItem.status]} text-white whitespace-nowrap font-body`}>
                    {caseTypeTranslations[caseItem.status]}
                  </Badge>
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
          </TableBody>
        </Table>
      </div>
      {cases.length === 0 && (
        <p className="text-center font-body text-muted-foreground mt-6">No hay expedientes para mostrar.</p>
      )}

      {editingCase && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px] font-body">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Expediente: {editingCase.caseNumber}</DialogTitle>
              <DialogDescription>
                Modifica los detalles del expediente. Los cambios se guardarán localmente en esta demo.
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
                <Label htmlFor="status" className="text-right">Tipo</Label>
                <Select
                  value={editedCaseData.status}
                  onValueChange={(value) => handleEditInputChange('status', value as CaseStatus)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map(type => (
                      <SelectItem key={type} value={type}>{caseTypeTranslations[type]}</SelectItem>
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
