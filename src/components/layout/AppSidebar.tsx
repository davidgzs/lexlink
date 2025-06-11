
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, LayoutDashboard, MessagesSquare, CalendarClock, FileArchive, LogOut, Database, Users, Briefcase, Type, Activity } from 'lucide-react'; // Added Activity
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { UserProfile } from '@/types';


interface NavSubItem {
  href: string;
  label: string;
  icon?: React.ElementType; 
}
interface NavItem {
  href?: string; 
  label: string;
  icon: React.ElementType;
  subItems?: NavSubItem[];
  adminOnly?: boolean;
}

const navConfig: NavItem[] = [
  { href: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/messages', label: 'Mensajería Segura', icon: MessagesSquare },
  { href: '/appointments', label: 'Citas', icon: CalendarClock },
  { href: '/documents', label: 'Documentos y Firma', icon: FileArchive },
  { 
    label: 'Gestión de Datos', 
    icon: Database,
    adminOnly: true,
    subItems: [
      { href: '/admin/data', label: 'Expedientes', icon: Briefcase },
      { href: '/admin/roles', label: 'Roles', icon: Users },
      { href: '/admin/users', label: 'Usuarios', icon: Users },
      { href: '/admin/casetypes', label: 'Tipos de Expedientes', icon: Type },
      { href: '/admin/states', label: 'Estados', icon: Activity }, // Nueva entrada para Estados
    ]
  },
];


interface AppSidebarProps {
  className?: string;
  isMobile?: boolean; 
  userRole?: UserProfile['role'];
}

export default function AppSidebar({ className, userRole }: AppSidebarProps) {
  const pathname = usePathname();

  const getFilteredNavItems = (role?: UserProfile['role']) => {
    return navConfig.filter(item => !item.adminOnly || (item.adminOnly && role === 'Administrador'));
  };

  const currentNavItems = getFilteredNavItems(userRole);

  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2", className)}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl">LexLINK</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          <Accordion type="multiple" className="w-full">
            {currentNavItems.map((item) => (
              item.subItems ? (
                <AccordionItem value={item.label} key={item.label} className="border-none">
                  <AccordionTrigger 
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground hover:no-underline",
                       item.subItems.some(sub => pathname === sub.href || (pathname.startsWith(sub.href) && sub.href !== '/')) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-4">
                    <nav className="grid gap-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            pathname === subItem.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80",
                            "text-sm"
                          )}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          {!subItem.icon && <span className="w-4 h-4 block"></span>} 
                          {subItem.label}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              ) : item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
                    "text-base"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ) : null
            ))}
          </Accordion>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar Sesión
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface AppSidebarNavItemsProps {
  userRole?: UserProfile['role'];
}

export function AppSidebarNavItems({ userRole }: AppSidebarNavItemsProps) {
    const pathname = usePathname();
    const getFilteredNavItems = (role?: UserProfile['role']) => {
      return navConfig.filter(item => !item.adminOnly || (item.adminOnly && role === 'Administrador'));
    };
    const currentNavItems = getFilteredNavItems(userRole);

    return (
         <Accordion type="multiple" className="w-full">
            {currentNavItems.map((item) => (
               item.subItems ? (
                <AccordionItem value={item.label} key={item.label} className="border-none">
                  <AccordionTrigger 
                     className={cn(
                      "flex items-center gap-4 px-2.5 py-2 rounded-lg transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground hover:no-underline text-lg",
                       item.subItems.some(sub => pathname === sub.href || (pathname.startsWith(sub.href) && sub.href !== '/')) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-6">
                     <nav className="grid gap-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-lg",
                            pathname === subItem.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80"
                          )}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                           {!subItem.icon && <span className="w-4 h-4 block"></span>}
                          {subItem.label}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              ) : item.href ? (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-4 px-2.5 py-2 rounded-lg transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-lg",
                        pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
              ) : null
            ))}
        </Accordion>
    );
}

