import './globals.css';
import { ThemeProvider } from "../components/ThemeProvider";
import LenisProvider from '@/components/LenisProvider';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
            <head>
                <title>SubTrackr</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                    disableTransitionOnChange={true}>
                    <LenisProvider>
                        <main>{children}</main>
                        <footer className="mt-12">
                            <Footer />
                        </footer>
                    </LenisProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}