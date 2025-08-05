// app/dashboard/Deposit/page.tsx
import { redirect } from "next/navigation";

export default function DepositRedirect() {
  redirect("/dashboard"); // ⏩ Instant server-side redirect
}
