'use client';

import React, { useState } from 'react';
import { BankAccount } from '@/types/wedding';

interface VietQRGiftBoxProps {
  groomBank: BankAccount;
  brideBank: BankAccount;
  primaryColor?: string;
}

export const VietQRGiftBox: React.FC<VietQRGiftBoxProps> = ({
  groomBank,
  brideBank,
  primaryColor = '#b91c1c'
}) => {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copied, setCopied] = useState(false);

  const currentBank = activeTab === 'groom' ? groomBank : brideBank;
  const currentTitle = activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://img.vietqr.io/image/${currentBank.bankCode}-${currentBank.accountNumber}-compact2.png?amount=0&addInfo=Mung+cuoi+${encodeURIComponent(currentTitle)}`;

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/50 text-center font-sans">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">🎁</span>
        <h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
          Hộp Mừng Cưới & Chúc Phúc
        </h3>
      </div>
      <p className="text-xs text-gray-500 mb-6 italic">
        Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng tôi.
      </p>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('groom')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'groom'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          style={activeTab === 'groom' ? { color: primaryColor } : {}}
        >
          Mừng Chú Rể
        </button>
        <button
          onClick={() => setActiveTab('bride')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'bride'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          style={activeTab === 'bride' ? { color: primaryColor } : {}}
        >
          Mừng Cô Dâu
        </button>
      </div>

      {/* Bank Details & QR */}
      <div className="space-y-4">
        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/80">
          <p className="text-xs font-semibold text-gray-500 uppercase">Ngân hàng</p>
          <p className="text-base font-bold text-gray-800">{currentBank.bankName || currentBank.bankCode}</p>

          <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Chủ tài khoản</p>
          <p className="text-sm font-bold text-gray-800">{currentBank.accountName}</p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-lg font-mono font-bold tracking-widest text-amber-900">
              {currentBank.accountNumber}
            </span>
            <button
              onClick={() => copyToClipboard(currentBank.accountNumber)}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm active:scale-95 transition-all"
            >
              {copied ? '✓ Đã chép' : 'Sao chép'}
            </button>
          </div>
        </div>

        {/* VietQR Code */}
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200">
          <img
            src={qrImageUrl}
            alt="Mã QR Mừng Cưới"
            className="w-48 h-auto object-contain rounded-lg shadow-sm"
            loading="lazy"
          />
          <span className="text-[11px] text-gray-400 mt-2">
            Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ
          </span>
        </div>
      </div>
    </div>
  );
};
