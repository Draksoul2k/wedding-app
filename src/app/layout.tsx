import type { Metadata } from 'next';
import { Poppins, Dancing_Script, Playfair_Display, Charmonman, Lora } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
});

const dancingScript = Dancing_Script({
  variable: '--font-cursive',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '900'],
});

const charmonman = Charmonman({
  variable: '--font-charmonman',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
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
      <body className={`${poppins.variable} ${dancingScript.variable} ${playfair.variable} ${charmonman.variable} ${lora.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
