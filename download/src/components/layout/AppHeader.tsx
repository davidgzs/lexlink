
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, Scale, Settings, LogOut } from 'lucide-react';
import type { UserProfile } from '@/types';
import NotificationDropdown from '@/components/notifications/NotificationDropdown'; 

interface AppHeaderProps {
  user: UserProfile;
  sidebarNavItems: React.ReactNode; // Will be AppSidebarNavItems with userRole passed
}

export default function AppHeader({ user, sidebarNavItems }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Alternar Menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs pt-12 bg-sidebar text-sidebar-foreground">
          <nav className="grid gap-6 text-lg font-medium">
            {/* sidebarNavItems already includes userRole through AppLayout */}
            {sidebarNavItems}
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="flex items-center gap-2 sm:hidden">
        <Scale className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl text-primary">LexLINK</span>
      </div>

      <div className="relative ml-auto flex flex-1 md:grow-0 items-center gap-2">
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || "https://placehold.co/32x32.png"} alt={user.name} data-ai-hint="person avatar"/>
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-body">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
