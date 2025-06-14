
"use client";

import { useState, useEffect } from 'react';
import { mockCases, mockAppointments } from '@/lib/mockData'; // Usar datos mock
import CaseCard from '@/components/dashboard/CaseCard';
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { UserAppRole, Case, Appointment as AppointmentType, CaseState } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const [currentUserRole, setCurrentUserRole] = useState<UserAppRole | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseStateFilter, setSelectedCaseStateFilter] = useState<CaseState | 'Todos'>('Abierto');

  const [abiertosCount, setAbiertosCount] = useState(0);
  const [cerradosCount, setCerradosCount] = useState(0);
  const [todosCount, setTodosCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
    const name = localStorage.getItem('loggedInUserName');
    setCurrentUserRole(role);
    setCurrentUserName(name);

    if (role === 'Administrador' || role === 'Gerente') {
      setSelectedCaseStateFilter('Todos');
    } else {
      setSelectedCaseStateFilter('Abierto');
    }
  }, []);

  useEffect(() => {
    if (currentUserRole && currentUserName) {
      setLoading(true);

      let userRelevantCases: Case[];
      if (currentUserRole === 'Cliente') {
        userRelevantCases = mockCases.filter(c => c.clientName === currentUserName);
      } else if (currentUserRole === 'Abogado') {
        userRelevantCases = mockCases.filter(c => c.attorneyAssigned === currentUserName);
      } else { // Gerente, Administrador
        userRelevantCases = [...mockCases];
      }

      // Calculate counts based on userRelevantCases
      setAbiertosCount(userRelevantCases.filter(c => c.state === 'Abierto').length);
      setCerradosCount(userRelevantCases.filter(c => c.state === 'Cerrado').length);
      setTodosCount(userRelevantCases.length);

      let stateFilteredCases: Case[];
      if (selectedCaseStateFilter === 'Abierto') {
        stateFilteredCases = userRelevantCases.filter(c => c.state === 'Abierto');
      } else if (selectedCaseStateFilter === 'Cerrado') {
        stateFilteredCases = userRelevantCases.filter(c => c.state === 'Cerrado');
      } else { // 'Todos'
        stateFilteredCases = userRelevantCases;
      }
      setFilteredCases(stateFilteredCases);

      let relevantAppointments: AppointmentType[];
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (currentUserRole === 'Cliente' || currentUserRole === 'Abogado') {
        relevantAppointments = mockAppointments.filter(
          (a) =>
            a.participants.includes(currentUserName) &&
            new Date(a.date) >= today &&
            a.status === 'Programada'
        );
      } else { // Gerente, Administrador
        relevantAppointments = mockAppointments.filter(
          (a) => new Date(a.date) >= today && a.status === 'Programada'
        );
      }
      relevantAppointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setFilteredAppointments(relevantAppointments.slice(0, 3));

      setLoading(false);
    } else if (!localStorage.getItem('loggedInUserRole')) {
      setLoading(false);
      setFilteredCases([]);
      setFilteredAppointments([]);
      setAbiertosCount(0);
      setCerradosCount(0);
      setTodosCount(0);
    }
  }, [currentUserRole, currentUserName, selectedCaseStateFilter]);

  if (loading && !(currentUserRole && currentUserName)) {
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline text-foreground">Expedientes</h2>
        </div>
        <Tabs value={selectedCaseStateFilter} onValueChange={(value) => setSelectedCaseStateFilter(value as CaseState | 'Todos')} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 md:w-[450px]">
            <TabsTrigger value="Abierto" className="font-body">Abiertos ({abiertosCount})</TabsTrigger>
            <TabsTrigger value="Cerrado" className="font-body">Cerrados ({cerradosCount})</TabsTrigger>
            <TabsTrigger value="Todos" className="font-body">Todos ({todosCount})</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedCaseStateFilter} className="mt-4">
            {loading && (currentUserRole && currentUserName) ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-3 font-body text-muted-foreground">Actualizando expedientes...</p>
                </div>
            ) : filteredCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            ) : (
              <p className="font-body text-muted-foreground text-center py-6">
                No hay expedientes que coincidan con los filtros seleccionados y tu perfil.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-headline mb-4 text-foreground">Próximas Citas</h2>
        {loading && (currentUserRole && currentUserName) ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-3 font-body text-muted-foreground">Actualizando citas...</p>
            </div>
        ) : filteredAppointments.length > 0 ? (
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

