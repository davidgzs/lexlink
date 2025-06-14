
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, AppointmentType } from "@/types";
import { CalendarClock, Video, Users, FilePenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
}

const appointmentIcons: Record<AppointmentType, React.ElementType> = {
  "Presencial": Users,
  "Videoconferencia": Video,
  "Consulta Escrita": FilePenLine,
};

// appointmentTypeTranslations is no longer needed as appointment.type will be Spanish
// const appointmentTypeTranslations: Record<Appointment["type"], string> = {
//   "Presencial": "Presencial",
//   "Videoconferencia": "Videoconferencia",
//   "Consulta Escrita": "Consulta Escrita",
// };


export default function UpcomingAppointmentCard({ appointment }: UpcomingAppointmentCardProps) {
  const Icon = appointmentIcons[appointment.type];
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-md">{appointment.title}</CardTitle>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm text-muted-foreground">
          {new Date(appointment.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {appointment.time}
        </p>
        <p className="font-body text-xs text-muted-foreground">Tipo: {appointment.type}</p> {/* Directly use appointment.type */}
        {appointment.caseId && (
          <p className="font-body text-xs text-muted-foreground">Caso: {appointment.caseId}</p>
        )}
        <Link href="/appointments" className="mt-2 block">
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">Ver todas las citas</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
