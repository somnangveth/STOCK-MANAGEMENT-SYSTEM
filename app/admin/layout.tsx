import { redirect } from "next/navigation";
import { checkUserRole } from "@/lib/auth/roles";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppSideBar } from "../components/sidebar/AdminNavLink";


export default async function AdminLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const {authorized, user} = await checkUserRole(['admin']);

  if(!authorized){
    redirect('/auth');
  }
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
