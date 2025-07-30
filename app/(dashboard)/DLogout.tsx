"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth_api/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className=" cursor-pointer text-white flex items-center space-x-2 bg-red-800 rounded-full px-3 py-1.5"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Loading..." : "Logout"}
    </button>
  );
}
