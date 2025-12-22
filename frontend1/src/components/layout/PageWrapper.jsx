import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageWrapper({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1">
        <Navbar />

        <main className="pt-20 px-6 bg-slate-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
