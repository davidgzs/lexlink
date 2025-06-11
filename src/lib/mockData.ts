
import type { Case, Appointment, Message, Document, Notification, Conversation, UserProfile } from '@/types';

export const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Juan Pérez', // Changed from John Doe
  email: 'juan.perez@example.com', // Changed from john.doe@example.com
  role: 'Client',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export const mockCases: Case[] = [
  { id: 'C001', caseNumber: 'LEX-2023-001', clientName: 'Juan Pérez', status: 'Judicial', lastUpdate: '2023-10-26', description: 'Litigio civil sobre disputa de propiedad.', attorneyAssigned: 'Juana García' }, // Client: Juan Pérez (was Alice Wonderland), Attorney: Juana García (was Jane Smith)
  { id: 'C002', caseNumber: 'LEX-2023-002', clientName: 'Roberto "Beto" Sanz', status: 'Administrative', lastUpdate: '2023-11-05', description: 'Constitución y registro de empresa.', attorneyAssigned: 'Miguel Torres' }, // Client: Roberto "Beto" Sanz (was Bob The Builder), Attorney: Miguel Torres (was Mike Ross)
  { id: 'C003', caseNumber: 'LEX-2023-003', clientName: 'Carlos Fernández', status: 'Appeal', lastUpdate: '2023-11-15', description: 'Recurso sobre una sentencia anterior relativa a obligaciones contractuales.', attorneyAssigned: 'Juana García' }, // Client: Carlos Fernández (was Charlie Brown), Attorney: Juana García (was Jane Smith)
  { id: 'C004', caseNumber: 'LEX-2023-004', clientName: 'Diana Jiménez', status: 'Closed', lastUpdate: '2023-09-30', description: 'Reclamación de propiedad intelectual resuelta con éxito.', attorneyAssigned: 'Miguel Torres' }, // Client: Diana Jiménez (was Diana Prince), Attorney: Miguel Torres (was Mike Ross)
];

export const mockAppointments: Appointment[] = [
  { id: 'A001', title: 'Consulta Inicial', type: 'Video Conference', date: '2023-11-20', time: '10:00 AM', participants: ['Juan Pérez', 'Juana García'], status: 'Scheduled', caseId: 'C001' }, // Participants updated
  { id: 'A002', title: 'Revisión de Documentos', type: 'In-Person', date: '2023-11-22', time: '02:30 PM', participants: ['Roberto "Beto" Sanz', 'Miguel Torres'], status: 'Scheduled', caseId: 'C002' }, // Participants updated
  { id: 'A003', title: 'Reunión de Estrategia', type: 'Video Conference', date: '2023-11-01', time: '11:00 AM', participants: ['Carlos Fernández', 'Juana García'], status: 'Completed', caseId: 'C003' }, // Participants updated
];

export const mockConversations: Conversation[] = [
  { id: 'CONV001', clientName: 'Juan Pérez', attorneyName: 'Juana García', lastMessagePreview: 'Sí, enviaré los documentos al final del día.', lastMessageTimestamp: '2023-11-15T10:30:00Z', unreadCount: 2, avatarUrl: 'https://placehold.co/40x40.png' }, // Names updated
  { id: 'CONV002', clientName: 'Roberto "Beto" Sanz', attorneyName: 'Miguel Torres', lastMessagePreview: '¿Podemos reprogramar nuestra reunión?', lastMessageTimestamp: '2023-11-14T15:00:00Z', unreadCount: 0, avatarUrl: 'https://placehold.co/40x40.png' }, // Names updated
];

