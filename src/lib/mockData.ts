import type { Case, Appointment, Message, Document, Notification, Conversation, UserProfile } from '@/types';

export const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Client',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export const mockCases: Case[] = [
  { id: 'C001', caseNumber: 'LEX-2023-001', clientName: 'Alice Wonderland', status: 'Judicial', lastUpdate: '2023-10-26', description: 'Civil litigation regarding property dispute.', attorneyAssigned: 'Jane Smith' },
  { id: 'C002', caseNumber: 'LEX-2023-002', clientName: 'Bob The Builder', status: 'Administrative', lastUpdate: '2023-11-05', description: 'Business incorporation and registration.', attorneyAssigned: 'Mike Ross' },
  { id: 'C003', caseNumber: 'LEX-2023-003', clientName: 'Charlie Brown', status: 'Appeal', lastUpdate: '2023-11-15', description: 'Appeal on a previous ruling concerning contractual obligations.', attorneyAssigned: 'Jane Smith' },
  { id: 'C004', caseNumber: 'LEX-2023-004', clientName: 'Diana Prince', status: 'Closed', lastUpdate: '2023-09-30', description: 'Successfully resolved intellectual property claim.', attorneyAssigned: 'Mike Ross' },
];

export const mockAppointments: Appointment[] = [
  { id: 'A001', title: 'Initial Consultation', type: 'Video Conference', date: '2023-11-20', time: '10:00 AM', participants: ['Alice Wonderland', 'Jane Smith'], status: 'Scheduled', caseId: 'C001' },
  { id: 'A002', title: 'Document Review', type: 'In-Person', date: '2023-11-22', time: '02:30 PM', participants: ['Bob The Builder', 'Mike Ross'], status: 'Scheduled', caseId: 'C002' },
  { id: 'A003', title: 'Strategy Meeting', type: 'Video Conference', date: '2023-11-01', time: '11:00 AM', participants: ['Charlie Brown', 'Jane Smith'], status: 'Completed', caseId: 'C003' },
];

export const mockConversations: Conversation[] = [
  { id: 'CONV001', clientName: 'Alice Wonderland', attorneyName: 'Jane Smith', lastMessagePreview: 'Yes, I will send the documents by EOD.', lastMessageTimestamp: '2023-11-15T10:30:00Z', unreadCount: 2, avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'CONV002', clientName: 'Bob The Builder', attorneyName: 'Mike Ross', lastMessagePreview: 'Can we reschedule our meeting?', lastMessageTimestamp: '2023-11-14T15:00:00Z', unreadCount: 0, avatarUrl: 'https://placehold.co/40x40.png' },
];

export const mockMessages: Message[] = [
  { id: 'M001', conversationId: 'CONV001', senderId: 'attorney_jane_smith', senderName: 'Jane Smith', content: 'Hello Alice, please find the attached draft. Let me know your thoughts.', timestamp: '2023-11-15T09:00:00Z' },
  { id: 'M002', conversationId: 'CONV001', senderId: 'client_alice_wonderland', senderName: 'Alice Wonderland', content: 'Thanks, Jane. I will review it today.', timestamp: '2023-11-15T09:15:00Z', isOwnMessage: true },
  { id: 'M003', conversationId: 'CONV001', senderId: 'attorney_jane_smith', senderName: 'Jane Smith', content: 'Great. Also, a reminder about our upcoming video call on the 20th.', timestamp: '2023-11-15T09:16:00Z' },
   { id: 'M004', conversationId: 'CONV001', senderId: 'client_alice_wonderland', senderName: 'Alice Wonderland', content: 'Yes, I will send the documents by EOD.', timestamp: '2023-11-15T10:30:00Z', isOwnMessage: true },
  { id: 'M005', conversationId: 'CONV002', senderId: 'client_bob_builder', senderName: 'Bob The Builder', content: 'Hi Mike, I have a quick question about the registration process.', timestamp: '2023-11-14T14:30:00Z', isOwnMessage: true },
  { id: 'M006', conversationId: 'CONV002', senderId: 'attorney_mike_ross', senderName: 'Mike Ross', content: 'Sure Bob, what is it?', timestamp: '2023-11-14T14:32:00Z' },
   { id: 'M007', conversationId: 'CONV002', senderId: 'client_bob_builder', senderName: 'Bob The Builder', content: 'Can we reschedule our meeting?', timestamp: '2023-11-14T15:00:00Z', isOwnMessage: true },
];


export const mockDocuments: Document[] = [
  { id: 'D001', name: 'Property Deed Draft.pdf', caseId: 'C001', status: 'Requires Review', uploadedDate: '2023-11-10', version: 'v1.2' },
  { id: 'D002', name: 'Business Plan.docx', caseId: 'C002', status: 'Awaiting Signature', uploadedDate: '2023-11-12', version: 'v2.0' },
  { id: 'D003', name: 'Appeal Brief_Final.pdf', caseId: 'C003', status: 'Signed', uploadedDate: '2023-10-20', version: 'v3.1' },
  { id: 'D004', name: 'Settlement Agreement.pdf', caseId: 'C004', status: 'Completed', uploadedDate: '2023-09-25', version: 'v1.0' },
];

export const mockNotifications: Notification[] = [
  { id: 'N001', title: 'New Message from Jane Smith', description: 'You have a new message regarding case LEX-2023-001.', timestamp: '2023-11-15T10:30:00Z', read: false, link: '/messages?conversationId=CONV001' },
  { id: 'N002', title: 'Appointment Reminder', description: 'Your video conference for "Initial Consultation" is tomorrow at 10:00 AM.', timestamp: '2023-11-19T09:00:00Z', read: false, link: '/appointments' },
  { id: 'N003', title: 'Document Signed', description: 'Appeal Brief_Final.pdf has been successfully signed.', timestamp: '2023-10-20T14:00:00Z', read: true, link: '/documents?docId=D003' },
  { id: 'N004', title: 'Case Status Update', description: 'Case LEX-2023-003 status changed to "Appeal".', timestamp: '2023-11-15T08:00:00Z', read: true, link: '/dashboard' },
];
