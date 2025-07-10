"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/pokemons")) return "Pokémons";
  if (pathname.startsWith("/users")) return "Users";
  if (pathname.startsWith("/profiles")) return "Profiles";
  if (pathname.startsWith("/large-table")) return "Large Table";
  if (pathname.startsWith("/analytics")) return "Analytics";
  return "Admin Console";
};

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-2 p-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
