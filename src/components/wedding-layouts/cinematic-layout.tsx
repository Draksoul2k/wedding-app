'use client';

import React from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { CountdownTimer } from './countdown-timer';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface CinematicLayoutProps {
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

export const CinematicLayout: React.FC<CinematicLayoutProps> = ({
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
  const mainCeremony = data.ceremonies[0];
  const targetDateStr = mainCeremony?.dateSolar || '2026-10-24';

  // Default clean cinematic couple portrait if user has not uploaded a photo yet
  const defaultCinematicPhoto = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80';
  const isCatalogScreenshot = (url?: string) => Boolean(url && (url.includes('/templates/cinelove/') || url.includes('/templates/motdoi/')));
  const displayPhoto = data.heroPhoto && !isCatalogScreenshot(data.heroPhoto)
    ? data.heroPhoto
    : defaultCinematicPhoto;

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen font-sans selection:bg-amber-400 selection:text-black">
      {/* Cinematic Top Marquee */}
      <div className="bg-black/95 border-b border-amber-500/30 py-3 text-center px-4">
        <span className="text-[10px] tracking-[0.4em] uppercase text-amber-400 font-mono font-bold block">
          ★ A CINEMATIC WEDDING INVITATION ★
        </span>
        <p className="text-[9px] tracking-[0.25em] text-stone-400 uppercase mt-0.5 font-mono">
          PREMIERING WORLDWIDE • {mainCeremony?.dateSolar?.split('-')[0] || '2026'}
        </p>
      </div>

      {/* Movie Poster Hero Section - Single Elegant Overlay Typography on Clean Photo */}
      <div className="p-4 bg-gradient-to-b from-stone-950 via-black to-stone-950 text-center">
        <div className="relative max-w-[320px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-stone-900 group">
          <img
            src={displayPhoto}
            alt="Wedding Poster"
            className="w-full h-full object-cover select-none filter brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none" />

          {/* Top Script Accent */}
          <div className="absolute top-4 inset-x-0 text-center pointer-events-none">
            <span className="font-serif italic text-amber-200 text-sm tracking-widest drop-shadow-md">
              Save The Date
            </span>
          </div>

          {/* Centerpiece Movie Poster Typography: LIVE DYNAMIC COUPLE NAMES */}
          <div className="absolute inset-x-4 bottom-5 text-center space-y-1 pointer-events-none">
            <span className="text-[9px] tracking-[0.3em] uppercase font-mono text-amber-400/90 font-bold block">
              LỄ THÀNH HÔN
            </span>
            <div className="flex flex-col items-center justify-center font-serif tracking-wider font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] py-0.5">
              <span className="text-2xl sm:text-3xl uppercase leading-tight">
                {data.groom.shortName || data.groom.fullName || 'CHÚ RỂ'}
              </span>
              <div className="flex items-center justify-center gap-2.5 my-1">
                <span className="w-8 h-px bg-amber-400/50" />
                <span className="text-amber-300 font-serif italic text-base sm:text-lg font-light">&amp;</span>
                <span className="w-8 h-px bg-amber-400/50" />
              </div>
              <span className="text-2xl sm:text-3xl uppercase leading-tight">
                {data.bride.shortName || data.bride.fullName || 'CÔ DÂU'}
              </span>
            </div>
            <p className="text-xs font-mono tracking-widest text-amber-200 drop-shadow-md pt-0.5">
              {mainCeremony?.dateSolar || '2026-10-25'}
            </p>
          </div>
        </div>

        {data.loveStory?.quotes && (
          <p className="text-[11px] text-stone-400 italic max-w-xs mx-auto leading-relaxed mt-3 font-serif">
            &ldquo;{data.loveStory.quotes}&rdquo;
          </p>
        )}
      </div>

      {/* Digital Countdown Timer */}
      <div className="px-4 -mt-6 relative z-20">
        <CountdownTimer
          targetDateStr={data.ceremonies[0]?.dateSolar || '2026-10-24'}
          theme="cinema"
          activeColor={activeColor}
        />
      </div>

      {/* Cast & Crew (Parents & Couple) */}
      <div className="px-6 py-12 border-t border-b border-stone-800/80 my-8 bg-gradient-to-b from-stone-900/60 to-stone-950">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">
            STARRING CAST
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1">
            Gia Đình & Nhân Vật Chính
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Nhà Trai */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-xl">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block mb-2 font-bold">
              [ NHÀ TRAI ]
            </span>
            <p className="text-stone-400 text-[11px]">Bố: <strong className="text-stone-200">{data.groom.fatherName}</strong></p>
            <p className="text-stone-400 text-[11px] mb-3">Mẹ: <strong className="text-stone-200">{data.groom.motherName}</strong></p>
            <div className="border-t border-stone-800 pt-2">
              <span className="text-[10px] text-amber-300/80 uppercase font-mono">{data.groom.birthOrder}</span>
              <p className="font-bold text-sm text-stone-100 mt-0.5">{data.groom.fullName}</p>
            </div>
          </div>

          {/* Nhà Gái */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-xl">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block mb-2 font-bold">
              [ NHÀ GÁI ]
            </span>
            <p className="text-stone-400 text-[11px]">Bố: <strong className="text-stone-200">{data.bride.fatherName}</strong></p>
            <p className="text-stone-400 text-[11px] mb-3">Mẹ: <strong className="text-stone-200">{data.bride.motherName}</strong></p>
            <div className="border-t border-stone-800 pt-2">
              <span className="text-[10px] text-amber-300/80 uppercase font-mono">{data.bride.birthOrder}</span>
              <p className="font-bold text-sm text-stone-100 mt-0.5">{data.bride.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premiere Screening Schedule (Ceremonies) */}
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">
            SHOWTIME ITINERARY
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1">
            Lịch Chiếu & Hôn Lễ
          </h2>
        </div>

        <div className="space-y-4">
          {data.ceremonies.map((c, i) => (
            <div
              key={c.id || i}
              className="p-5 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-2xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  🎬 {c.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {c.time}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                <strong>Ngày:</strong> {c.dateSolar} ({c.dateLunar})
              </p>
              <p className="text-xs text-stone-300 mt-1">
                <strong>Địa điểm:</strong> {c.venueName}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">{c.address}</p>

              {c.mapUrl && (
                <a
                  href={c.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 mt-3 font-semibold hover:underline"
                >
                  <span>📍 Mở bản đồ rạp cưới</span>
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Premiere Dress Code */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/20 text-center space-y-3 shadow-xl">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono font-bold block">
            PREMIERE ATTIRE
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-100">
            {data.dressCode?.title || 'Dress Code Thảm Đỏ'}
          </h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            {data.dressCode?.description || 'Để những thước phim kỷ niệm thêm phần hoàn mỹ và đồng điệu, kính mong quý khách ưu tiên trang phục theo các tông màu:'}
          </p>
          <div className="flex justify-center items-center gap-3 pt-2">
            {(data.dressCode?.colors || [
              { name: 'Đen Cinema', hex: '#1c1917' },
              { name: 'Vàng Kim', hex: '#d4af37' },
              { name: 'Trắng Kem', hex: '#fdfbf7' },
              { name: 'Rượu Vang', hex: '#581c87' }
            ]).map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full shadow-lg border border-amber-500/40 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[10px] text-stone-400 font-mono">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 35mm Filmstrip Photo Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (() => {
        const totalImages = data.galleryImages.length;
        const displayImages = showAllPhotos ? data.galleryImages : data.galleryImages.slice(0, 5);
        const hasMore = totalImages > 5;
        const remainingCount = totalImages - 5;

        return (
          <div className="py-10 bg-black/90 border-t border-b border-stone-800">
            <div className="text-center px-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono font-bold">
                PHOTO REEL
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1">
                Thước Phim Kỷ Niệm
              </h2>
              <p className="text-xs text-stone-400 mt-0.5 font-mono">
                {totalImages} frames ghi dấu câu chuyện tình yêu
              </p>
            </div>

            {/* Filmstrip Wrapper with Sprocket Holes */}
            <div className="relative px-3">
              {/* Top Sprockets */}
              <div className="flex justify-between gap-2 overflow-hidden mb-2 px-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-xs bg-stone-800 shrink-0" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {displayImages.map((img, i) => {
                  const isFifthWhenCollapsed = !showAllPhotos && hasMore && i === 4;
                  return (
                    <div
                      key={i}
                      onClick={() => onOpenLightbox(i)}
                      className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-800 cursor-pointer relative group bg-stone-900"
                    >
                      <img
                        src={img}
                        alt={`Film frame ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                        loading="lazy"
                      />
                      {isFifthWhenCollapsed ? (
                        <div
                          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-center p-2 gap-1 cursor-pointer hover:bg-black/90 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllPhotos(true);
                          }}
                        >
                          <span className="text-2xl font-mono font-bold text-amber-400">+{remainingCount}</span>
                          <span className="text-[10px] font-mono tracking-wider">MORE FRAMES</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-amber-300 font-mono text-xs">VIEW FRAME {i + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sprockets */}
              <div className="flex justify-between gap-2 overflow-hidden mt-2 px-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-xs bg-stone-800 shrink-0" />
                ))}
              </div>
            </div>

            {hasMore && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="px-6 py-2.5 rounded-full border border-amber-500/40 bg-stone-900 text-amber-300 font-mono text-xs font-bold shadow-md hover:bg-stone-800 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>{showAllPhotos ? '↑ COLLAPSE FRAMES' : `🎬 XEM THÊM ${remainingCount} FRAME KHÁC ↓`}</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* VIP VietQR Gifting */}
      {data.enableVietQR && (
        <div className="px-4 py-8">
          <div className="p-1 rounded-3xl bg-gradient-to-br from-amber-400/40 via-stone-800 to-amber-600/40 shadow-2xl">
            <div className="bg-stone-900 rounded-[22px] p-2 text-stone-100">
              <VietQRGiftBox
                groomBank={data.groom.bank}
                brideBank={data.bride.bank}
                primaryColor="#f59e0b"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cinema Ticket Boarding Pass RSVP */}
      {data.enableRSVP && (
        <div className="px-6 py-8">
          <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
                ADMIT ONE • CINEMA RSVP
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
                Đặt Chỗ Tham Dự Buổi Chiếu
              </h3>
            </div>

            {rsvpSent ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-center text-amber-300 text-xs font-mono">
                ✓ VÉ ĐÃ ĐƯỢC XÁC NHẬN. HẸN GẶP BẠN TẠI HÔN LỄ!
              </div>
            ) : (
              <form onSubmit={onSendRSVP} className="space-y-4 text-xs font-mono">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_trai')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      rsvpSide === 'nha_trai'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-lg'
                        : 'bg-stone-950 text-stone-400 border-stone-800'
                    }`}
                  >
                    KHÁCH NHÀ TRAI
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_gai')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      rsvpSide === 'nha_gai'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-lg'
                        : 'bg-stone-950 text-stone-400 border-stone-800'
                    }`}
                  >
                    KHÁCH NHÀ GÁI
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Tên khách mời..."
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 text-xs">Số lượng vé (người):</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-800 text-stone-100 font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-amber-300">{rsvpCount}</span>
                    <button
                      type="button"
                      onClick={() => setRsvpCount(rsvpCount + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-800 text-stone-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 to-amber-500 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  XÁC NHẬN VÉ MỜI 🎟️
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Guestbook Reviews */}
      {data.enableGuestbook && (
        <div className="px-6 py-8 bg-stone-900/50 border-t border-stone-800">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
              AUDIENCE REVIEWS
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
              Lời Chúc & Đánh Giá
            </h3>
          </div>

          <form onSubmit={onAddWish} className="space-y-3 mb-6">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Lời chúc phúc đến đôi tân lang tân nương..."
              className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-md"
            >
              Gửi Lời Chúc Phúc 💌
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-amber-300">{w.name}</strong>
                  <span className="text-[10px] text-stone-500 font-mono">{w.time}</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cine Credits Footer */}
      <div className="py-8 text-center bg-black border-t border-stone-900 text-stone-500 font-mono text-[10px]">
        <p className="text-amber-300 font-serif italic text-xs mb-2">
          {data.thankYouMessage || 'Cảm ơn bạn đã đồng hành cùng câu chuyện tình yêu của chúng tôi!'}
        </p>
        <p className="tracking-widest uppercase">
          A PRODUCTION OF {data.groom.shortName.toUpperCase()} & {data.bride.shortName.toUpperCase()} • 2026
        </p>
      </div>
    </div>
  );
};
