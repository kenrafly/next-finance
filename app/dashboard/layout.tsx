import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar (Always Visible) */}
      <Sidebar />
      {/* Dynamic Content Changes Here */}
      <div className="flex-1 ml-14 md:ml-52 overflow-y-auto h-screen p-4">
        {children}
      </div>
    </div>
  );
}
