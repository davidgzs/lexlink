
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar, { AppSidebarNavItems } from '@/components/layout/AppSidebar';
import { mockUserProfile } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = mockUserProfile; // In a real app, this would come from auth context

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <AppSidebar userRole={user.role} />
      </div>
      <div className="flex flex-col">
        <AppHeader user={user} sidebarNavItems={<AppSidebarNavItems userRole={user.role} />} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
         <ScrollArea className="h-full">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
