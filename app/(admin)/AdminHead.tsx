"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Coins,
  DollarSign,
  Folder,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Signal,
  Sun,
  TrendingUp,
  Users,
  Vault,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminHeadPageProps {
  children: React.ReactNode;
}

const AdminHeadPage: React.FC<AdminHeadPageProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = [
    {
      href: "/admin",
      icon: <TrendingUp className="h-5 w-5 mr-3" />,
      label: "Overview",
    },
    {
      href: "/admin/users",
      icon: <Users className="h-5 w-5 mr-3" />,
      label: "User Management",
    },
    {
      href: "/admin/transactions",
      icon: <DollarSign className="h-5 w-5 mr-3" />,
      label: "Transactions",
    },
    {
      href: "/admin/spotcoin/coinlist",
      icon: <Coins className="h-5 w-5 mr-3" />,
      label: "Spot Coins",
    },
    {
      href: "/admin/copytrader",
      icon: <Signal className="h-5 w-5 mr-3" />,
      label: "Copy Trader",
    },
    {
      href: "/admin/plan",
      icon: <Folder className="h-5 w-5 mr-3" />,
      label: "Plan Subscription",
    },
    {
      href: "/admin/signal",
      icon: <Waves className="h-5 w-5 mr-3" />,
      label: "Signal Trades",
    },
    {
      href: "/admin/stake",
      icon: <Vault className="h-5 w-5 mr-3" />,
      label: "Staking",
    },
    {
      href: "/admin/security",
      icon: <Shield className="h-5 w-5 mr-3" />,
      label: "Security",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
      label: "System Settings",
    },
  ];

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 w-64 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-sm min-h-screen z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Menu
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`sticky top-0 z-40 border-b shadow-sm px-4 py-4 flex items-center justify-between ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1
              className={`text-xl sm:text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              OKX Admin
            </h1>
            <Badge className="bg-green-100 text-green-800 hidden sm:inline-flex">
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminHeadPage;
