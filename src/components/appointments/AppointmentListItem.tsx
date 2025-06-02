import type { Appointment } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Users, FilePenLine, Edit, Trash2, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface AppointmentListItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointmentId: string) => void;
}

const appointmentIcons: Record<Appointment["type"], React.ElementType> = {
  "In-Person": Users,
  "Video Conference": Video,
  "Written Consultation": FilePenLine,
};

const statusColors: Record<Appointment["status"], string> = {
    Scheduled: "bg-blue-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
};

export default function AppointmentListItem({ appointment, onEdit, onCancel }: AppointmentListItemProps) {
  const Icon = appointmentIcons[appointment.type];
  const badgeColor = statusColors[appointment.status];
  const { toast } = useToast();

  const handleCancelConfirmation = () => {
    onCancel(appointment.id);
    toast({
      title: "Appointment Cancelled",
      description: `Appointment "${appointment.title}" has been cancelled.`,
    });
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg">{appointment.title}</CardTitle>
          <Badge className={`${badgeColor} text-white whitespace-nowrap`}>
            <Clock className="mr-1 h-3 w-3" />
            {appointment.status}
          </Badge>
        </div>
        <CardDescription className="font-body text-sm flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.type}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm">
          Date: {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
        </p>
        <p className="font-body text-sm text-muted-foreground">
          Participants: {appointment.participants.join(", ")}
        </p>
        {appointment.caseId && (
            <p className="font-body text-xs text-muted-foreground">Case: {appointment.caseId}</p>
        )}
      </CardContent>
      {appointment.status === "Scheduled" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(appointment)} className="font-body">
            <Edit className="mr-2 h-4 w-4" /> Reschedule
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="font-body">
                <Trash2 className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="font-body">
                  This action cannot be undone. This will permanently cancel your appointment: "{appointment.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">Keep Appointment</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelConfirmation} className="font-body">Confirm Cancellation</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
