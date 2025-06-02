import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from "@/types";
import { CalendarClock, Video, Users, FilePenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
}

const appointmentIcons: Record<Appointment["type"], React.ElementType> = {
  "In-Person": Users,
  "Video Conference": Video,
  "Written Consultation": FilePenLine,
};

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
          {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}
        </p>
        <p className="font-body text-xs text-muted-foreground">Type: {appointment.type}</p>
        {appointment.caseId && (
          <p className="font-body text-xs text-muted-foreground">Case: {appointment.caseId}</p>
        )}
        <Link href="/appointments" className="mt-2 block">
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">View all appointments</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
