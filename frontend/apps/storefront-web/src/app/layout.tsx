import './global.css';

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
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
