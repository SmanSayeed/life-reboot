import { ResetPasswordForm } from "@/components/organisms/reset-password-form"
import { NavBar } from "@/components/organisms/nav-bar"
import { Footer } from "@/components/organisms/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Life Reboot",
  description: "Reset your Life Reboot account password",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <ResetPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
