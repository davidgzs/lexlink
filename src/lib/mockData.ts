
import type {
  UserProfile,
  Case,
  Appointment,
  Message,
  Conversation,
  Document,
  Notification,
  UserAppRole,
  CaseStatus,
  CaseState,
  AppointmentType,
  DocumentStatus,
} from '@/types';

export const mockUsers: UserProfile[] = [
  {
    id: 'user_juan_perez',
    name: 'Juan Pérez',
    email: 'user@example.com',
    role: 'Cliente',
    avatarUrl: 'https://placehold.co/100x100.png?text=JP',
    isActive: true,
  },
  {
    id: 'attorney_juana_garcia',
    name: 'Juana García',
    email: 'abogado@example.com',
    role: 'Abogado',
    avatarUrl: 'https://placehold.co/100x100.png?text=JG',
    isActive: true,
  },
  {
    id: 'client_roberto_sanz',
    name: 'Roberto "Beto" Sanz',
    email: 'beto.sanz@example.net',
    role: 'Cliente',
    isActive: true,
    avatarUrl: 'https://placehold.co/100x100.png?text=RS'
  },
  {
    id: 'attorney_miguel_torres',
    name: 'Miguel Torres',
    email: 'miguel.torres@example.net',
    role: 'Abogado',
    isActive: true,
    avatarUrl: 'https://placehold.co/100x100.png?text=MT'
  },
  {
    id: 'client_carlos_fernandez',
    name: 'Carlos Fernández',
    email: 'carlos.fdz@example.net',
    role: 'Cliente',
    isActive: true,
    avatarUrl: 'https://placehold.co/100x100.png?text=CF'
  },
  {
    id: 'client_diana_jimenez',
    name: 'Diana Jiménez',
    email: 'diana.jimenez@example.net',
    role: 'Cliente',
    isActive: true,
    avatarUrl: 'https://placehold.co/100x100.png?text=DJ'
  },
  {
    id: 'manager_user',
    name: 'Gerente User',
    email: 'gerente@example.com',
    role: 'Gerente',
    avatarUrl: 'https://placehold.co/100x100.png?text=G',
    isActive: true,
  },
  {
    id: 'admin_user',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrador',
    avatarUrl: 'https://placehold.co/100x100.png?text=A',
    isActive: true,
  },
  {
    id: 'user_david_gonzalez',
    name: 'David González',
    email: 'david.gonzalez@example.com',
    role: 'Cliente',
    isActive: false,
    avatarUrl: 'https://placehold.co/100x100.png?text=DG',
  },
  {
    id: 'attorney_angela_diaz',
    name: 'Ángela Díaz',
    email: 'angela.diaz@example.com',
    role: 'Abogado',
    isActive: false,
    avatarUrl: 'https://placehold.co/100x100.png?text=AD',
  },
];

export const mockUserProfile: UserProfile = mockUsers.find(u => u.role === 'Cliente' && u.isActive) || mockUsers[0];


