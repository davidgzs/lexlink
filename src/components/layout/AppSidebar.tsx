"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, MessagesSquare, CalendarClock, FileArchive, PenSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/messages', label: 'Secure Messaging', icon: MessagesSquare },
  { href: '/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/documents', label: 'Documents & E-Sign', icon: FileArchive },
  // { href: '/e-signature', label: 'E-Signature', icon: PenSquare }, // Combined with Documents
];

interface AppSidebarProps {
  className?: string;
  isMobile?: boolean;
}

export default function AppSidebar({ className, isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: typeof navItems[0]) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        pathname === href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
        isMobile ? "text-lg" : "text-base"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isMobile && label}
      {isMobile && <span className="font-medium">{label}</span>}
    </Link>
  );

  const NavLinkCollapsed = ({ href, label, icon: Icon }: typeof navItems[0]) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:h-9 md:w-9",
               pathname === href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-body bg-popover text-popover-foreground">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );


  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2", className)}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl">Lex Connect</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function AppSidebarNavItems() {
    const pathname = usePathname();
    return (
         <>
            {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-4 px-2.5 py-2 rounded-lg transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
                    "text-lg"
                )}
            >
                <item.icon className="h-5 w-5" />
                {item.label}
            </Link>
            ))}
        </>
    );
}
