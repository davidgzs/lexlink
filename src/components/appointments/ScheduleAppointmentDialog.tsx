"use client";

import { useState, useEffect } from 'react';
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
import type { Appointment, AppointmentType, Case } from "@/types";
import { mockCases, mockUserProfile } from "@/lib/mockData";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ScheduleAppointmentDialogProps {
  appointmentToEdit?: Appointment | null;
  onAppointmentScheduled: (appointment: Appointment) => void;
  triggerButton?: React.ReactNode;
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
}: ScheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AppointmentType | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [caseId, setCaseId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (appointmentToEdit) {
      setTitle(appointmentToEdit.title);
      setType(appointmentToEdit.type);
      setDate(new Date(appointmentToEdit.date));
      setTime(appointmentToEdit.time);
      setCaseId(appointmentToEdit.caseId);
      setNotes(''); // Notes usually not part of edit, but can be added
      setOpen(true); // Open dialog if editing
    } else {
      // Reset form for new appointment
      setTitle('');
      setType(undefined);
      setDate(undefined);
      setTime(undefined);
      setCaseId(undefined);
      setNotes('');
    }
  }, [appointmentToEdit, open]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Type, Date, Time).",
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
      participants: [mockUserProfile.name, caseId ? mockCases.find(c=>c.id === caseId)?.attorneyAssigned || 'Attorney' : 'Attorney'],
      status: "Scheduled",
      caseId,
    };
    onAppointmentScheduled(newAppointment);
    toast({
      title: `Appointment ${appointmentToEdit ? 'Updated' : 'Scheduled'}`,
      description: `"${title}" on ${format(date, "PPP")} at ${time}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : 
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Appointment
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] font-body">
        <DialogHeader>
          <DialogTitle className="font-headline">{appointmentToEdit ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>
            Fill in the details to {appointmentToEdit ? "update your" : "schedule a new"} appointment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as AppointmentType)} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-Person">In-Person</SelectItem>
                <SelectItem value="Video Conference">Video Conference</SelectItem>
                <SelectItem value="Written Consultation">Written Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`col-span-3 justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Time</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caseId" className="text-right">Case (Optional)</Label>
            <Select value={caseId} onValueChange={setCaseId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Link to a case" />
              </SelectTrigger>
              <SelectContent>
                {mockCases.map(c => <SelectItem key={c.id} value={c.id}>{c.caseNumber} - {c.clientName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes (Optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Any specific details or topics for the appointment..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{appointmentToEdit ? "Save Changes" : "Schedule Appointment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
