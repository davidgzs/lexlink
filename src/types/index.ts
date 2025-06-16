
export type CaseStatus = "Administrativo" | "Judicial"; // Represents the BASE TYPE of case
export type CaseState = "Abierto" | "Cerrado"; // Represents if the case is Open or Closed

export interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  status: CaseStatus; // This field stores the base type: "Administrativo" or "Judicial"
  subtype?: string;   // This new optional field will hold names like "Civil", "Laboral", "Sanciones", etc.
  state: CaseState;
  lastUpdate: string;
  description: string;
  attorneyAssigned?: string;
}

export type AppointmentType = "Presencial" | "Videoconferencia" | "Consulta Escrita";

export interface Appointment {
  id: string;
  title: string;
  type: AppointmentType;
  date: string;
  time: string;
  participants: string[];
  status: "Programada" | "Completada" | "Cancelada";
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

export type DocumentStatus = "Pendiente de Firma" | "Firmado" | "Requiere Revisión" | "Completado";

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
  isActive?: boolean; // Added for logical deletion
}

//Prueba
