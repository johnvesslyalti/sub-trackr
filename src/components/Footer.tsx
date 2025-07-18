// components/footer.tsx
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { ThemeToggle } from './ThemeToggle'

export default function Footer() {
  return (
    <footer className="w-full border-t dark:border-gray-800 mt-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-6">
        
        {/* Branding Section */}
        <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
          <span className="text-lg font-semibold text-foreground">SubTrackr</span>
          <span className="hidden md:inline text-muted-foreground">
            — Track your subscriptions smartly.
          </span>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/privacy" className="hover:underline transition text-muted-foreground hover:text-foreground">Privacy</a>
          <a href="/terms" className="hover:underline transition text-muted-foreground hover:text-foreground">Terms</a>
          <a href="/contact" className="hover:underline transition text-muted-foreground hover:text-foreground">Contact</a>
        </div>

        {/* Social & Theme */}
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xl">
            <a
              href="https://github.com/johnvesslyalti"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/johnvesslyalti"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:altijohnvessly@gmail.com"
              className="hover:text-foreground transition"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
