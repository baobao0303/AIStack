import { Metadata } from 'next';
import './global.css';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tiệm Nhà Zịt | Đồ Len Handmade & Sản Phẩm Đan Móc Cao Cấp',
  description: 'Khám phá thế giới len đan móc nghệ thuật tại Tiệm Nhà Zịt. Chuyên cung cấp thú bông amigurumi, khăn quàng cổ merino, hoa len và áo cardigan dệt thủ công từ sợi tự nhiên cao cấp.',
  keywords: ['tiệm nhà zịt', 'tiem nha zit', 'đồ len handmade', 'thú len amigurumi', 'quà tặng len', 'cardigan len merino', 'alpaca', 'đan móc thủ công'],
  metadataBase: new URL('https://tiemnhazit.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tiệm Nhà Zịt | Đồ Len Handmade & Sản Phẩm Đan Móc Cao Cấp',
    description: 'Thế giới len nghệ thuật đan móc thủ công. Thú bông amigurumi, hoa len quà tặng và áo cardigan từ sợi Merino & Alpaca tự nhiên dệt tay cao cấp.',
    url: 'https://tiemnhazit.vercel.app',
    siteName: 'Tiệm Nhà Zịt',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 1200,
        alt: 'Tiệm Nhà Zịt - Đồ Len Handmade & Đan Móc Cao Cấp',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiệm Nhà Zịt | Đồ Len Handmade & Sản Phẩm Đan Móc Cao Cấp',
    description: 'Thế giới len đan móc nghệ thuật. Thú bông amigurumi, hoa len quà tặng, cardigan Merino & Alpaca dệt tay cao cấp.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Be Vietnam Pro and Playfair Display with full Vietnamese glyph subsets */}
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
        {/* Preload Material Symbols Outlined Icon Font Stylesheet */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        
        {/* Preload critical LCP Hero Image for instant above-the-fold display */}
        <link 
          rel="preload" 
          href="/bouquet_18_flowers.png" 
          as="image" 
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

