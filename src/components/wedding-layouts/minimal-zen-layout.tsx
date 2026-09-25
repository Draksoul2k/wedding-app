'use client';

import React from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { MonthlyCalendar } from './monthly-calendar';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface MinimalZenLayoutProps {
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

export const MinimalZenLayout: React.FC<MinimalZenLayoutProps> = ({
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
    <div className="bg-[#fcfaf7] text-stone-800 min-h-screen font-sans selection:bg-stone-200">
      {/* Zen Header: Clean vertical typography */}
      <div className="pt-10 pb-6 px-6 text-center space-y-3">
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-stone-400 block">
          WEDDING INVITATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wide text-stone-900 font-light">
          {data.groom.shortName} <span className="text-stone-400 italic text-2xl">&amp;</span> {data.bride.shortName}
        </h1>
        <div className="w-8 h-[1px] bg-stone-300 mx-auto my-2" />
        <p className="text-xs font-serif text-stone-500 italic">
          &ldquo;Gặp gỡ là duyên, bên nhau là định mệnh&rdquo;
        </p>
      </div>

      {/* Authentic Template Art Card Showcase */}
      <div className="px-6 pb-6 text-center">
        <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-white">
          <img
            src={template.frameAsset}
            alt={template.name}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Polaroid Photo Frame with Tape Accent */}
      {data.heroPhoto && (
        <div className="px-6 pb-8">
          <div className="relative max-w-[270px] mx-auto bg-white p-3 pb-7 rounded-xl shadow-xl border border-stone-200/80 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
            {/* Masking tape on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/70 border border-amber-200/50 backdrop-blur-xs shadow-2xs rotate-[2deg] z-10" />

            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-stone-100">
              <img
                src={data.heroPhoto}
                alt="Ảnh cưới Polaroid"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            <div className="text-center mt-2.5">
              <p className="font-serif text-xs tracking-wider font-semibold text-stone-800">
                {data.groom.fullName} &amp; {data.bride.fullName}
              </p>
              <p className="text-[9px] text-stone-400 font-mono tracking-widest mt-0.5 uppercase">
                {data.ceremonies[0]?.dateSolar}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signature Zen Feature: Monthly Calendar Grid with Circled Wedding Date */}
      <div className="px-6 py-6 bg-stone-100/50 border-t border-b border-stone-200/60">
        <MonthlyCalendar
          weddingDateStr={data.ceremonies[0]?.dateSolar || '2026-10-24'}
          activeColor={activeColor}
        />
      </div>

      {/* An Intimate Letter (Lời Ngỏ) */}
      <div className="px-8 py-10 text-center space-y-4 max-w-sm mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-400 font-semibold block">
          LỜI NGỎ
        </span>
        <h2 className="text-xl font-serif text-stone-900 font-medium">
          Hành Trình Chung Đôi
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed font-serif">
          {data.loveStory?.content ||
            'Từ những ngày đầu gặp gỡ ngập tràn bỡ ngỡ, đến hôm nay chúng mình quyết định nắm tay nhau bước vào một chặng đường mới. Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của chúng mình.'}
        </p>
        <div className="pt-2">
          <span className="font-serif italic text-sm text-stone-700 block">
            — {data.groom.shortName} &amp; {data.bride.shortName} —
          </span>
        </div>
      </div>

      {/* Parents Section: Minimalist clean dual cards */}
      <div className="px-6 py-8 bg-white border-t border-stone-200/70">
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-widest text-stone-400 font-mono">
            GIA ĐÌNH HAI BÊN
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
              NHÀ TRAI
            </span>
            <p className="text-stone-500 text-[11px]">Thân phụ: <strong className="text-stone-800">{data.groom.fatherName}</strong></p>
            <p className="text-stone-500 text-[11px] mb-2">Thân mẫu: <strong className="text-stone-800">{data.groom.motherName}</strong></p>
            <span className="text-[10px] text-stone-400 font-serif italic block">{data.groom.birthOrder}</span>
            <p className="font-bold text-stone-900 text-xs mt-0.5">{data.groom.fullName}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
              NHÀ GÁI
            </span>
            <p className="text-stone-500 text-[11px]">Thân phụ: <strong className="text-stone-800">{data.bride.fatherName}</strong></p>
            <p className="text-stone-500 text-[11px] mb-2">Thân mẫu: <strong className="text-stone-800">{data.bride.motherName}</strong></p>
            <span className="text-[10px] text-stone-400 font-serif italic block">{data.bride.birthOrder}</span>
            <p className="font-bold text-stone-900 text-xs mt-0.5">{data.bride.fullName}</p>
          </div>
        </div>
      </div>

      {/* Ceremonies Timeline */}
      <div className="px-6 py-10 bg-stone-100/40">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
            TIME &amp; LOCATION
          </span>
          <h2 className="text-xl font-serif text-stone-900 mt-1">
            Chương Trình Hôn Lễ
          </h2>
        </div>

        <div className="space-y-4">
          {data.ceremonies.map((c, i) => (
            <div key={c.id || i} className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
                <span className="font-serif font-bold text-xs uppercase text-stone-800">
                  {c.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700">
                  {c.time}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                <strong>Ngày:</strong> {c.dateSolar} ({c.dateLunar})
              </p>
              <p className="text-xs text-stone-700 mt-1">
                <strong>Địa điểm:</strong> {c.venueName}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">{c.address}</p>

              {c.mapUrl && (
                <a
                  href={c.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 mt-3 font-medium hover:underline"
                >
                  <span>📍 Chỉ đường Google Maps</span>
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dress Code Section */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 text-center space-y-3 shadow-xs">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono block">
            DRESS CODE
          </span>
          <h3 className="text-lg font-serif text-stone-900">
            {data.dressCode?.title || 'Gợi Ý Trang Phục'}
          </h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
            {data.dressCode?.description || 'Để những khung hình lưu niệm thêm trọn vẹn, kính mời quý khách ưu tiên trang phục theo các tông màu tối giản sau:'}
          </p>
          <div className="flex justify-center items-center gap-3 pt-2">
            {(data.dressCode?.colors || [
              { name: 'Be Nhạt', hex: '#f5ebe0' },
              { name: 'Trắng Ngà', hex: '#faf9f6' },
              { name: 'Nâu Cà Phê', hex: '#7f5539' },
              { name: 'Xanh Khói', hex: '#9a8c98' }
            ]).map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full shadow-sm border border-stone-200 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[10px] text-stone-500 font-sans">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <div className="px-6 py-10 bg-white">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              ALBUM
            </span>
            <h2 className="text-xl font-serif text-stone-900 mt-1">
              Khoảnh Khắc Đẹp
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {data.galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox(i)}
                className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group bg-stone-100 shadow-2xs"
              >
                <img
                  src={img}
                  alt={`Album ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VietQR */}
      {data.enableVietQR && (
        <div className="px-4 py-4 bg-stone-50">
          <VietQRGiftBox
            groomBank={data.groom.bank}
            brideBank={data.bride.bank}
            primaryColor={activeColor}
          />
        </div>
      )}

      {/* Minimalist RSVP */}
      {data.enableRSVP && (
        <div className="px-6 py-8 border-t border-stone-200/80 bg-white">
          <div className="text-center mb-5">
            <h3 className="text-lg font-serif text-stone-900">
              Xác Nhận Tham Dự
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Xin vui lòng gửi phản hồi để chúng mình đón tiếp chu đáo nhất
            </p>
          </div>

          {rsvpSent ? (
            <div className="p-4 rounded-xl bg-stone-100 text-center text-stone-800 text-xs font-medium">
              ✓ Cảm ơn bạn! Chúng mình đã nhận được xác nhận.
            </div>
          ) : (
            <form onSubmit={onSendRSVP} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_trai')}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    rsvpSide === 'nha_trai'
                      ? 'bg-stone-800 text-white font-bold border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  Khách Nhà Trai
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_gai')}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    rsvpSide === 'nha_gai'
                      ? 'bg-stone-800 text-white font-bold border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  Khách Nhà Gái
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="Họ và tên..."
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-500"
              />

              <div className="flex items-center justify-between p-2 rounded-lg border border-stone-200 bg-stone-50">
                <span className="text-stone-600">Số người tham dự:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                    className="w-6 h-6 rounded bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{rsvpCount}</span>
                  <button
                    type="button"
                    onClick={() => setRsvpCount(rsvpCount + 1)}
                    className="w-6 h-6 rounded bg-stone-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-medium text-white bg-stone-800 hover:bg-stone-900 active:scale-95 transition-all shadow-xs"
              >
                Gửi Xác Nhận Tham Dự
              </button>
            </form>
          )}
        </div>
      )}

      {/* Guestbook */}
      {data.enableGuestbook && (
        <div className="px-6 py-8 bg-stone-50 border-t border-stone-200">
          <div className="text-center mb-5">
            <h3 className="text-lg font-serif text-stone-900">
              Sổ Lưu Bút
            </h3>
            <p className="text-xs text-stone-500">Gửi lời chúc tốt đẹp đến hai bạn</p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3 mb-6">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full p-2.5 rounded-lg text-xs border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white"
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Lời chúc phúc..."
              className="w-full p-2.5 rounded-lg text-xs border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-medium text-white bg-stone-700 hover:bg-stone-800 transition-all"
            >
              Gửi Lời Chúc 💌
            </button>
          </form>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-stone-800">{w.name}</strong>
                  <span className="text-[10px] text-stone-400 font-mono">{w.time}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zen Footer */}
      <div className="py-8 text-center bg-stone-900 text-stone-400 text-[10px]">
        <p className="font-serif italic text-stone-300 text-xs mb-1">
          {data.thankYouMessage || 'Trân trọng cảm ơn tình cảm và sự hiện diện của bạn!'}
        </p>
        <p className="tracking-widest uppercase">
          {data.groom.shortName} &amp; {data.bride.shortName} • 2026
        </p>
      </div>
    </div>
  );
};
