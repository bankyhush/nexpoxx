// DHeader.tsx

"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";
import { Bell, Globe, Headphones, Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import LogoutButton from "./DLogout";

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
];

export const DashboardHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const { data: user, isLoading } = useUser();
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-3 py-2 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-mytextcolor hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3 text-white">
                <button className="p-2 bg-zinc-800 rounded-full">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-2 bg-zinc-800 rounded-full">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="p-2 bg-zinc-800 rounded-full">
                  <Headphones className="h-4 w-4" />
                </button>
                <button className="p-2 bg-zinc-800 rounded-full">
                  <Globe className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-mytextcolor hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center items-center w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <button className="text-white flex items-center space-x-1 bg-zinc-800 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 bg-zinc-700 rounded-full"></div>
                  <span className="text-sm">
                    {isLoading ? "Loading..." : user?.fullName}
                  </span>
                </button>
                <LogoutButton />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
