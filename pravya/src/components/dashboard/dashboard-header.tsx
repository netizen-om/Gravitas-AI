"use client";

import { useState } from "react";
import {
  Menu,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileSidebar } from "./mobile-sidebar";
import { useSidebar } from "./sidebar-context";

interface DashboardHeaderProps {
  session: {
    user: {
      name: string;
      email: string;
      image?: string;
    };
  };
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const handleSignOut = () => {
    // Replace with actual NextAuth signOut
    console.log("Sign out");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex text-white hover:bg-neutral-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-neutral-900"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: Brand */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <h1 className="text-xl font-bold text-white">
              Pravya AI
              <div className="h-0.5 w-full bg-gradient-to-r from-white/20 to-transparent mt-1" />
            </h1>
          </div>

          {/* Right: User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user.image || "/placeholder.svg"}
                    alt={session.user.name}
                  />
                  <AvatarFallback className="bg-neutral-900 text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-neutral-950 border-neutral-800"
              align="end"
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{session.user.name}</p>
                  <p className="text-sm text-neutral-400">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuItem className="text-white hover:bg-neutral-900">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-neutral-900">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuItem
                className="text-white hover:bg-neutral-900"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        session={session}
      />
    </>
  );
}
