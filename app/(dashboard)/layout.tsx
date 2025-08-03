// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { DashboardHeader } from "./DHeader";
import { DashboardFooter } from "./DFooter";
import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | MyApp",
  description: "Manage your profile, wallet, and settings in your dashboard.",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader />
      <main className="pt-20 bg-gray-800/60">{children}</main>
      <DashboardFooter />
    </>
  );
}
