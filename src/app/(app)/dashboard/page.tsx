import { mockCases, mockAppointments } from '@/lib/mockData';
import CaseCard from '@/components/dashboard/CaseCard';
import UpcomingAppointmentCard from '@/components/dashboard/UpcomingAppointmentCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const activeCases = mockCases.filter(c => c.status !== 'Closed');
  const upcomingAppointments = mockAppointments
    .filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-semibold text-primary">Dashboard</h1>
        <Link href="/appointments#schedule">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Schedule Appointment
          </Button>
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-headline mb-4 text-foreground">Active Cases</h2>
        {activeCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground">No active cases at the moment.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-headline mb-4 text-foreground">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map((appointment) => (
              <UpcomingAppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground">No upcoming appointments scheduled.</p>
        )}
      </section>
    </div>
  );
}
