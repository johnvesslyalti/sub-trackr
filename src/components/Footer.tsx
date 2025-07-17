// components/footer.tsx
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { ThemeToggle } from './ThemeToggle'

export default function Footer() {
  return (
    <footer className="w-full border-t dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">SubTrackr</span>
          <span className="text-muted-foreground hidden md:inline">— Track your subscriptions smartly.</span>
        </div>

        {/* Center: Links */}
        <div className="flex gap-4">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-3 text-xl">
          <a
            href="https://github.com/johnvesslyalti"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/johnvesslyalti"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:altijohnvessly@gmail.com"
            className="hover:text-foreground"
          >
            <FaEnvelope />
          </a>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  )
}