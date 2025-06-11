
"use client";

import { useState, useEffect } from 'react';
import { mockCases, mockAppointments } from '@/lib/mockData'; // Usar datos mock
import CaseCard from '@/components/dashboard/CaseCard';
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { UserAppRole, Case, Appointment as AppointmentType } from '@/types';

export default function DashboardPage() {
  const [currentUserRole, setCurrentUserRole] = useState<UserAppRole | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el rol y nombre del usuario desde localStorage
    const role = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
    const name = localStorage.getItem('loggedInUserName');
    setCurrentUserRole(role);
    setCurrentUserName(name);
  }, []);

  useEffect(() => {
    // Filtrar datos mock basados en el usuario actual
    if (currentUserRole && currentUserName) {
      setLoading(true);

      // Simular una pequeña demora como si fuera una carga real
      // setTimeout(() => {
        // Filtrar Casos
        let relevantCases: Case[];
        if (currentUserRole === 'Cliente') {
          relevantCases = mockCases.filter(
            (c) => c.clientName === currentUserName && c.status !== 'Closed'
          );
        } else if (currentUserRole === 'Abogado') {
          relevantCases = mockCases.filter(
            (c) => c.attorneyAssigned === currentUserName && c.status !== 'Closed'
          );
        } else { // Gerente, Administrador
          relevantCases = mockCases.filter((c) => c.status !== 'Closed');
        }
        setFilteredCases(relevantCases);

        // Filtrar Citas
        let relevantAppointments: AppointmentType[];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar para comparar solo fechas

        if (currentUserRole === 'Cliente' || currentUserRole === 'Abogado') {
          relevantAppointments = mockAppointments.filter(
            (a) =>
              a.participants.includes(currentUserName) &&
              new Date(a.date) >= today &&
              a.status === 'Scheduled'
          );
        } else { // Gerente, Administrador
          relevantAppointments = mockAppointments.filter(
            (a) => new Date(a.date) >= today && a.status === 'Scheduled'
          );
        }
        // Ordenar y limitar citas
        relevantAppointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFilteredAppointments(relevantAppointments.slice(0, 3));

        setLoading(false);
      // }, 300); // Demora simulada opcional
    } else if (!localStorage.getItem('loggedInUserRole')) {
      // Si no hay usuario en localStorage (ej. no se ha iniciado sesión)
      setLoading(false);
      setFilteredCases([]);
      setFilteredAppointments([]);
    }
    // Si currentUserRole o currentUserName aún son null pero hay algo en localStorage,
    // el primer useEffect los establecerá y este useEffect se volverá a ejecutar.
    // Si no hay nada en localStorage, establecemos loading a false para evitar un spinner infinito.

  }, [currentUserRole, currentUserName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 font-body text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary">Panel de Control</h1>
        <Link href="/appointments#schedule">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Programar Cita
          </Button>
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-headline mb-4 text-foreground">Expedientes Casos Activos</h2>
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground">No hay casos activos que coincidan con tu perfil.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-headline mb-4 text-foreground">Próximas Citas</h2>
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <UpcomingAppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground">No hay próximas citas programadas que coincidan con tu perfil.</p>
        )}
      </section>
    </div>
  );
}
