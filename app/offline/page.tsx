import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wifi } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <Wifi className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">You're Offline</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          You appear to be offline. Please check your internet connection and try again.
        </p>
        <Button asChild>
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}
