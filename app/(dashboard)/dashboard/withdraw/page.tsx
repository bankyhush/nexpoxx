// app/dashboard/withdraw/page.tsx
import { redirect } from "next/navigation";

export default function WithdrawRedirect() {
  redirect("/dashboard"); // ⏩ Instant server-side redirect
}
