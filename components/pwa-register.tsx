"use client"

import { useEffect, useState } from "react"
import { Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export default function PWARegister() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered: ", registration)
          })
          .catch((error) => {
            console.log("Service Worker registration failed: ", error)
          })
      })
    }

    // Handle PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPrompt(e)
      setIsInstallable(true)
      setShowToast(true)
    })
  }, [])

  const handleInstallClick = () => {
    if (!installPrompt) return

    // Show the install prompt
    installPrompt.prompt()

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      setInstallPrompt(null)
      setShowToast(false)
    })
  }

  return (
    <ToastProvider>
      {showToast && (
        <Toast open={showToast} onOpenChange={setShowToast}>
          <ToastTitle>Install App</ToastTitle>
          <ToastDescription>Install Life Reboot for a better experience and offline access</ToastDescription>
          <ToastAction altText="Install" onClick={handleInstallClick}>
            Install
          </ToastAction>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
