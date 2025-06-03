
"use client";

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle } from "lucide-react";
import type { Notification } from "@/types";
import { mockNotifications } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev -1));
    // In a real app, you'd also call an API to update read status
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Alternar notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 font-body">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="p-0 h-auto text-xs">
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <DropdownMenuItem disabled>No hay notificaciones nuevas</DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className={`flex items-start gap-2 ${notification.read ? 'opacity-70' : 'font-medium'}`}>
                <div className="flex-shrink-0 mt-1">
                  {notification.read ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Bell className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-grow">
                  <Link href={notification.link || "#"} passHref>
                    <p className="text-sm leading-tight hover:underline">{notification.title}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground/70">{new Date(notification.timestamp).toLocaleString('es-ES')}</p>
                </div>
                {!notification.read && (
                   <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="p-1 h-auto text-xs">
                    Marcar leída
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
