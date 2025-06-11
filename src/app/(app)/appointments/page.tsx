
"use client";

import { useState, useEffect } from 'react';
import { mockAppointments } from '@/lib/mockData';
import type { Appointment } from '@/types';
import AppointmentListItem from '@/components/appointments/AppointmentListItem';
import ScheduleAppointmentDialog from '@/components/appointments/ScheduleAppointmentDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from '@/components/ui/card';
import { es } from 'date-fns/locale'; // Importar el locale 'es'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleAppointmentScheduled = (appointment: Appointment) => {
    setAppointments(prev => {
      const existingIndex = prev.findIndex(a => a.id === appointment.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = appointment;
        return updated;
      }
      return [...prev, appointment];
    });
    setSelectedAppointment(null); // Close dialog / reset edit state
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // The dialog will open via its own state when appointmentToEdit is set
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(app => app.id === appointmentId ? {...app, status: "Cancelled"} : app));
  };

  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAppointments = appointments.filter(a => new Date(a.date) < new Date() || a.status !== 'Scheduled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // For calendar view, filter appointments for selectedDate
  const appointmentsForSelectedDate = appointments.filter(
    (appointment) =>
      selectedDate &&
      new Date(appointment.date).toDateString() === selectedDate.toDateString() &&
      appointment.status === 'Scheduled'
  );


  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary">Citas</h1>
        <ScheduleAppointmentDialog
          appointmentToEdit={selectedAppointment}
          onAppointmentScheduled={handleAppointmentScheduled}
        />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="list" className="font-body">Vista de Lista</TabsTrigger>
          <TabsTrigger value="calendar" className="font-body">Vista de Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <section className="mb-8">
            <h2 className="text-2xl font-headline mb-4 text-foreground">Próximas Citas</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAppointments.map((app) => (
                  <AppointmentListItem key={app.id} appointment={app} onEdit={handleEditAppointment} onCancel={handleCancelAppointment} />
                ))}
              </div>
            ) : (
              <p className="font-body text-muted-foreground">No hay próximas citas.</p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-headline mb-4 text-foreground">Citas Anteriores</h2>
            {pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastAppointments.map((app) => (
                  <AppointmentListItem key={app.id} appointment={app} onEdit={handleEditAppointment} onCancel={handleCancelAppointment} />
                ))}
              </div>
            ) : (
              <p className="font-body text-muted-foreground">No hay citas anteriores.</p>
            )}
          </section>
        </TabsContent>
        <TabsContent value="calendar">
            <div className="md:grid md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                            modifiers={{ scheduled: appointments.filter(a => a.status === "Scheduled").map(a => new Date(a.date)) }}
                            modifiersClassNames={{ scheduled: 'bg-primary/20 rounded-full' }}
                            locale={es} // Corregido: usar el objeto de locale importado
                        />
                    </CardContent>
                </Card>
                <div className="mt-6 md:mt-0">
                    <h3 className="text-xl font-headline mb-4 text-foreground">
                        Citas para {selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'fecha seleccionada'}
                    </h3>
                    {appointmentsForSelectedDate.length > 0 ? (
                        <div className="space-y-4">
                        {appointmentsForSelectedDate.map((appointment) => (
                            <AppointmentListItem key={appointment.id} appointment={appointment} onEdit={handleEditAppointment} onCancel={handleCancelAppointment} />
                        ))}
                        </div>
                    ) : (
                        <p className="font-body text-muted-foreground">No hay citas para esta fecha.</p>
                    )}
                </div>
            </div>
        </TabsContent>
      </Tabs>
       {/* This ensures the dialog opens when selectedAppointment is set for editing */}
      {selectedAppointment && (
        <ScheduleAppointmentDialog
          appointmentToEdit={selectedAppointment}
          onAppointmentScheduled={handleAppointmentScheduled}
          triggerButton={<span />} // Hidden trigger, dialog controlled by selectedAppointment
        />
      )}
    </div>
  );
}
