import './globals.css';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";

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
                        <Navbar />
                {children}
                </ThemeProvider>
            </body>
        </html>
    )
}