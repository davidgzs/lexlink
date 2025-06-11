
export type CaseStatus = "Administrative" | "Judicial"; // Represents the TYPE of case
export type CaseState = "Abierto" | "Cerrado"; // Represents if the case is Open or Closed

export interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  status: CaseStatus; // This field stores "Administrative" or "Judicial"
  state: CaseState;   // This new field stores "Abierto" or "Cerrado"
  lastUpdate: string;
  description: string;
  attorneyAssigned?: string;
}

export type AppointmentType = "In-Person" | "Video Conference" | "Written Consultation";

export interface Appointment {
  id: string;
  title: string;
  type: AppointmentType;
  date: string;
  time: string;
  participants: string[];
  status: "Scheduled" | "Completed" | "Cancelled";
  caseId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'client' or 'attorneyId'
  senderName: string;
  content: string;
  timestamp: string;
  isOwnMessage?: boolean;
}

export interface Conversation {
  id: string;
  clientName: string;
  attorneyName: string;
  lastMessagePreview: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  avatarUrl?: string;
}

export type DocumentStatus = "Awaiting Signature" | "Signed" | "Requires Review" | "Completed";

export interface Document {
  id: string;
  name: string;
  caseId: string;
  status: DocumentStatus;
  uploadedDate: string;
  version: string;
  url?: string; // Placeholder for actual document URL
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export type UserAppRole = "Cliente" | "Abogado" | "Gerente" | "Administrador";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserAppRole;
  avatarUrl?: string;
}
