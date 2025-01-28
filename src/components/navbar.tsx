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
import { RocketIcon } from "~/components/icon";
import { cn } from "~/lib/utils";
import { ChevronDown } from "lucide-react";

export default function Navbar({ session }: { session: { user?: User } | null }) {
  return (
    <nav className="bg-black shadow-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <RocketIcon />
          <span className="font-bold text-lg text-white hover:text-purple-300 transition-colors duration-300">RocketTime</span>
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
                        "text-sm text-white font-medium transition-colors hover:text-black", "hover:bg-accent", "rounded-md px-3.5 py-2.5"
                      )}>
                        Timesheet
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white">
                        Manager <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/approvals">Approvals</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/employees">Employee Management</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/analytics">Analytics</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuList>
              </NavigationMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? undefined} />
                  </Avatar>
                  <ChevronDown className="text-white w-4 h-4 hover:animate-pulse" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/balances">Balances</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/history">History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive focus:bg-destructive/10"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default">
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}