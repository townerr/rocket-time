"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "~/components/ui/navigation-menu";
import { RocketIcon } from "~/components/ui/Icon";
import { cn } from "~/lib/utils";
import { 
  ChevronDown,
  ClipboardCheck,
  Users2,
  BarChart2,
  UserCircle,
  Clock,
  History,
  LogOut,
  CogIcon
} from "lucide-react";

interface NavbarProps {
  session: {
    user?: User & {
      isManager?: boolean;
    };
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <RocketIcon />
          <span className="font-bold text-lg text-white hover:text-indigo-100 transition-colors duration-300">
            RocketTime
          </span>
        </Link>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <NavigationMenu className="hidden md:block">
                <NavigationMenuList className="gap-4">
                  <NavigationMenuItem>
                    <Link href="/timesheet" legacyBehavior passHref>
                      <NavigationMenuLink className={cn(
                        "text-sm text-white font-medium transition-colors",
                        "hover:bg-white/10",
                        "rounded-md px-3.5 py-2.5"
                      )}>
                        Timesheet
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {session.user.isManager && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="text-white hover:bg-white/10 hover:text-white"
                        >
                          Manager <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem asChild>
                          <Link href="/manager/approvals" className="flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4" />
                            Approvals
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/manager/employees" className="flex items-center gap-2">
                            <Users2 className="w-4 h-4" />
                            Employee Management
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/manager/settings" className="flex items-center gap-2">
                            <CogIcon className="w-4 h-4" />
                            Timesheet Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/manager/analytics" className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4" />
                            Analytics
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src={session.user.image ?? undefined} />
                  </Avatar>
                  <ChevronDown className="text-white w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/95 backdrop-blur-sm">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/balances" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Balances
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/history" className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              asChild 
              variant="outline" 
              className="border-white text-blue-600 hover:text-blue-800"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 