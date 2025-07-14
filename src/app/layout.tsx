import './globals.css';
import { ThemeProvider } from "../components/ThemeProvider";
import ClientWrapper from '@/components/ClientWrapper';

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
                <ClientWrapper>{children}</ClientWrapper>
                </ThemeProvider>
            </body>
        </html>
    )
}