import { SettingsTemplate } from "@/components/templates/settings-template"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Life Reboot",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return <SettingsTemplate />
}
