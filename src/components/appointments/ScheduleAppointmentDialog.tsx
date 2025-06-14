
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Appointment, AppointmentType, Case, UserProfile, UserAppRole } from "@/types";
// mockCases is removed from here, will be passed as prop
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface ScheduleAppointmentDialogProps {
  appointmentToEdit?: Appointment | null;
  onAppointmentScheduled: (appointment: Appointment) => void;
  triggerButton?: React.ReactNode;
  currentUser: UserProfile | null;
  users: UserProfile[];
  cases: Case[];
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
];

export default function ScheduleAppointmentDialog({
  appointmentToEdit,
  onAppointmentScheduled,
  triggerButton,
  currentUser,
  users,
  cases,
}: ScheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AppointmentType | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [caseId, setCaseId] = useState<string | undefined>(undefined); // For linking to a case
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) { // Reset form when dialog is closed
        setTitle('');
        setType(undefined);
        setDate(undefined);
        setTime(undefined);
        setCaseId(undefined);
        setNotes('');
        setSelectedClientId(currentUser?.role === 'Cliente' ? currentUser.id : undefined);
        setSelectedAttorneyId(currentUser?.role === 'Abogado' ? currentUser.id : undefined);
    } else if (appointmentToEdit) { // Populate form if editing
        setTitle(appointmentToEdit.title);
        setType(appointmentToEdit.type);
        setDate(new Date(appointmentToEdit.date));
        setTime(appointmentToEdit.time);
        setCaseId(appointmentToEdit.caseId);
        setNotes(''); 

        const clientParticipant = users.find(u => u.name === appointmentToEdit.participants[0] && u.role === 'Cliente');
        const attorneyParticipant = users.find(u => u.name === appointmentToEdit.participants[1] && u.role === 'Abogado');
        setSelectedClientId(clientParticipant?.id);
        setSelectedAttorneyId(attorneyParticipant?.id);
        
    } else { // Reset for new appointment, considering current user role
        setSelectedClientId(currentUser?.role === 'Cliente' ? currentUser.id : undefined);
        setSelectedAttorneyId(currentUser?.role === 'Abogado' ? currentUser.id : undefined);
    }
  }, [appointmentToEdit, open, currentUser, users]);


  const clientOptions = useMemo(() => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'Cliente':
        return users.filter(u => u.id === currentUser.id).map(u => ({ value: u.id, label: u.name }));
      case 'Abogado':
        const attorneyClientNames = new Set(
          cases.filter(c => c.attorneyAssigned === currentUser.name).map(c => c.clientName)
        );
        return users.filter(u => u.role === 'Cliente' && attorneyClientNames.has(u.name)).map(u => ({ value: u.id, label: u.name }));
      case 'Gerente':
      case 'Administrador':
        return users.filter(u => u.role === 'Cliente').map(u => ({ value: u.id, label: u.name }));
      default:
        return [];
    }
  }, [currentUser, users, cases]);

  const attorneyOptions = useMemo(() => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'Abogado':
        return users.filter(u => u.id === currentUser.id).map(u => ({ value: u.id, label: u.name }));
      case 'Cliente':
      case 'Gerente':
      case 'Administrador':
        return users.filter(u => u.role === 'Abogado').map(u => ({ value: u.id, label: u.name }));
      default:
        return [];
    }
  }, [currentUser, users]);

  const isClientFieldDisabled = currentUser?.role === 'Cliente';
  const isAttorneyFieldDisabled = currentUser?.role === 'Abogado';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type || !date || !time || !selectedClientId || !selectedAttorneyId) {
      toast({
        title: "Información Faltante",
        description: "Por favor, completa todos los campos obligatorios (Cliente, Abogado/a, Título, Tipo, Fecha, Hora).",
        variant: "destructive",
      });
      return;
    }

    const clientUser = users.find(u => u.id === selectedClientId);
    const attorneyUser = users.find(u => u.id === selectedAttorneyId);

    if (!clientUser || !attorneyUser) {
      toast({
        title: "Error de Participantes",
        description: "No se pudieron encontrar los detalles del cliente o abogado seleccionado.",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: appointmentToEdit ? appointmentToEdit.id : `A${Date.now()}`,
      title,
      type,
      date: format(date, "yyyy-MM-dd"),
      time,
      participants: [clientUser.name, attorneyUser.name],
      status: "Programada",
      caseId, // Optional case linking
    };
    onAppointmentScheduled(newAppointment);
    toast({
      title: `Cita ${appointmentToEdit ? 'Actualizada' : 'Agendada'}`,
      description: `"${title}" para ${clientUser.name} con ${attorneyUser.name} el ${format(date, "PPP", { locale: es })} a las ${time}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : 
          // Default trigger button if none is provided
          <Button disabled={!currentUser}> 
            <PlusCircle className="mr-2 h-4 w-4" /> Programar Nueva Cita
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] font-body">
        <DialogHeader>
          <DialogTitle className="font-headline">{appointmentToEdit ? "Editar Cita" : "Programar Nueva Cita"}</DialogTitle>
          <DialogDescription>
            Completa los detalles para {appointmentToEdit ? "actualizar tu" : "programar una nueva"} cita.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Cliente</Label>
            <Select 
              value={selectedClientId} 
              onValueChange={setSelectedClientId} 
              required 
              disabled={isClientFieldDisabled}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attorney" className="text-right">Abogado/a</Label>
            <Select 
              value={selectedAttorneyId} 
              onValueChange={setSelectedAttorneyId} 
              required
              disabled={isAttorneyFieldDisabled}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un abogado/a" />
              </SelectTrigger>
              <SelectContent>
                {attorneyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as AppointmentType)} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona tipo de cita" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En-Persona">En Persona</SelectItem>
                <SelectItem value="Video Conferencia">Video Conferencia</SelectItem>
                <SelectItem value="Consulta Escrita">Consulta Escrita</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`col-span-3 justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() -1))} 
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Hora</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caseIdLink" className="text-right">Caso (Opcional)</Label>
            <Select value={caseId} onValueChange={setCaseId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Vincular a un caso" />
              </SelectTrigger>
              <SelectContent>
                {cases
                  .filter(c => // Only show cases relevant to selected client or if admin/manager
                    currentUser?.role === 'Gerente' || currentUser?.role === 'Administrador' || 
                    (selectedClientId && users.find(u=>u.id === selectedClientId)?.name === c.clientName)
                  )
                  .map(c => <SelectItem key={c.id} value={c.id}>{c.caseNumber} - {c.clientName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notas (Opcionales)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Detalles específicos o temas para la cita..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{appointmentToEdit ? "Guardar Cambios" : "Agendar Cita"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
