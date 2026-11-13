import type { Metadata } from 'next';
import { Jost, Overpass_Mono } from 'next/font/google';
import './globals.css';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const overpassMono = Overpass_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '$SOGOK // Autonomous TEE-Guarded Memecoin Protocol',
  description:
    'The adversarial red-teaming memecoin with an autonomous TEE-guarded treasury bounty on NEAR Protocol.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${overpassMono.variable}`}
    >
      <body className="bg-ground text-slate-100 font-sans antialiased min-h-screen relative selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
