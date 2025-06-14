
"use client"; // Required for useState and useEffect

import { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar, { AppSidebarNavItems } from '@/components/layout/AppSidebar';
import { mockUserProfile, mockUsers } from '@/lib/mockData'; // Import mockUsers
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserProfile, UserAppRole } from '@/types';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUserProfile); // Default fallback

  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    
    if (storedUserId) {
      const userFromMock = mockUsers.find(u => u.id === storedUserId);
      if (userFromMock) {
        setCurrentUser(userFromMock);
      } else {
        // Fallback if ID is stale or not in mockUsers, try to reconstruct or use default
        const storedRole = localStorage.getItem('loggedInUserRole') as UserAppRole | null;
        const storedName = localStorage.getItem('loggedInUserName');
        const storedEmail = localStorage.getItem('loggedInUserEmail');
        const storedAvatar = localStorage.getItem('loggedInUserAvatar');

        if (storedRole && storedName && storedEmail) {
          setCurrentUser({
            id: storedUserId, // Keep original ID
            name: storedName,
            email: storedEmail,
            role: storedRole,
            avatarUrl: storedAvatar || `https://placehold.co/100x100.png?text=${storedName.substring(0,1)}`,
          });
        } else {
          setCurrentUser(mockUserProfile); // Absolute fallback
        }
      }
    } else {
      // Fallback to default mock user if no ID in localStorage
      setCurrentUser(mockUserProfile);
    }
  }, []);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <AppSidebar userRole={currentUser.role} />
      </div>
      <div className="flex flex-col">
        <AppHeader user={currentUser} sidebarNavItems={<AppSidebarNavItems userRole={currentUser.role} />} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
         <ScrollArea className="h-full">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
