"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";


export function ModeToggle() {
  
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button  size="icon" className="cursor-pointer hover:bg-accent-foreground" onClick={toggleTheme}>
      <Sun
        className="h-[1.5rem] w-[1.5rem] transition-all dark:hidden"
      />
      <Moon
        className="h-[1.5rem] w-[1.5rem] hidden dark:block transition-all"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
