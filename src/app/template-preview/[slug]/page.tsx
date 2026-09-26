'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ZENLOVE_TEMPLATES, ZenLoveTemplate } from '@/constants/zenlove-templates';
import { TemplateCardV3 } from '@/components/template-card-v3';

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [isLiked, setIsLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find template by slug or ID
  const template: ZenLoveTemplate =
    ZENLOVE_TEMPLATES.find((t) => t.slug === slug || t.id === slug) ||
    ZENLOVE_TEMPLATES[0];

  // Related templates (different from current)
  const relatedTemplates = ZENLOVE_TEMPLATES.filter((t) => t.id !== template.id).slice(0, 6);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUseTemplate = () => {
    router.push(`/create?template=${template.slug || template.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo/logo-6.svg" alt="ZenLove" className="w-8 h-8 object-contain" />
            <img src="/assets/logo/text-logo-dark.svg" alt="ZenLove" className="h-5 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-rose-600 transition-colors">Trang chủ</Link>
            <Link href="/templates" className="text-rose-600 font-bold hover:text-rose-700 transition-colors">Mẫu thiệp</Link>
            <Link href="/pricing" className="hover:text-rose-600 transition-colors">Gói dịch vụ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUseTemplate}
              className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>✏️</span>
              <span>Dùng mẫu này</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. SÂN KHẤU PREVIEW STAGE (PHONE MOCKUP WITH FULL TEMPLATE DISPLAY)        */}
      {/* ========================================================================= */}
      <section className="relative w-full py-8 md:py-12 bg-[#eceef1] border-b border-stone-300">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          {/* Floating Action Menu Top-Right */}
          <div className="w-full max-w-[390px] flex items-center justify-between mb-3 px-2">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              <span>←</span>
              <span>Quay lại kho mẫu</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLiked(!isLiked);
                  showToast(!isLiked ? 'Đã thêm vào danh sách yêu thích ❤️' : 'Đã bỏ yêu thích');
                }}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isLiked ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-stone-200 text-stone-600 hover:text-rose-600'
                }`}
                title="Yêu thích mẫu này"
              >
                {isLiked ? '❤️' : '🤍'}
              </button>
              <a
                href="#template-info"
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-bold"
                title="Thông tin chi tiết"
              >
                ℹ️
              </a>
            </div>
          </div>

          {/* Phone Frame Simulator */}
          <div className="relative w-full max-w-[390px] h-[700px] bg-white rounded-3xl shadow-2xl border-4 border-stone-800 overflow-hidden flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="h-5 bg-stone-900 w-full flex items-center justify-center shrink-0">
              <div className="w-16 h-1 rounded-full bg-stone-700" />
            </div>

            {/* Scrollable Template Content */}
            <div className="flex-1 overflow-y-auto w-full relative scrollbar-thin scrollbar-thumb-stone-300">
              <img
                src={template.longThumbnailUrl}
                alt={template.name}
                className="w-full h-auto object-cover select-none"
              />
            </div>

            {/* Floating Bottom CTA inside Phone */}
            <div className="p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleUseTemplate}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Dùng mẫu này</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TEMPLATE INFO SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="template-info" className="py-12 md:py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-stone-500 flex items-center gap-2">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span>/</span>
            <Link href="/templates" className="hover:underline">Mẫu thiệp</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">{template.name}</span>
          </nav>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {template.name} – Thiệp cưới online
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              {template.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">Loại thiệp</span>
              <strong className="text-stone-800">Thiết kế tự do</strong>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Gói dịch vụ</span>
              <strong className="text-rose-600 uppercase font-black">{template.templateType === 'premium' ? 'Cao cấp' : 'Miễn phí'}</strong>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Danh mục</span>
              <strong className="text-stone-800">Thiệp cưới online</strong>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Tương thích</span>
              <strong className="text-stone-800">Mọi điện thoại (iOS, Android)</strong>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-stone-900">Đặc điểm nổi bật của mẫu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Xác nhận tham dự (RSVP) trực tuyến tiện lợi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Tích hợp bản đồ chỉ đường Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Bộ đếm ngược thời gian thực đến ngày cưới</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Hộp mừng cưới trực tiếp qua mã VietQR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Sổ lưu bút gửi lời chúc phúc trăm năm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Nhạc nền đám cưới lãng mạn tự động phát</span>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleUseTemplate}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Dùng mẫu này ngay</span>
              <span>→</span>
            </button>
            <Link
              href="/templates"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-all text-center"
            >
              Xem thêm mẫu thiệp cưới khác
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RELATED TEMPLATES SECTION                                              */}
      {/* ========================================================================= */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Mẫu thiệp cưới khác có thể bạn thích
          </h2>
          <p className="text-xs text-stone-500">Rê chuột để xem trước các mẫu tương tự</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {relatedTemplates.map((t) => (
            <TemplateCardV3 key={t.id} template={t} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 border-t border-stone-800 text-xs text-center">
        <p>© {new Date().getFullYear()} ZenLove.me. Toàn bộ bản quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
