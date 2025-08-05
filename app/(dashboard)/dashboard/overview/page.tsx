// app/dashboard/overview/page.tsx
import { redirect } from "next/navigation";

export default function OverviewRedirect() {
  redirect("/dashboard"); // ⏩ Instant server-side redirect
}
