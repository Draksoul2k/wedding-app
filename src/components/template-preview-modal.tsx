'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { TemplateConfig, DEFAULT_WEDDING_DATA } from '@/constants/templates';
import { WeddingView } from './wedding-view';
import { AutoScrollController } from './auto-scroll-controller';
import { FloatingWishesStream } from './floating-wishes-stream';
import { WeddingInvitationData } from '@/types/wedding';

interface TemplatePreviewModalProps {
  template: TemplateConfig | null;
  onClose: () => void;
  activeVariantId?: string;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  activeVariantId,
}) => {
  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(369);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!template) return null;

  // Build temporary data for this template preview
  const activeVariant = template.colorVariants?.find((v) => v.id === activeVariantId);
  const previewData: WeddingInvitationData = {
    ...DEFAULT_WEDDING_DATA,
    templateId: template.id,
    themeName: template.name,
    primaryColor: activeVariant?.primaryColor || template.primaryColor,
    heroPhoto: activeVariant?.frameAsset || template.frameAsset,
    fallingEffect:
      template.category === 'hoa_la'
        ? 'petals'
        : template.category === 'truyen_thong'
        ? 'hearts'
        : template.category === 'toi_gian'
        ? 'sparkles'
        : 'petals'
  };

  const previewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/thiep/demo?template=${template.id}`
    : `https://chungdoi.com/thiep/demo?template=${template.id}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(previewUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(previewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title="Đóng cửa sổ"
        >
          ✕
        </button>

        {/* LEFT COLUMN: Smartphone Mockup with Auto-Scroll (Tự động cuộn theo nhịp) */}
        <div className="md:w-1/2 bg-stone-100 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200 relative overflow-hidden">
          {/* Subtle decorative background radial */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-stone-100 to-amber-50/50 pointer-events-none" />

          {/* Smartphone Frame Container */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] h-[540px] sm:h-[620px] bg-black rounded-[44px] p-2.5 shadow-2xl ring-4 ring-black/10 flex flex-col relative overflow-hidden z-10">
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-end pr-2 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Auto-Scroll Controller attached to this phone viewport */}
            <AutoScrollController
              scrollContainerRef={phoneScrollRef}
              activeColor={template.primaryColor}
              defaultActive={true}
              className="absolute top-4 right-3 z-40 flex items-center gap-1.5 pointer-events-auto"
            />

            {/* Mobile Screen Viewport (Scrollable with rhythmic auto-scroll) */}
            <div
              ref={phoneScrollRef}
              className="flex-1 bg-white rounded-[34px] overflow-y-auto relative no-scrollbar selection:bg-rose-200"
            >
              <WeddingView data={previewData} isLivePreview={true} />

              {/* Floating Live Wishes Stream (như trong ảnh ZenLove) */}
              <FloatingWishesStream
                primaryColor={template.primaryColor}
                activeAccent={template.accentColor}
              />
            </div>
          </div>

          {/* Guidance caption */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500 font-medium z-10">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Mẫu đang tự động lướt theo nhịp • Bạn có thể cuộn tự do</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Template Metadata & Actions (như ảnh chụp của ZenLove) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            {/* Title & Stats */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                  {template.source === 'cinelove'
                    ? '🎬 Điện Ảnh'
                    : template.source === 'motdoi'
                    ? '🌟 Thanh Lịch'
                    : template.source === 'zenlove'
                    ? '🌿 Tối Giản'
                    : '🌸 Đa Sắc'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {template.tag}
                </span>

                <div className="flex items-center gap-2 ml-auto text-xs text-stone-500 font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center gap-1">
                    ❤️ {likeCount}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold flex items-center gap-1">
                    👁️ 4657
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {template.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Feature Highlights (Chuẩn thiết kế ZenLove) */}
            <div className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
              <div className="flex items-start gap-2">
                <strong className="text-stone-900 shrink-0 font-semibold">Thiết kế:</strong>
                <span className="text-stone-600">Đa dạng phong cách, chuẩn thẩm mỹ cao, hiệu ứng chuyển động mượt mà.</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-stone-900 shrink-0 font-semibold">Thao tác:</strong>
                <span className="text-stone-600">Chỉnh sửa trực quan 100%, không cần kinh nghiệm thiết kế.</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-stone-900 shrink-0 font-semibold">Chia sẻ:</strong>
                <span className="text-stone-600">Đa nền tảng (Mạng xã hội, tin nhắn Zalo, Messenger, SMS) chỉ với một đường link.</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-stone-900 shrink-0 font-semibold">Tương thích:</strong>
                <span className="text-stone-600">Hiển thị hoàn hảo 100% trên mọi thiết bị di động, máy tính bảng và máy tính.</span>
              </div>
            </div>

            {/* Color variants selector if available */}
            {template.colorVariants && template.colorVariants.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 block">
                  🎨 Phối màu có sẵn ({template.colorVariants.length} tông màu):
                </span>
                <div className="flex items-center gap-2">
                  {template.colorVariants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium"
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: v.primaryColor }} />
                      <span>{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons & QR Code Footer */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            {/* Primary Action Button */}
            <Link
              href={`/create?template=${template.id}${activeVariantId ? `&variant=${activeVariantId}` : ''}`}
              className="w-full py-3.5 px-6 rounded-2xl text-center font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>🪄 Tuỳ chỉnh mẫu này</span>
            </Link>

            {/* Secondary Buttons Row */}
            <div className="flex items-center gap-2">
              <Link
                href={`/thiep/demo?template=${template.id}`}
                target="_blank"
                className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>↗ Xem mẫu toàn màn hình</span>
              </Link>

              <button
                type="button"
                onClick={handleToggleLike}
                className={`p-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                title="Yêu thích mẫu này"
              >
                {isLiked ? '❤️' : '🤍'}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Sao chép liên kết mẫu thiệp"
              >
                <span>{copiedLink ? '✓ Đã chép' : '🔗'}</span>
              </button>
            </div>

            {/* QR Code Scan on Mobile Box */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-4">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-18 h-18 rounded-xl border border-stone-200 bg-white p-1 shrink-0"
              />
              <div className="space-y-0.5">
                <strong className="text-xs font-bold text-stone-900 block">
                  Quét mã QR để xem trên điện thoại
                </strong>
                <p className="text-[11px] text-stone-500">
                  Dùng camera điện thoại quét để trải nghiệm thiệp cưới với âm thanh và lướt tự động mượt mà.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
