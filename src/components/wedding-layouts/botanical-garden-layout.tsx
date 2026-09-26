'use client';

import React from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { CountdownTimer } from './countdown-timer';
import { MonthlyCalendar } from './monthly-calendar';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface BotanicalGardenLayoutProps {
  data: WeddingInvitationData;
  template: TemplateConfig;
  activeColor: string;
  activeAccent: string;
  onOpenLightbox: (index: number) => void;
  rsvpSent: boolean;
  onSendRSVP: (e: React.FormEvent) => void;
  rsvpSide: 'nha_trai' | 'nha_gai';
  setRsvpSide: (side: 'nha_trai' | 'nha_gai') => void;
  rsvpCount: number;
  setRsvpCount: (n: number) => void;
  wishes: Array<{ name: string; content: string; time: string }>;
  newWishName: string;
  setNewWishName: (s: string) => void;
  newWishContent: string;
  setNewWishContent: (s: string) => void;
  onAddWish: (e: React.FormEvent) => void;
}

export const BotanicalGardenLayout: React.FC<BotanicalGardenLayoutProps> = ({
  data,
  template,
  activeColor,
  activeAccent,
  onOpenLightbox,
  rsvpSent,
  onSendRSVP,
  rsvpSide,
  setRsvpSide,
  rsvpCount,
  setRsvpCount,
  wishes,
  newWishName,
  setNewWishName,
  newWishContent,
  setNewWishContent,
  onAddWish,
}) => {
  const [showAllPhotos, setShowAllPhotos] = React.useState(false);
  const isCatalogScreenshot = (url?: string) => Boolean(url && (url.includes('/templates/cinelove/') || url.includes('/templates/motdoi/')));
  const defaultBotanicalPhoto = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80';
  const displayPhoto = data.heroPhoto && !isCatalogScreenshot(data.heroPhoto)
    ? data.heroPhoto
    : defaultBotanicalPhoto;
  const mainCeremony = data.ceremonies[0];
  const targetDateStr = mainCeremony?.dateSolar || '2026-10-25';

  const defaultColors = [
    { name: 'Xanh Sage', hex: '#8FA392' },
    { name: 'Be Pastel', hex: '#EAD7C5' },
    { name: 'Hồng Phấn', hex: '#F3D5D8' },
    { name: 'Trắng Sữa', hex: '#FAF9F6' },
    { name: 'Vàng Cát', hex: '#D1AC00' }
  ];

  const dressCodeColors = data.dressCode?.colors || defaultColors;

  return (
    <div className="bg-[#FAF8F5] text-stone-800 min-h-screen font-serif selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Top Botanical Ribbon */}
      <div className="bg-emerald-900 text-emerald-100 py-2.5 text-center px-4 font-sans border-b border-emerald-800/40">
        <span className="text-[10px] tracking-[0.35em] uppercase font-medium">
          🌿 THE BOTANICAL WEDDING GARDEN 🌿
        </span>
      </div>

      {/* Hero Section with Botanical Arch */}
      <div className="relative pt-10 pb-8 px-6 text-center overflow-hidden">
        {/* Decorative foliage watermarks */}
        <div className="absolute top-2 left-2 text-4xl opacity-15 pointer-events-none select-none">🍃</div>
        <div className="absolute top-4 right-2 text-4xl opacity-15 pointer-events-none select-none">🌸</div>

        <div className="inline-block px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] tracking-[0.25em] font-sans uppercase mb-4 shadow-xs">
          SAVE THE DATE
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-emerald-950 font-normal tracking-wide">
          {data.groom.shortName || data.groom.fullName || 'Chú Rể'}{' '}
          <span className="text-rose-500 font-light italic">&amp;</span>{' '}
          {data.bride.shortName || data.bride.fullName || 'Cô Dâu'}
        </h1>

        <div className="flex items-center justify-center gap-3 text-xs tracking-widest text-emerald-800/80 uppercase font-sans mt-3">
          <span>{mainCeremony?.dateSolar}</span>
          <span className="text-rose-400">❀</span>
          <span>{mainCeremony?.time}</span>
        </div>

        {/* Arch Shaped Couple Portrait */}
        <div className="mt-8 max-w-[280px] mx-auto relative">
          <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden shadow-xl border-4 border-white bg-emerald-50 relative group">
            <img
              src={displayPhoto}
              alt="Couple Portrait"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-emerald-900/10 rounded-t-full pointer-events-none" />
          </div>
          {/* Floral Seal badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-lg">
            🌸
          </div>
        </div>

        {/* Romantic Poem / Love Note */}
        {data.loveStory && (
          <div className="mt-8 max-w-xs mx-auto text-xs text-stone-600 leading-relaxed italic">
            &ldquo;{data.loveStory.quotes || data.loveStory.content}&rdquo;
          </div>
        )}
      </div>

      {/* Countdown Timer in Pastel Garden Theme */}
      <div className="px-4 py-4 max-w-sm mx-auto">
        <CountdownTimer
          targetDateStr={targetDateStr}
          theme="pastel"
          activeColor="#065f46"
        />
      </div>

      {/* Monthly Calendar Section */}
      <div className="px-6 py-8">
        <div className="text-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
            CALENDAR
          </span>
          <h2 className="text-2xl font-serif text-emerald-950 mt-1">
            Ngày Lành Trọng Đại
          </h2>
        </div>

        <div className="max-w-sm mx-auto bg-white rounded-3xl p-5 shadow-sm border border-emerald-100/80">
          <MonthlyCalendar
            targetDateStr={targetDateStr}
            accentColor="#059669"
          />
        </div>
      </div>

      {/* Bilateral Parents & Couple Profile */}
      <div className="px-6 py-10 bg-emerald-950 text-emerald-50 my-6">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-sans font-semibold">
            FAMILY ANNOUNCEMENT
          </span>
          <h2 className="text-2xl font-serif text-white mt-1">
            Hai Bên Gia Đình
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs max-w-sm mx-auto">
          {/* Nhà Trai */}
          <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 shadow-md">
            <span className="text-[10px] font-sans tracking-wider uppercase text-emerald-300 block mb-2 font-bold">
              [ NHÀ TRAI ]
            </span>
            <p className="text-emerald-200 text-[11px]">Bố: <strong className="text-white">{data.groom.fatherName}</strong></p>
            <p className="text-emerald-200 text-[11px] mb-3">Mẹ: <strong className="text-white">{data.groom.motherName}</strong></p>
            <div className="border-t border-emerald-800 pt-2">
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{data.groom.birthOrder}</span>
              <p className="font-bold text-sm text-white mt-0.5">{data.groom.fullName}</p>
            </div>
          </div>

          {/* Nhà Gái */}
          <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 shadow-md">
            <span className="text-[10px] font-sans tracking-wider uppercase text-emerald-300 block mb-2 font-bold">
              [ NHÀ GÁI ]
            </span>
            <p className="text-emerald-200 text-[11px]">Bố: <strong className="text-white">{data.bride.fatherName}</strong></p>
            <p className="text-emerald-200 text-[11px] mb-3">Mẹ: <strong className="text-white">{data.bride.motherName}</strong></p>
            <div className="border-t border-emerald-800 pt-2">
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{data.bride.birthOrder}</span>
              <p className="font-bold text-sm text-white mt-0.5">{data.bride.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ceremonies Timeline */}
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
            WEDDING ITINERARY
          </span>
          <h2 className="text-2xl font-serif text-emerald-950 mt-1">
            Chương Trình Hôn Lễ
          </h2>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
          {data.ceremonies.map((c, i) => (
            <div
              key={c.id || i}
              className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between border-b border-emerald-50 pb-2 mb-3">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-900">
                  🌿 {c.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {c.time}
                </span>
              </div>
              <p className="text-xs text-stone-700 font-sans">
                <strong>Ngày:</strong> {c.dateSolar} ({c.dateLunar})
              </p>
              <p className="text-xs text-stone-700 font-sans mt-1">
                <strong>Địa điểm:</strong> {c.venueName}
              </p>
              <p className="text-[11px] text-stone-500 font-sans mt-0.5">{c.address}</p>

              {c.mapUrl && (
                <a
                  href={c.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-emerald-700 hover:text-emerald-800 mt-3 font-semibold hover:underline"
                >
                  <span>📍 Xem bản đồ chỉ đường</span>
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dress Code Section */}
      <div className="px-6 py-8">
        <div className="max-w-sm mx-auto p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm text-center space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-700 font-sans font-semibold">
            DRESS CODE
          </span>
          <h3 className="text-xl font-serif text-emerald-950">
            {data.dressCode?.title || 'Gợi Ý Trang Phục'}
          </h3>
          <p className="text-xs text-stone-600 font-sans max-w-xs mx-auto leading-relaxed">
            {data.dressCode?.description || 'Để những bức ảnh kỷ niệm thêm phần trang nhã, kính mời quý khách mặc trang phục theo các tông màu hoa lá dưới đây:'}
          </p>

          <div className="flex justify-center items-center gap-3 pt-3">
            {dressCodeColors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full shadow-sm border border-stone-200 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[10px] font-sans text-stone-600 font-medium">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Romantic Photo Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (() => {
        const totalImages = data.galleryImages.length;
        const displayImages = showAllPhotos ? data.galleryImages : data.galleryImages.slice(0, 5);
        const hasMore = totalImages > 5;
        const remainingCount = totalImages - 5;

        return (
          <div className="py-10 bg-[#F4F1EA]">
            <div className="text-center px-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
                PHOTO GALLERY
              </span>
              <h2 className="text-2xl font-serif text-emerald-950 mt-1">
                Album Ảnh Kỷ Niệm
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 font-sans">
                {totalImages} khoảnh khắc ngọt ngào bên nhau
              </p>
            </div>

            <div className="px-4 max-w-sm mx-auto grid grid-cols-2 gap-3">
              {displayImages.map((img, i) => {
                const isFifthWhenCollapsed = !showAllPhotos && hasMore && i === 4;
                return (
                  <div
                    key={i}
                    onClick={() => onOpenLightbox(i)}
                    className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-sm cursor-pointer group bg-stone-100 relative"
                  >
                    <img
                      src={img}
                      alt={`Khoảnh khắc cưới ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {isFifthWhenCollapsed ? (
                      <div
                        className="absolute inset-0 bg-emerald-950/75 flex flex-col items-center justify-center text-white text-center p-2 gap-1 cursor-pointer hover:bg-emerald-950/85 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllPhotos(true);
                        }}
                      >
                        <span className="text-xl font-bold text-amber-200">+{remainingCount}</span>
                        <span className="text-[10px] font-sans font-medium">Xem thêm ảnh</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-sans bg-emerald-900/80 px-2 py-1 rounded-full">
                          Xem ảnh
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="px-6 py-2.5 rounded-full border border-emerald-300 bg-white text-emerald-900 font-sans text-xs font-bold shadow-xs hover:bg-emerald-50 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>{showAllPhotos ? '↑ Thu gọn bớt ảnh' : `🌸 Xem thêm ${remainingCount} ảnh cưới khác ↓`}</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* VietQR Wedding Gift */}
      {data.enableVietQR && (
        <div className="px-4 py-8">
          <div className="max-w-sm mx-auto text-center mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
              GIFT BOX
            </span>
            <h2 className="text-2xl font-serif text-emerald-950 mt-1">
              Hộp Mừng Cưới
            </h2>
          </div>

          <div className="max-w-sm mx-auto p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm">
            <VietQRGiftBox
              groomBank={data.groom.bank}
              brideBank={data.bride.bank}
              primaryColor="#059669"
            />
          </div>
        </div>
      )}

      {/* RSVP Section */}
      {data.enableRSVP && (
        <div className="px-4 py-8">
          <div className="max-w-sm mx-auto p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm font-sans space-y-4">
            <div className="text-center font-serif">
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
                RSVP
              </span>
              <h3 className="text-xl font-serif text-emerald-950 mt-0.5">
                Xác Nhận Tham Dự
              </h3>
            </div>

            {rsvpSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-medium">
                ✓ Cảm ơn bạn! Xác nhận đã được chuyển đến cô dâu & chú rể.
              </div>
            ) : (
              <form onSubmit={onSendRSVP} className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_trai')}
                    className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                      rsvpSide === 'nha_trai'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    Khách Nhà Trai
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_gai')}
                    className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                      rsvpSide === 'nha_gai'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    Khách Nhà Gái
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Tên của bạn..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-emerald-700"
                />

                <div className="flex items-center justify-between p-2 rounded-xl border border-stone-200">
                  <span className="text-stone-600">Số lượng người tham dự:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                      className="w-6 h-6 rounded bg-stone-100 text-stone-800 font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-emerald-800">{rsvpCount}</span>
                    <button
                      type="button"
                      onClick={() => setRsvpCount(rsvpCount + 1)}
                      className="w-6 h-6 rounded bg-stone-100 text-stone-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition-all shadow-sm"
                >
                  Xác Nhận Tham Dự 🌿
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Guestbook Section */}
      <div className="px-4 py-8 max-w-sm mx-auto font-sans">
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
          <div className="text-center font-serif">
            <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-sans font-semibold">
              WISHES
            </span>
            <h3 className="text-xl font-serif text-emerald-950 mt-0.5">
              Sổ Lưu Bút & Lời Chúc
            </h3>
          </div>

          <form onSubmit={onAddWish} className="space-y-2.5 text-xs">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full p-2.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-emerald-700"
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Gửi lời chúc phúc..."
              className="w-full p-2.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-emerald-700"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition-all shadow-sm"
            >
              Gửi Lời Chúc Mừng 💌
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-emerald-900">{w.name}</strong>
                  <span className="text-[10px] text-stone-400 font-mono">{w.time}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thank you note */}
      <div className="text-center py-8 text-stone-500 text-xs italic border-t border-emerald-100">
        <p>{data.thankYouMessage}</p>
        <p className="mt-1 font-serif text-emerald-900 font-bold">
          {data.groom.shortName} & {data.bride.shortName}
        </p>
      </div>
    </div>
  );
};
