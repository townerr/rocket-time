"use client";

import Link from "next/link";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
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
  CogIcon,
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
    <nav className="sticky top-0 z-50 bg-brand-gradient shadow-brand">
      <div className="container mx-auto flex h-[4.25rem] items-center justify-between px-4">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <RocketIcon />
          <span className="text-lg font-bold text-white transition-colors duration-300 hover:text-white/90">
            RocketTime
          </span>
        </Link>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <NavigationMenu className="hidden md:block">
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <Link href="/timesheet" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "text-sm font-medium text-white transition-colors",
                          "hover:bg-white/20",
                          "rounded-lg px-3.5 py-2.5",
                        )}
                      >
                        Timesheet
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {session.user.isManager && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="rounded-lg text-white hover:bg-white/20 hover:text-white"
                        >
                          Manager <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-border/50 bg-card/95 backdrop-blur-md">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/manager/approvals"
                            className="flex items-center gap-2"
                          >
                            <ClipboardCheck className="h-4 w-4 text-primary" />
                            Approvals
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/manager/employees"
                            className="flex items-center gap-2"
                          >
                            <Users2 className="h-4 w-4 text-primary" />
                            Employee Management
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/manager/settings"
                            className="flex items-center gap-2"
                          >
                            <CogIcon className="h-4 w-4 text-primary" />
                            Timesheet Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/manager/analytics"
                            className="flex items-center gap-2"
                          >
                            <BarChart2 className="h-4 w-4 text-primary" />
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
                <DropdownMenuTrigger className="flex items-center gap-1 transition-opacity hover:opacity-80">
                  <Avatar className="h-8 w-8 ring-2 ring-white/30">
                    <AvatarImage src={session.user.image ?? undefined} />
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-border/50 bg-card/95 backdrop-blur-md">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-primary" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/balances"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-primary" />
                      Balances
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/history"
                      className="flex items-center gap-2"
                    >
                      <History className="h-4 w-4 text-primary" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              variant="secondary"
              className="bg-white text-primary shadow-sm hover:bg-white/90"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
