'use client';

import React from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { CountdownTimer } from './countdown-timer';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface EditorialMagazineLayoutProps {
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

export const EditorialMagazineLayout: React.FC<EditorialMagazineLayoutProps> = ({
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
  const displayPhoto = data.heroPhoto || template.frameAsset;

  return (
    <div className="bg-[#faf9f6] text-stone-900 min-h-screen font-sans selection:bg-rose-200">
      {/* Magazine Masthead */}
      <div className="border-b-2 border-stone-900 px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-stone-500">
          SPECIAL WEDDING EDITION
        </span>
        <span className="text-xl font-serif font-black tracking-tight text-stone-900">
          VOGUE LOVE
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-stone-500">
          VOL. 2026
        </span>
      </div>

      {/* Magazine Cover Hero */}
      <div className="relative w-full aspect-[3/4] max-h-[580px] overflow-hidden bg-stone-200">
        <img
          src={displayPhoto}
          alt="Magazine Cover"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Big Magazine Cover Headlines */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] px-2.5 py-1 rounded bg-white/20 backdrop-blur-md inline-block">
            COVER STORY • A LIFELONG PROMISE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            {data.groom.shortName.toUpperCase()} &amp; {data.bride.shortName.toUpperCase()}
          </h1>
          <p className="text-xs text-stone-300 font-serif italic max-w-xs">
            &ldquo;Tình yêu không chỉ là nhìn nhau, mà là cùng nhau nhìn về một hướng.&rdquo;
          </p>
        </div>
      </div>

      {/* Editor's Note & Date Callout */}
      <div className="p-8 max-w-sm mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 text-xs font-mono uppercase tracking-wider text-stone-700">
          <span>📅 SAVE THE DATE</span>
          <span>•</span>
          <strong style={{ color: activeColor }}>{data.ceremonies[0]?.dateSolar}</strong>
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          Hôn Lễ Vẹn Toàn
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed font-serif">
          {data.loveStory?.content ||
            'Trân trọng kính mời bạn cùng gia đình đến chung vui và chứng kiến khoảnh khắc trọng đại của chúng mình trong ngày kết tóc se duyên.'}
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="px-6 pb-8">
        <CountdownTimer
          targetDateStr={data.ceremonies[0]?.dateSolar || '2026-10-24'}
          theme="pastel"
          activeColor={activeColor}
        />
      </div>

      {/* Editorial Couple Profiles (Hồ Sơ Dâu Rể) */}
      <div className="px-6 py-10 bg-white border-t border-b border-stone-200">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">
            PROFILE OF THE COUPLE
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Gia Đình &amp; Uyên Ương
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Groom Profile */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">
              THE GROOM
            </span>
            <p className="font-serif font-bold text-base text-stone-900 mb-2">{data.groom.fullName}</p>
            <p className="text-stone-500 text-[11px]">Thân phụ: <strong className="text-stone-700">{data.groom.fatherName}</strong></p>
            <p className="text-stone-500 text-[11px] mb-2">Thân mẫu: <strong className="text-stone-700">{data.groom.motherName}</strong></p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-stone-200/70 text-stone-700">
              {data.groom.birthOrder}
            </span>
          </div>

          {/* Bride Profile */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold block mb-1">
              THE BRIDE
            </span>
            <p className="font-serif font-bold text-base text-stone-900 mb-2">{data.bride.fullName}</p>
            <p className="text-stone-500 text-[11px]">Thân phụ: <strong className="text-stone-700">{data.bride.fatherName}</strong></p>
            <p className="text-stone-500 text-[11px] mb-2">Thân mẫu: <strong className="text-stone-700">{data.bride.motherName}</strong></p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-stone-200/70 text-stone-700">
              {data.bride.birthOrder}
            </span>
          </div>
        </div>
      </div>

      {/* Event Schedule Timeline */}
      <div className="px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">
            EVENT ITINERARY
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Lịch Trình Hôn Lễ
          </h2>
        </div>

        <div className="space-y-4">
          {data.ceremonies.map((c, i) => (
            <div key={c.id || i} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
                <span className="font-serif font-bold text-sm text-stone-900">
                  {c.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-stone-900 text-white">
                  {c.time}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                <strong>Ngày:</strong> {c.dateSolar} ({c.dateLunar})
              </p>
              <p className="text-xs text-stone-700 mt-1">
                <strong>Địa điểm:</strong> {c.venueName}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">{c.address}</p>

              {c.mapUrl && (
                <a
                  href={c.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3 hover:underline"
                  style={{ color: activeColor }}
                >
                  <span>📍 Bản đồ Google Maps</span>
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vogue Editorial Dress Code */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        <div className="p-6 bg-white border border-stone-200 text-center space-y-3 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 block">
            EDITORIAL PALETTE
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {data.dressCode?.title || 'Dress Code Sự Kiện'}
          </h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
            {data.dressCode?.description || 'Để những shoot hình cưới xuất bản thêm phần ấn tượng, kính mong quý khách phối đồ theo các tone màu dưới đây:'}
          </p>
          <div className="flex justify-center items-center gap-3 pt-2">
            {(data.dressCode?.colors || [
              { name: 'Đen Vogue', hex: '#111827' },
              { name: 'Trắng Ngà', hex: '#fafaf9' },
              { name: 'Nâu Mocha', hex: '#78350f' },
              { name: 'Bạc Khói', hex: '#9ca3af' }
            ]).map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full shadow-md border border-stone-300 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[10px] font-mono text-stone-600">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lookbook Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <div className="px-6 py-10 bg-stone-100 border-t border-stone-200">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">
              LOOKBOOK SPREAD
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Bộ Ảnh Thời Trang
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox(i)}
                className={`overflow-hidden rounded-xl bg-stone-200 cursor-pointer group shadow-xs ${
                  i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={img}
                  alt={`Lookbook ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VietQR */}
      {data.enableVietQR && (
        <div className="px-4 py-4">
          <VietQRGiftBox
            groomBank={data.groom.bank}
            brideBank={data.bride.bank}
            primaryColor={activeColor}
          />
        </div>
      )}

      {/* RSVP Form */}
      {data.enableRSVP && (
        <div className="px-6 py-8 bg-white border-t border-stone-200">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">
              RESERVATION
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
              Xác Nhận Tham Dự
            </h3>
          </div>

          {rsvpSent ? (
            <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-center text-xs font-semibold text-stone-800">
              ✓ Cảm ơn bạn đã xác nhận tham dự!
            </div>
          ) : (
            <form onSubmit={onSendRSVP} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_trai')}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    rsvpSide === 'nha_trai'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Khách Nhà Trai
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_gai')}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    rsvpSide === 'nha_gai'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Khách Nhà Gái
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="Họ và tên..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-stone-900"
              />

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-700">Số lượng người:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold">{rsvpCount}</span>
                  <button
                    type="button"
                    onClick={() => setRsvpCount(rsvpCount + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-stone-900 hover:bg-stone-800 active:scale-95 transition-all shadow-md"
              >
                Gửi Xác Nhận 💌
              </button>
            </form>
          )}
        </div>
      )}

      {/* Guestbook */}
      {data.enableGuestbook && (
        <div className="px-6 py-8 bg-stone-50 border-t border-stone-200">
          <div className="text-center mb-5">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Sổ Lưu Bút
            </h3>
            <p className="text-xs text-stone-500">Gửi lời chúc mừng đến cặp đôi mới cưới</p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3 mb-6">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full p-2.5 rounded-xl text-xs border border-stone-300 bg-white"
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Lời chúc phúc..."
              className="w-full p-2.5 rounded-xl text-xs border border-stone-300 bg-white"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all"
            >
              Gửi Lời Chúc Mừng
            </button>
          </form>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-stone-900">{w.name}</strong>
                  <span className="text-[10px] text-stone-400 font-mono">{w.time}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Magazine Footer Colophon */}
      <div className="py-8 text-center bg-stone-900 text-stone-400 text-xs font-mono">
        <p className="font-serif italic text-white text-sm mb-1">
          {data.thankYouMessage || 'Cảm ơn bạn đã luôn yêu thương và ủng hộ chúng mình!'}
        </p>
        <p className="text-[10px] tracking-widest uppercase text-stone-500">
          ALL RIGHTS RESERVED • {data.groom.shortName.toUpperCase()} &amp; {data.bride.shortName.toUpperCase()} 2026
        </p>
      </div>
    </div>
  );
};