export const mockCases: Case[] = [
  {
    id: 'CASO001',
    caseNumber: 'LEX-2023-001',
    clientName: 'Juan Pérez',
    status: 'Judicial',
    state: 'Abierto',
    lastUpdate: '2023-10-26',
    description: 'Caso de divorcio con litigio, actualmente en fase de presentación de pruebas. Se espera la vista oral en los próximos meses. Requiere seguimiento cercano de documentación aportada por la parte contraria.',
    attorneyAssigned: 'Juana García',
  },
  {
    id: 'CASO002',
    caseNumber: 'LEX-2023-002',
    clientName: 'Roberto "Beto" Sanz',
    status: 'Administrativo',
    state: 'Abierto',
    lastUpdate: '2023-11-15',
    description: 'Reclamación administrativa por multa de tráfico indebida. Se han presentado alegaciones y se está a la espera de resolución por parte del organismo competente.',
    attorneyAssigned: 'Miguel Torres',
  },
  {
    id: 'CASO003',
    caseNumber: 'LEX-2023-003',
    clientName: 'Juan Pérez',
    status: 'Judicial',
    state: 'Cerrado',
    lastUpdate: '2023-09-01',
    description: 'Demanda por incumplimiento contractual. Sentencia favorable obtenida y ejecución completada. Caso archivado.',
    attorneyAssigned: 'Juana García',
  },
  {
    id: 'CASO004',
    caseNumber: 'LEX-2024-001',
    clientName: 'Carlos Fernández',
    status: 'Judicial',
    state: 'Abierto',
    lastUpdate: '2024-03-10',
    description: 'Procedimiento de desahucio por impago de alquiler. Se ha notificado la demanda al inquilino y se está a la espera de la fecha para el lanzamiento.',
    attorneyAssigned: 'Juana García',
  },
  {
    id: 'CASO005',
    caseNumber: 'LEX-2024-002',
    clientName: 'Diana Jiménez',
    status: 'Administrativo',
    state: 'Cerrado',
    lastUpdate: '2024-02-20',
    description: 'Solicitud de licencia de apertura para local comercial. Licencia concedida y documentación finalizada.',
    attorneyAssigned: 'Miguel Torres',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'APP001',
    title: 'Revisión Documentación Divorcio',
    type: 'Presencial',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    time: '10:00 AM',
    participants: ['Juan Pérez', 'Juana García'],
    status: 'Programada',
    caseId: 'CASO001',
  },
  {
    id: 'APP002',
    title: 'Consulta Multa Tráfico',
    type: 'Videoconferencia',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    time: '04:30 PM',
    participants: ['Roberto "Beto" Sanz', 'Miguel Torres'],
    status: 'Programada',
    caseId: 'CASO002',
  },
  {
    id: 'APP003',
    title: 'Firma Documentos Finales',
    type: 'Presencial',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    time: '11:00 AM',
    participants: ['Juan Pérez', 'Juana García'],
    status: 'Completada',
    caseId: 'CASO003',
  },
  {
    id: 'APP004',
    title: 'Consulta Escrita - Desahucio',
    type: 'Consulta Escrita',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    time: 'N/A',
    participants: ['Carlos Fernández', 'Juana García'],
    status: 'Programada',
    caseId: 'CASO004',
  },
   {
    id: 'APP005',
    title: 'Llamada de seguimiento caso',
    type: 'Videoconferencia',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    time: '09:30 AM',
    participants: ['Diana Jiménez', 'Miguel Torres'],
    status: 'Cancelada',
    caseId: 'CASO005',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'CONV001',
    clientName: 'Juan Pérez',
    attorneyName: 'Juana García',
    lastMessagePreview: 'Perfecto, nos vemos el martes entonces.',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    unreadCount: 0,
    avatarUrl: mockUsers.find(u=>u.name === 'Juan Pérez')?.avatarUrl,
  },
  {
    id: 'CONV002',
    clientName: 'Roberto "Beto" Sanz',
    attorneyName: 'Miguel Torres',
    lastMessagePreview: '¿Podrías enviarme la copia de la multa de nuevo?',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 2,
    avatarUrl: mockUsers.find(u=>u.name === 'Roberto "Beto" Sanz')?.avatarUrl,
  },
  {
    id: 'CONV003',
    clientName: 'Carlos Fernández',
    attorneyName: 'Juana García',
    lastMessagePreview: 'Entendido, gracias por la aclaración.',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
    avatarUrl: mockUsers.find(u=>u.name === 'Carlos Fernández')?.avatarUrl,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'MSG001',
    conversationId: 'CONV001',
    senderId: mockUsers.find(u => u.name === 'Juana García')?.id || 'attorney_juana_garcia',
    senderName: 'Juana García',
    content: 'Hola Juan, te confirmo que nuestra cita para el próximo martes es a las 10:00 para revisar toda la documentación.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: 'MSG002',
    conversationId: 'CONV001',
    senderId: mockUsers.find(u => u.name === 'Juan Pérez')?.id || 'user_juan_perez',
    senderName: 'Juan Pérez',
    content: 'Perfecto, nos vemos el martes entonces.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 'MSG003',
    conversationId: 'CONV002',
    senderId: mockUsers.find(u => u.name === 'Roberto "Beto" Sanz')?.id || 'client_roberto_sanz',
    senderName: 'Roberto "Beto" Sanz',
    content: 'Buenos días Miguel, tengo una duda sobre la última notificación.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'MSG004',
    conversationId: 'CONV002',
    senderId: mockUsers.find(u => u.name === 'Roberto "Beto" Sanz')?.id || 'client_roberto_sanz',
    senderName: 'Roberto "Beto" Sanz',
    content: '¿Podrías enviarme la copia de la multa de nuevo?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'MSG005',
    conversationId: 'CONV003',
    senderId: mockUsers.find(u => u.name === 'Juana García')?.id || 'attorney_juana_garcia',
    senderName: 'Juana García',
    content: 'Estimado Carlos, le informo que ya hemos recibido respuesta del juzgado.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
  },
  {
    id: 'MSG006',
    conversationId: 'CONV003',
    senderId: mockUsers.find(u => u.name === 'Carlos Fernández')?.id || 'client_carlos_fernandez',
    senderName: 'Carlos Fernández',
    content: 'Entendido, gracias por la aclaración.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'DOC001',
    name: 'Contrato de Arras.pdf',
    caseId: 'CASO001',
    status: 'Firmado',
    uploadedDate: '2023-07-15',
    version: '1.0',
    url: '#',
  },
  {
    id: 'DOC002',
    name: 'Poder General para Pleitos.docx',
    caseId: 'CASO001',
    status: 'Pendiente de Firma',
    uploadedDate: '2023-10-20',
    version: '1.1',
    url: '#',
  },
  {
    id: 'DOC003',
    name: 'Alegaciones a Multa.pdf',
    caseId: 'CASO002',
    status: 'Completado',
    uploadedDate: '2023-11-01',
    version: '2.0',
    url: '#',
  },
  {
    id: 'DOC004',
    name: 'Sentencia de Divorcio.pdf',
    caseId: 'CASO003',
    status: 'Completado',
    uploadedDate: '2023-08-20',
    version: 'final',
    url: '#',
  },
  {
    id: 'DOC005',
    name: 'Escrito de Demanda de Desahucio.pdf',
    caseId: 'CASO004',
    status: 'Requiere Revisión',
    uploadedDate: '2024-03-05',
    version: '0.9 Draft',
    url: '#',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'NOTIF001',
    title: 'Nuevo mensaje de Juana García',
    description: 'Tienes un nuevo mensaje en tu conversación del Caso LEX-2023-001.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    link: '/messages',
  },
  {
    id: 'NOTIF002',
    title: 'Documento pendiente de firma',
    description: 'El documento "Poder General para Pleitos.docx" requiere tu firma.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    link: '/documents',
  },
  {
    id: 'NOTIF003',
    title: 'Cita reprogramada',
    description: 'Tu cita "Consulta Multa Tráfico" ha sido confirmada para una nueva fecha.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: true,
    link: '/appointments',
  },
  {
    id: 'NOTIF004',
    title: 'Actualización del caso LEX-2023-002',
    description: 'Se ha añadido nueva información al expediente de tu caso.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
    link: '/dashboard', // or a specific case detail page if available
  },
];
