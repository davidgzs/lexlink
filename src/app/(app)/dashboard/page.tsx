
"use client";

import { useState, useEffect } from 'react';
import { mockCases, mockAppointments } from '@/lib/mockData';
import CaseCard from '@/components/dashboard/CaseCard';
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import type { UserAppRole, Case, Appointment as AppointmentType } from '@/types';

export default function DashboardPage() {
  const [currentUserRole, setCurrentUserRole] = useState<UserAppRole | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentType[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
    const name = localStorage.getItem('loggedInUserName');
    setCurrentUserRole(role);
    setCurrentUserName(name);
  }, []);

  useEffect(() => {
    if (currentUserRole && currentUserName) {
      // Filter Cases
      const allActiveCases = mockCases.filter(c => c.status !== 'Closed');
      if (currentUserRole === 'Cliente') {
        setFilteredCases(allActiveCases.filter(c => c.clientName === currentUserName));
      } else if (currentUserRole === 'Abogado') {
        setFilteredCases(allActiveCases.filter(c => c.attorneyAssigned === currentUserName));
      } else { // Gerente, Administrador
        setFilteredCases(allActiveCases);
      }

      // Filter Appointments
      const allUpcomingAppointments = mockAppointments
        .filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

      if (currentUserRole === 'Cliente' || currentUserRole === 'Abogado') {
        setFilteredAppointments(allUpcomingAppointments.filter(a => a.participants.includes(currentUserName)));
      } else { // Gerente, Administrador
        setFilteredAppointments(allUpcomingAppointments);
      }
    } else {
      // Default to all if no user info (or clear them)
      setFilteredCases(mockCases.filter(c => c.status !== 'Closed'));
      setFilteredAppointments(
        mockAppointments
        .filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
      );
    }
  }, [currentUserRole, currentUserName]);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary">Panel de Control</h1>
        <Link href="/appointments#schedule">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Agendar Cita
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
