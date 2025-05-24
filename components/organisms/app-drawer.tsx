"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AppDrawer() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Life Reboot</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
              isActive("/dashboard") &&
                !isActive("/dashboard/analytics") &&
                !isActive("/dashboard/history") &&
                !isActive("/dashboard/settings")
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/analytics"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
              isActive("/dashboard/analytics") ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/history"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
              isActive("/dashboard/history") ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
          >
            History
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
              isActive("/dashboard/settings") ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
          >
            Settings
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
