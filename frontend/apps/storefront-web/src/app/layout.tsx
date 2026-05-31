import './global.css';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
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
        {/* Preload Material Symbols Outlined Icon Font Stylesheet */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        
        {/* Preload critical LCP Hero Image for instant above-the-fold display */}
        <link 
          rel="preload" 
          href="https://lh3.googleusercontent.com/aida/ADBb0uhVFoGEYpMQ4ApsytjsctntvFwVW4pWh4s3RwmAkj2nixSjrnQVoB-zrJ1Ev7qEWihr5aJ6r4ooWWRiA3X4Wa4Gu5TEKD8X98XenUtSMQh9VTJviYKHYOoFItDI349VWGISmeVH5Qy5JFFaWsg9AYsDB_DSy89CERvWOKqcfcunAEw707Na5JIvQ2QyiErApQzb8PW4zKbGLVAsLv_PV0vRQ5I4h-CImO74Rz19--UpuVxt8dTPdvLDTTc" 
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

