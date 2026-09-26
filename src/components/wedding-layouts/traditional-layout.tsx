'use client';

import React from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { CountdownTimer } from './countdown-timer';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface TraditionalLayoutProps {
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

export const TraditionalLayout: React.FC<TraditionalLayoutProps> = ({
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
  const displayCardAsset = template.frameAsset;
  const displayPhoto = data.heroPhoto || null;

  return (
    <div className="bg-[#fff9f5] text-stone-900 min-h-screen font-serif selection:bg-red-200">
      {/* Traditional Oriental Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-700 to-red-800 text-amber-200 py-3.5 text-center px-4 shadow-md border-b-2 border-amber-400">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🏮</span>
          <span className="text-xs uppercase tracking-[0.3em] font-bold">
            囍 THIỆP HỒNG BÁO HỶ 囍
          </span>
          <span className="text-xl">🏮</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-serif font-black text-amber-100 mt-1 tracking-wide">
          {data.groom.shortName || data.groom.fullName || 'CHÚ RỂ'}{' '}
          <span className="text-amber-300 font-light italic">&amp;</span>{' '}
          {data.bride.shortName || data.bride.fullName || 'CÔ DÂU'}
        </h1>
        <p className="text-[10px] text-amber-300/80 font-mono tracking-wider mt-0.5">
          {data.ceremonies[0]?.dateSolar} ({data.ceremonies[0]?.dateLunar})
        </p>
      </div>

      {/* Hero Section: Authentic ChungDoi Template Card */}
      <div className="px-5 pt-8 pb-4 text-center">
        {/* Authentic ChungDoi Template Card */}
        <div
          className="relative max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 p-1 bg-white"
          style={{ borderColor: activeColor }}
        >
          <img
            src={displayCardAsset}
            alt={template.name}
            className="w-full h-auto object-cover rounded-xl shadow-inner"
            loading="eager"
          />
          {/* Top Double Happiness Badge */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-white px-5 py-1 rounded-full text-xs font-bold shadow-lg border flex items-center gap-1.5"
            style={{ backgroundColor: activeColor, borderColor: activeAccent }}
          >
            <span>囍</span>
            <span>TRĂM NĂM HẠNH PHÚC</span>
            <span>囍</span>
          </div>
        </div>

        {/* User Uploaded Photo Spotlight (if provided) */}
        {displayPhoto && (
          <div
            className="relative max-w-[280px] mx-auto mt-5 aspect-[3/4] rounded-t-[120px] rounded-b-2xl overflow-hidden shadow-xl border-2 p-1 bg-white"
            style={{ borderColor: activeAccent }}
          >
            <img
              src={displayPhoto}
              alt="Ảnh cưới cặp đôi"
              className="w-full h-full object-cover rounded-t-[110px] rounded-b-xl"
            />
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md"
              style={{ backgroundColor: activeColor }}
            >
              {data.groom.shortName} ❤️ {data.bride.shortName}
            </div>
          </div>
        )}

        {/* Vietnamese Traditional Couplets (Câu Đối Đỏ) */}
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto my-4 text-center">
          <div className="p-2 rounded-xl bg-red-50 border border-red-200 shadow-2xs">
            <p className="text-[11px] font-bold text-red-800 leading-tight">
              &ldquo;Loan phụng hòa minh kết lương duyên&rdquo;
            </p>
          </div>
          <div className="p-2 rounded-xl bg-red-50 border border-red-200 shadow-2xs">
            <p className="text-[11px] font-bold text-red-800 leading-tight">
              &ldquo;Trăm năm hạnh phúc vẹn đôi đường&rdquo;
            </p>
          </div>
        </div>

        {/* Couple Names */}
        <div className="space-y-1">
          <span className="text-xs text-amber-800 uppercase tracking-widest font-semibold block">
            HÔN LỄ THÀNH HÔN
          </span>
          <div className="flex flex-col items-center justify-center font-serif py-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase" style={{ color: activeColor }}>
              {data.groom.shortName}
            </span>
            <div className="flex items-center justify-center gap-2.5 my-1">
              <span className="w-8 h-px bg-amber-600/40" />
              <span className="italic text-base sm:text-lg font-light text-amber-600">
                &amp;
              </span>
              <span className="w-8 h-px bg-amber-600/40" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase" style={{ color: activeColor }}>
              {data.bride.shortName}
            </span>
          </div>
          <p className="text-xs text-stone-500 uppercase tracking-widest">
            {data.ceremonies[0]?.dateSolar} (Âm lịch: {data.ceremonies[0]?.dateLunar})
          </p>
        </div>
      </div>

      {/* Traditional Countdown */}
      <div className="px-4 py-4">
        <CountdownTimer
          targetDateStr={data.ceremonies[0]?.dateSolar || '2026-10-24'}
          theme="traditional"
          activeColor={activeColor}
        />
      </div>

      {/* Bilateral Parents Table (Bảng Gia Đình Hai Bên Đối Xứng Chuẩn Thiệp Việt) */}
      <div className="px-5 py-8 my-6 bg-gradient-to-b from-red-50/70 to-amber-50/50 border-t-2 border-b-2 border-red-200">
        <div className="text-center mb-6">
          <span className="text-3xl text-red-600 block mb-1">囍</span>
          <h2 className="text-xl font-bold uppercase tracking-wider text-red-900">
            HÔN PHỐI HAI HỌ
          </h2>
          <p className="text-xs text-stone-600 italic">Kính báo tin vui đến toàn thể Quý bà con hai họ</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          {/* Nhà Trai */}
          <div className="p-4 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md">
            <span className="font-bold text-sm text-red-800 uppercase tracking-wider block mb-2 border-b border-red-100 pb-1">
              NHÀ TRAI
            </span>
            <p className="text-stone-600 text-[11px]">Thân phụ: <strong className="text-stone-900">{data.groom.fatherName}</strong></p>
            <p className="text-stone-600 text-[11px] mb-3">Thân mẫu: <strong className="text-stone-900">{data.groom.motherName}</strong></p>
            <div className="border-t border-dashed border-red-200 pt-2">
              <span className="text-[11px] font-bold text-amber-700 block">{data.groom.birthOrder}</span>
              <p className="font-bold text-base text-red-900 mt-0.5">{data.groom.fullName}</p>
            </div>
          </div>

          {/* Nhà Gái */}
          <div className="p-4 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md">
            <span className="font-bold text-sm text-red-800 uppercase tracking-wider block mb-2 border-b border-red-100 pb-1">
              NHÀ GÁI
            </span>
            <p className="text-stone-600 text-[11px]">Thân phụ: <strong className="text-stone-900">{data.bride.fatherName}</strong></p>
            <p className="text-stone-600 text-[11px] mb-3">Thân mẫu: <strong className="text-stone-900">{data.bride.motherName}</strong></p>
            <div className="border-t border-dashed border-red-200 pt-2">
              <span className="text-[11px] font-bold text-rose-700 block">{data.bride.birthOrder}</span>
              <p className="font-bold text-base text-red-900 mt-0.5">{data.bride.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ceremonies Timeline */}
      <div className="px-6 py-6 space-y-4">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            CHƯƠNG TRÌNH
          </span>
          <h2 className="text-xl font-bold text-red-900 mt-0.5">
            Lễ Nghi &amp; Tiệc Mừng
          </h2>
        </div>

        {data.ceremonies.map((c, i) => (
          <div
            key={c.id || i}
            className="p-5 rounded-2xl bg-white border-2 shadow-sm transition-hover hover:shadow-md"
            style={{ borderColor: activeColor + '40' }}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
              <span className="font-bold text-sm uppercase tracking-wider" style={{ color: activeColor }}>
                🏮 {c.title}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs" style={{ backgroundColor: activeColor }}>
                {c.time}
              </span>
            </div>
            <p className="text-xs text-stone-700">
              <strong>Ngày Dương Lịch:</strong> {c.dateSolar}
            </p>
            <p className="text-xs font-bold text-red-800 mt-0.5">
              <strong>Ngày Âm Lịch:</strong> {c.dateLunar}
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
                className="inline-flex items-center gap-1.5 text-xs font-bold mt-3 hover:underline"
                style={{ color: activeColor }}
              >
                <span>📍 Xem sơ đồ &amp; chỉ đường</span>
                <span>→</span>
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Dress Code Section */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-center space-y-3 shadow-xs">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-900 font-bold block">
            🏮 TRANG PHỤC GỢI Ý
          </span>
          <h3 className="text-lg font-serif font-bold text-red-950">
            {data.dressCode?.title || 'Dress Code Ngày Vui'}
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed max-w-xs mx-auto">
            {data.dressCode?.description || 'Để hôn lễ thêm phần đồng điệu và trang nhã, kính mời quý quan viên hai họ và bạn bè ưu tiên các gam màu sau:'}
          </p>
          <div className="flex justify-center items-center gap-3 pt-2">
            {(data.dressCode?.colors || [
              { name: 'Đỏ Đô', hex: '#9E2A2B' },
              { name: 'Vàng Đồng', hex: '#D4AF37' },
              { name: 'Be Pastel', hex: '#EAD7C5' },
              { name: 'Trắng Sữa', hex: '#FAF9F6' }
            ]).map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full shadow-md border-2 border-white transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[10px] text-stone-700 font-medium">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (() => {
        const totalImages = data.galleryImages.length;
        const displayImages = showAllPhotos ? data.galleryImages : data.galleryImages.slice(0, 5);
        const hasMore = totalImages > 5;
        const remainingCount = totalImages - 5;

        return (
          <div className="px-6 py-10 bg-red-50/40 border-t border-b border-red-100">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                KHOẢNH KHẮC
              </span>
              <h2 className="text-xl font-bold text-red-900 mt-0.5">
                Album Ảnh Cưới
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 font-sans">
                {totalImages} bức ảnh ghi dấu ngày hạnh phúc
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {displayImages.map((img, i) => {
                const isFifthWhenCollapsed = !showAllPhotos && hasMore && i === 4;
                return (
                  <div
                    key={i}
                    onClick={() => onOpenLightbox(i)}
                    className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-sm border-2 border-white bg-stone-100 relative"
                  >
                    <img
                      src={img}
                      alt={`Album ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {isFifthWhenCollapsed ? (
                      <div
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-2 gap-1 cursor-pointer hover:bg-black/70 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllPhotos(true);
                        }}
                      >
                        <span className="text-xl font-bold text-amber-300">+{remainingCount}</span>
                        <span className="text-[10px] font-semibold">Xem thêm ảnh</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[11px] font-sans px-2 py-0.5 bg-black/60 rounded-full">
                          🔍 Phóng to
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
                  className="px-6 py-2.5 rounded-full border border-red-300 bg-white text-red-800 font-serif text-xs font-bold shadow-xs hover:bg-red-50 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>{showAllPhotos ? '↑ Thu gọn bớt ảnh' : `📸 Xem thêm ${remainingCount} ảnh cưới khác ↓`}</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

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

      {/* RSVP */}
      {data.enableRSVP && (
        <div className="px-6 py-8 bg-white border-t border-red-100">
          <div className="text-center mb-5">
            <span className="text-2xl text-red-600 block mb-1">💌</span>
            <h3 className="text-lg font-bold text-red-900 uppercase tracking-wider">
              Hồi Báo Tham Dự (RSVP)
            </h3>
            <p className="text-xs text-stone-500">
              Để gia đình đón tiếp chu đáo nhất, xin Quý khách phản hồi trước ngày cưới
            </p>
          </div>

          {rsvpSent ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center text-red-800 text-xs font-bold">
              ✓ Cảm ơn Quý Khách! Gia đình đã ghi nhận xác nhận tham dự.
            </div>
          ) : (
            <form onSubmit={onSendRSVP} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_trai')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    rsvpSide === 'nha_trai'
                      ? 'bg-red-700 text-white border-red-700 shadow-md'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Khách Nhà Trai
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpSide('nha_gai')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    rsvpSide === 'nha_gai'
                      ? 'bg-red-700 text-white border-red-700 shadow-md'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  Khách Nhà Gái
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="Họ và tên Quý Khách..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-red-600"
              />

              <div className="flex items-center justify-between p-2 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-700">Số lượng người tham dự:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-5 text-center text-red-700">{rsvpCount}</span>
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
                className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 shadow-md hover:brightness-105 active:scale-95 transition-all"
              >
                Gửi Hồi Báo Tham Dự 💌
              </button>
            </form>
          )}
        </div>
      )}

      {/* Guestbook */}
      {data.enableGuestbook && (
        <div className="px-6 py-8 bg-red-50/50 border-t border-red-100">
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold text-red-900 uppercase tracking-wider">
              Sổ Lưu Bút Mừng Cưới
            </h3>
            <p className="text-xs text-stone-500">Gửi lời chúc phúc trăm năm đến hai bạn</p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3 mb-6">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full p-2.5 rounded-xl text-xs border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Lời chúc mừng hạnh phúc..."
              className="w-full p-2.5 rounded-xl text-xs border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-800 transition-all shadow-sm"
            >
              Gửi Lời Chúc Phúc 囍
            </button>
          </form>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-red-100 text-xs shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-red-900">{w.name}</strong>
                  <span className="text-[10px] text-stone-400">{w.time}</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traditional Footer */}
      <div className="py-8 text-center bg-red-950 text-amber-200 text-xs">
        <span className="text-2xl block mb-1">囍</span>
        <p className="italic max-w-xs mx-auto mb-2 text-stone-200">
          {data.thankYouMessage || 'Sự hiện diện của Quý khách là niềm vinh hạnh to lớn cho gia đình chúng tôi!'}
        </p>
        <p className="text-[10px] text-amber-400/80 uppercase tracking-widest font-mono">
          TRÂN TRỌNG CẢM TẠ
        </p>
      </div>
    </div>
  );
};
