// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { DashboardHeader } from "./DHeader";
import { DashboardFooter } from "./DFooter";

export const metadata = {
  title: "Dashboard | MyApp",
  description: "Manage your profile, wallet, and settings in your dashboard.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="pt-20">
        {children}
        </main>
      <DashboardFooter />
    </>
  );
}
