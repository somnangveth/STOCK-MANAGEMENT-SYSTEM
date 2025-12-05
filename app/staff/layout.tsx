import { checkUserRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {authorized, user} = await checkUserRole(['staff', 'admin']);

  if(!authorized){
    redirect('/auth');
  }
  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
