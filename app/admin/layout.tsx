import { SideBar } from "./components/SideNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideBar/>
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
