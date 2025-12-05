import { redirect } from "next/navigation";
import { SideBar } from "../components/sidebar/SideNav";
import { checkUserRole } from "@/lib/auth/roles";


export default async function AdminLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const {authorized, user} = await checkUserRole(['admin']);

  if(!authorized){
    redirect('/auth');
  }
  return (
    <div className="flex min-h-screen">
      <SideBar/>
      <main className="flex-1 bg-[#fefaec] p-6">{children}</main>
    </div>
  );
}