export const mockMessages: Message[] = [
  // Conversation with Juan Pérez (mockUserProfile) and Juana García
  { id: 'M001', conversationId: 'CONV001', senderId: 'attorney_juana_garcia', senderName: 'Juana García', content: 'Hola Juan, adjunto el borrador. Dime qué te parece.', timestamp: '2023-11-15T09:00:00Z' }, // senderId and senderName updated
  { id: 'M002', conversationId: 'CONV001', senderId: `client_${mockUserProfile.name.toLowerCase().replace(' ','_')}`, senderName: mockUserProfile.name, content: 'Gracias, Juana. Lo revisaré hoy.', timestamp: '2023-11-15T09:15:00Z' }, // senderId and senderName now dynamically use mockUserProfile (Juan Pérez)
  { id: 'M003', conversationId: 'CONV001', senderId: 'attorney_juana_garcia', senderName: 'Juana García', content: 'Genial. Además, un recordatorio sobre nuestra videollamada el día 20.', timestamp: '2023-11-15T09:16:00Z' }, // senderId and senderName updated
  { id: 'M004', conversationId: 'CONV001', senderId: `client_${mockUserProfile.name.toLowerCase().replace(' ','_')}`, senderName: mockUserProfile.name, content: 'Sí, enviaré los documentos al final del día.', timestamp: '2023-11-15T10:30:00Z'}, // senderId and senderName now dynamically use mockUserProfile (Juan Pérez)
  
  // Conversation with Roberto "Beto" Sanz and Miguel Torres
  { id: 'M005', conversationId: 'CONV002', senderId: 'client_roberto_beto_sanz', senderName: 'Roberto "Beto" Sanz', content: 'Hola Miguel, tengo una pregunta rápida sobre el proceso de registro.', timestamp: '2023-11-14T14:30:00Z' }, // senderId and senderName updated
  { id: 'M006', conversationId: 'CONV002', senderId: 'attorney_miguel_torres', senderName: 'Miguel Torres', content: 'Claro Roberto, ¿cuál es?', timestamp: '2023-11-14T14:32:00Z' }, // senderId and senderName updated
  { id: 'M007', conversationId: 'CONV002', senderId: 'client_roberto_beto_sanz', senderName: 'Roberto "Beto" Sanz', content: '¿Podemos reprogramar nuestra reunión?', timestamp: '2023-11-14T15:00:00Z' }, // senderId and senderName updated
];


export const mockDocuments: Document[] = [
  { id: 'D001', name: 'Borrador Escritura Propiedad.pdf', caseId: 'C001', status: 'Requires Review', uploadedDate: '2023-11-10', version: 'v1.2' }, // Associated with Juan Pérez's case
  { id: 'D002', name: 'Plan de Negocio.docx', caseId: 'C002', status: 'Awaiting Signature', uploadedDate: '2023-11-12', version: 'v2.0' }, // Associated with Roberto "Beto" Sanz's case
  { id: 'D003', name: 'Escrito de Apelación_Final.pdf', caseId: 'C003', status: 'Signed', uploadedDate: '2023-10-20', version: 'v3.1' }, // Associated with Carlos Fernández's case
  { id: 'D004', name: 'Acuerdo Transaccional.pdf', caseId: 'C004', status: 'Completed', uploadedDate: '2023-09-25', version: 'v1.0' }, // Associated with Diana Jiménez's case
];

export const mockNotifications: Notification[] = [
  { id: 'N001', title: 'Nuevo Mensaje de Juana García', description: 'Tienes un nuevo mensaje sobre el caso LEX-2023-001.', timestamp: '2023-11-15T10:30:00Z', read: false, link: '/messages?conversationId=CONV001' }, // Title updated
  { id: 'N002', title: 'Recordatorio de Cita', description: 'Tu videoconferencia para "Consulta Inicial" es mañana a las 10:00 AM.', timestamp: '2023-11-19T09:00:00Z', read: false, link: '/appointments' },
  { id: 'N003', title: 'Documento Firmado', description: 'Escrito de Apelación_Final.pdf ha sido firmado correctamente.', timestamp: '2023-10-20T14:00:00Z', read: true, link: '/documents?docId=D003' },
  { id: 'N004', title: 'Actualización Estado del Caso', description: 'El estado del caso LEX-2023-003 cambió a "Apelación".', timestamp: '2023-11-15T08:00:00Z', read: true, link: '/dashboard' },
];
