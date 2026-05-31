import './global.css';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata = {
  title: 'Tiệm Nhà Zịt | Cửa Hàng Đồ Len & Sản Phẩm Đan Móc Thủ Công Cao Cấp',
  description: 'Chào mừng bạn đến với Tiệm Nhà Zịt - thế giới của các sản phẩm len handmade, thú bông, cardigan cao cấp dệt từ Merino & Alpaca tự nhiên.',
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

