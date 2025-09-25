import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/hooks/use-language';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-space-grotesk',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  title: {
    default: 'DevToolbox - Your Ultimate Developer Toolkit',
    template: '%s | DevToolbox',
  },
  description: 'An all-in-one suite of essential, free, and easy-to-use online tools for web developers. Includes JS Obfuscator, HTML Formatter, Code Editor, and more.',
  keywords: ['developer tools', 'web developer', 'online tools', 'free tools', 'javascript obfuscator', 'html formatter', 'code editor', 'base64 converter', 'url encoder', 'notebook', 'devtoolbox', 'puruu puruu', 'puru'],
  authors: [{ name: 'Puruu Puruu', url: 'https://wa.me/6283894391287' }],
  creator: 'Puruu Puruu',
  openGraph: {
    title: 'DevToolbox - Your Ultimate Developer Toolkit',
    description: 'An all-in-one suite of essential, free, and easy-to-use online tools for web developers.',
    url: 'https://devtoolbox.puruu.dev',
    siteName: 'DevToolbox',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevToolbox - Your Ultimate Developer Toolkit',
    description: 'An all-in-one suite of essential, free, and easy-to-use online tools for web developers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} font-body antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
