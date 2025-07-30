// app/dashboard/layout.tsx
import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import AdminHeadPage from "./AdminHead";
import AdminFootPage from "./AdminFoot";

export const metadata = {
  title: "Admin App",
  description: "Administrator Panel.",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <>
      <AdminHeadPage>{children}</AdminHeadPage>
      <AdminFootPage />
    </>
  );
}
