
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Importa tu instancia de Firestore
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
    const role = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
    const name = localStorage.getItem('loggedInUserName');
    setCurrentUserRole(role);
    setCurrentUserName(name);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!currentUserRole || !currentUserName) {
         // Si no hay rol o nombre de usuario, esperar o manejar según la lógica de tu app.
         // Por ahora, si no hay usuario, no cargaremos nada o limpiaremos.
        if (!currentUserRole && !currentUserName && localStorage.getItem('loggedInUserRole')) {
          // Esto puede suceder brevemente al inicio si el localStorage tarda en leerse y setearse.
          // No hacemos nada hasta que currentUserRole y currentUserName estén listos.
        } else {
          setFilteredCases([]);
          setFilteredAppointments([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      // Fetch Cases
      try {
        const casesCollectionRef = collection(db, "cases");
        let casesQuery;

        if (currentUserRole === 'Cliente') {
          casesQuery = query(casesCollectionRef, where("clientName", "==", currentUserName), where("status", "!=", "Closed"));
        } else if (currentUserRole === 'Abogado') {
          casesQuery = query(casesCollectionRef, where("attorneyAssigned", "==", currentUserName), where("status", "!=", "Closed"));
        } else { // Gerente, Administrador
          casesQuery = query(casesCollectionRef, where("status", "!=", "Closed"));
        }
        
        const caseSnapshot = await getDocs(casesQuery);
        const fetchedCases: Case[] = [];
        caseSnapshot.forEach((doc) => {
          fetchedCases.push({ id: doc.id, ...doc.data() } as Case);
        });
        setFilteredCases(fetchedCases);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setFilteredCases([]); // Limpiar en caso de error
      }

      // Fetch Appointments
      try {
        const appointmentsCollectionRef = collection(db, "appointments");
        let appointmentsQuery;
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        if (currentUserRole === 'Cliente' || currentUserRole === 'Abogado') {
          appointmentsQuery = query(
            appointmentsCollectionRef,
            where("participants", "array-contains", currentUserName),
            where("date", ">=", today),
            where("status", "==", "Scheduled"),
            orderBy("date", "asc"),
            limit(3)
          );
        } else { // Gerente, Administrador
          appointmentsQuery = query(
            appointmentsCollectionRef,
            where("date", ">=", today),
            where("status", "==", "Scheduled"),
            orderBy("date", "asc"),
            limit(3)
          );
        }
        
        const appointmentSnapshot = await getDocs(appointmentsQuery);
        const fetchedAppointments: AppointmentType[] = [];
        appointmentSnapshot.forEach((doc) => {
          fetchedAppointments.push({ id: doc.id, ...doc.data() } as AppointmentType);
        });
        setFilteredAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setFilteredAppointments([]); // Limpiar en caso de error
      }
      
      setLoading(false);
    }

    fetchData();
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
