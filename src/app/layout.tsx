import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Chung Đôi | Nền Tảng Làm Thiệp Cưới Online Thông Minh',
  description:
    'Làm thiệp cưới online sang trọng, tinh tế trong 5 phút. Tích hợp hiệu ứng mở phong bì 3D, mã mừng cưới VietQR tự động và quản lý khách mời.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
