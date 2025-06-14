
"use client";

import { useState, useEffect } from 'react';
import { mockAppointments, mockUsers, mockCases } from '@/lib/mockData';
import type { Appointment, UserAppRole, UserProfile, Case } from '@/types';
import AppointmentListItem from '@/components/appointments/AppointmentListItem';
import ScheduleAppointmentDialog from '@/components/appointments/ScheduleAppointmentDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from '@/components/ui/card';
import { es } from 'date-fns/locale'; 
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
    const name = localStorage.getItem('loggedInUserName');
    const email = localStorage.getItem('loggedInUserEmail');
    const avatar = localStorage.getItem('loggedInUserAvatar');
    const id = localStorage.getItem('loggedInUserId'); // Assuming ID is stored

    if (role && name && email && id) {
      setCurrentUserProfile({
        id: id,
        name: name,
        email: email,
        role: role,
        avatarUrl: avatar || `https://placehold.co/100x100.png?text=${name.substring(0,1)}`,
      });
    }
  }, []);

  useEffect(() => {
    if (currentUserProfile) {
      if (currentUserProfile.role === 'Cliente' || currentUserProfile.role === 'Abogado') {
        setFilteredAppointments(allAppointments.filter(a => a.participants.includes(currentUserProfile.name)));
      } else { // Gerente, Administrador
        setFilteredAppointments(allAppointments);
      }
    } else {
      setFilteredAppointments(allAppointments);
    }
  }, [currentUserProfile, allAppointments]);


  const handleAppointmentScheduled = (appointment: Appointment) => {
    setAllAppointments(prev => {
      const existingIndex = prev.findIndex(a => a.id === appointment.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = appointment;
        return updated;
      }
      return [...prev, appointment];
    });
    setSelectedAppointment(null); 
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAllAppointments(prev => prev.map(app => app.id === appointmentId ? {...app, status: "Cancelada"} : app));
  };

  const upcomingAppointments = filteredAppointments.filter(a => new Date(a.date) >= new Date() && a.status === 'Programada').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAppointments = filteredAppointments.filter(a => new Date(a.date) < new Date() || a.status !== 'Programada').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const appointmentsForSelectedDate = filteredAppointments.filter(
    (appointment) =>
      selectedDate &&
      new Date(appointment.date).toDateString() === selectedDate.toDateString() &&
      appointment.status === 'Programada'
  );

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary">Citas</h1>
        <ScheduleAppointmentDialog
          appointmentToEdit={selectedAppointment}
          onAppointmentScheduled={handleAppointmentScheduled}
          currentUser={currentUserProfile}
          users={mockUsers}
          cases={mockCases}
          triggerButton={
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Programar Nueva Cita
              </Button>
          }
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
              <p className="font-body text-muted-foreground">No hay próximas citas que coincidan con tu perfil.</p>
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
              <p className="font-body text-muted-foreground">No hay citas anteriores que coincidan con tu perfil.</p>
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
                            modifiers={{ scheduled: filteredAppointments.filter(a => a.status === "Programada").map(a => new Date(a.date)) }}
                            modifiersClassNames={{ scheduled: 'bg-primary/20 rounded-full' }}
                            locale={es}
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
      {/* This ensures the dialog can still be opened for editing even if the main trigger isn't used */}
      {selectedAppointment && (
         <ScheduleAppointmentDialog
            appointmentToEdit={selectedAppointment}
            onAppointmentScheduled={handleAppointmentScheduled}
            currentUser={currentUserProfile}
            users={mockUsers}
            cases={mockCases}
            triggerButton={<span style={{display: 'none'}} />} // Hidden trigger for programmatic opening
        />
      )}
    </div>
  );
}
