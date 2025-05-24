import { HeroSection } from "@/components/organisms/hero-section"
import { FeatureSection } from "@/components/organisms/feature-section"
import { NavBar } from "@/components/organisms/nav-bar"
import { Footer } from "@/components/organisms/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
