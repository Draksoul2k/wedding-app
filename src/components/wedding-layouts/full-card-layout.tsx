'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeddingInvitationData } from '@/types/wedding';
import { TemplateConfig } from '@/constants/templates';
import { CountdownTimer } from './countdown-timer';
import { MonthlyCalendar } from './monthly-calendar';
import { VietQRGiftBox } from '@/sections/home/components/vietqr-gift-box';

interface FullCardLayoutProps {
  data: WeddingInvitationData;
  template: TemplateConfig;
  activeColor: string;
  activeAccent: string;
  onOpenLightbox?: (index: number) => void;
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

export const FullCardLayout: React.FC<FullCardLayoutProps> = ({
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
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const mainCeremony = data.ceremonies[0];
  const targetDateStr = mainCeremony?.dateSolar || '2026-10-25';

  const defaultColors = [
    { name: 'Trắng Sữa', hex: '#FAF9F6' },
    { name: 'Be / Pastel', hex: '#EAD7C5' },
    { name: 'Terracotta', hex: '#C27D56' },
    { name: 'Xanh Sage', hex: '#8FA392' },
    { name: 'Vàng Cát', hex: '#D1AC00' }
  ];

  const dressCodeColors = data.dressCode?.colors || defaultColors;

  // Dynamically determine dark vs light mode from template metadata
  const isDark =
    (template.bgTexture &&
      (template.bgTexture.toLowerCase().includes('0f0f10') ||
        template.bgTexture.toLowerCase().includes('#000') ||
        template.bgTexture.toLowerCase().includes('#1c1917') ||
        template.bgTexture.toLowerCase().includes('#09090b') ||
        template.bgTexture.toLowerCase().includes('#0f172a'))) ||
    template.primaryColor === '#1c1917' ||
    template.primaryColor === '#0f172a' ||
    template.primaryColor === '#18181b';

  const containerBg = isDark ? '#0c0a09' : (template.bgTexture || '#faf8f5');
  const cardBg = isDark ? '#1c1917' : (template.cardBg || '#ffffff');
  const cardBorder = isDark ? 'border-stone-800' : 'border-stone-200/90 shadow-md';
  const textColor = isDark ? 'text-stone-100' : 'text-stone-800';
  const mutedTextColor = isDark ? 'text-stone-400' : 'text-stone-600';
  const headingColor = isDark ? 'text-white' : 'text-stone-900';
  const inputClass = isDark
    ? 'w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-400'
    : 'w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400';

  const sectionMotion = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  };

  return (
    <div
      className={`min-h-screen relative font-sans ${textColor} selection:bg-amber-400 selection:text-black`}
      style={{ backgroundColor: containerBg }}
    >
      {/* High-Resolution Full Length Artwork Card Header */}
      <div
        className="relative w-full max-w-md mx-auto shadow-2xl overflow-hidden border-b"
        style={{
          backgroundColor: isDark ? '#1c1917' : '#ffffff',
          borderColor: isDark ? '#292524' : '#e7e5e4'
        }}
      >
        {/* Authentic Original Design Frame */}
        <div className="relative">
          <motion.img
            initial={{ scale: 1.04, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            src={template.frameAsset}
            alt={template.name}
            className="w-full h-auto block select-none shadow-inner"
            loading="eager"
          />
          {/* Subtle bottom gradient blending into next section */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(to top, #0c0a09, transparent)'
                : `linear-gradient(to top, ${containerBg}, transparent)`
            }}
          />
        </div>

        {/* Personalized Couple Name Badge Floating Overlay at top */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] text-center pointer-events-none z-10"
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full backdrop-blur-md border shadow-2xl"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.92)',
              color: isDark ? '#ffffff' : '#1c1917',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
            }}
          >
            <span className="text-[11px] font-serif font-bold tracking-wider">
              {data.groom.shortName} ❤️ {data.bride.shortName} • {mainCeremony?.dateSolar}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Wedding Invitation Content Suite */}
      <div
        className="max-w-md mx-auto px-4 py-6 space-y-10"
        style={{ backgroundColor: containerBg }}
      >
        {/* Section 1: Thư Ngỏ & Lời Yêu Thương */}
        {data.loveStory && (
          <motion.div
            {...sectionMotion}
            className={`p-6 rounded-3xl border text-center space-y-3 shadow-xl relative overflow-hidden ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none"
              style={{ backgroundColor: activeColor + '15' }}
            />
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-mono font-semibold"
              style={{ color: activeAccent || activeColor }}
            >
              💌 THƯ BÁO HỶ
            </span>
            <h2 className={`text-xl font-serif font-bold ${headingColor}`}>
              {data.loveStory.title || 'Hành Trình Tình Yêu'}
            </h2>
            <p className={`text-xs ${mutedTextColor} leading-relaxed italic max-w-xs mx-auto`}>
              &ldquo;{data.loveStory.quotes || data.loveStory.content}&rdquo;
            </p>
            <p className={`text-[11px] ${mutedTextColor} leading-relaxed mt-2`}>
              {data.loveStory.content}
            </p>
          </motion.div>
        )}

        {/* Section 2: Đếm Ngược Ngày Trọng Đại */}
        <motion.div {...sectionMotion} className="space-y-3">
          <div className="text-center">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-mono"
              style={{ color: activeAccent || activeColor }}
            >
              COUNTDOWN
            </span>
            <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
              Đếm Ngược Ngày Chung Đôi
            </h3>
          </div>
          <CountdownTimer
            targetDateStr={targetDateStr}
            theme={isDark ? 'cinema' : 'pastel'}
            activeColor={activeColor}
          />
        </motion.div>

        {/* Section 3: Lịch Tháng Đánh Dấu Ngày Cưới */}
        <motion.div {...sectionMotion} className="space-y-3">
          <div className="text-center">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-mono"
              style={{ color: activeAccent || activeColor }}
            >
              CALENDAR
            </span>
            <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
              Thời Gian Tổ Chức
            </h3>
          </div>
          <div
            className={`rounded-3xl p-4 border shadow-xl ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <MonthlyCalendar
              targetDateStr={targetDateStr}
              accentColor={activeColor || '#f59e0b'}
            />
          </div>
        </motion.div>

        {/* Section 4: Gia Đình Hai Bên & Nhân Vật Chính */}
        <motion.div {...sectionMotion} className="space-y-4">
          <div className="text-center">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-mono"
              style={{ color: activeAccent || activeColor }}
            >
              FAMILY & COUPLE
            </span>
            <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
              Gia Đình & Nhân Vật Chính
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Nhà Trai */}
            <div
              className={`p-4 rounded-2xl border shadow-lg ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <span
                className="text-[10px] font-mono tracking-wider uppercase block mb-2 font-bold"
                style={{ color: activeAccent || activeColor }}
              >
                [ NHÀ TRAI ]
              </span>
              <p className={`${mutedTextColor} text-[11px]`}>Bố: <strong className={headingColor}>{data.groom.fatherName}</strong></p>
              <p className={`${mutedTextColor} text-[11px] mb-3`}>Mẹ: <strong className={headingColor}>{data.groom.motherName}</strong></p>
              <div className="border-t border-stone-200/40 pt-2">
                <span className="text-[10px] uppercase font-mono opacity-80" style={{ color: activeColor }}>{data.groom.birthOrder}</span>
                <p className={`font-bold text-sm mt-0.5 ${headingColor}`}>{data.groom.fullName}</p>
              </div>
            </div>

            {/* Nhà Gái */}
            <div
              className={`p-4 rounded-2xl border shadow-lg ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <span
                className="text-[10px] font-mono tracking-wider uppercase block mb-2 font-bold"
                style={{ color: activeAccent || activeColor }}
              >
                [ NHÀ GÁI ]
              </span>
              <p className={`${mutedTextColor} text-[11px]`}>Bố: <strong className={headingColor}>{data.bride.fatherName}</strong></p>
              <p className={`${mutedTextColor} text-[11px] mb-3`}>Mẹ: <strong className={headingColor}>{data.bride.motherName}</strong></p>
              <div className="border-t border-stone-200/40 pt-2">
                <span className="text-[10px] uppercase font-mono opacity-80" style={{ color: activeColor }}>{data.bride.birthOrder}</span>
                <p className={`font-bold text-sm mt-0.5 ${headingColor}`}>{data.bride.fullName}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 5: Lịch Trình Hôn Lễ (Ceremonies) */}
        <motion.div {...sectionMotion} className="space-y-4">
          <div className="text-center">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-mono"
              style={{ color: activeAccent || activeColor }}
            >
              ITINERARY
            </span>
            <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
              Lịch Trình Hôn Lễ
            </h3>
          </div>

          <div className="space-y-3">
            {data.ceremonies.map((c, i) => (
              <div
                key={c.id || i}
                className={`p-4 rounded-2xl border shadow-xl space-y-2 transition-all ${cardBorder}`}
                style={{ backgroundColor: cardBg }}
              >
                <div className="flex items-center justify-between border-b border-stone-200/40 pb-2">
                  <span
                    className="font-mono text-xs font-bold uppercase tracking-wider"
                    style={{ color: activeColor }}
                  >
                    💍 {c.title}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold"
                    style={{
                      backgroundColor: activeColor + '20',
                      color: activeColor,
                      borderColor: activeColor + '40'
                    }}
                  >
                    {c.time}
                  </span>
                </div>
                <div className={`text-xs space-y-1 ${mutedTextColor}`}>
                  <p><strong>Ngày:</strong> {c.dateSolar} ({c.dateLunar})</p>
                  <p><strong>Địa điểm:</strong> <span className={headingColor}>{c.venueName}</span></p>
                  <p className="text-[11px] opacity-90">{c.address}</p>
                </div>

                {c.mapUrl && (
                  <div className="pt-2">
                    <a
                      href={c.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                      style={{ color: activeColor }}
                    >
                      <span>📍 Xem chỉ đường Google Maps</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 6: Dress Code Gợi Ý Trang Phục */}
        <motion.div
          {...sectionMotion}
          className={`p-6 rounded-3xl border text-center space-y-4 shadow-xl ${cardBorder}`}
          style={{ backgroundColor: cardBg }}
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-mono font-semibold"
            style={{ color: activeAccent || activeColor }}
          >
            DRESS CODE
          </span>
          <h3 className={`text-lg font-serif font-bold ${headingColor}`}>
            {data.dressCode?.title || 'Trang Phục Gợi Ý'}
          </h3>
          <p className={`text-xs ${mutedTextColor} max-w-xs mx-auto leading-relaxed`}>
            {data.dressCode?.description || 'Để những bức ảnh kỷ niệm thêm phần đồng điệu và rạng rỡ, kính mong Quý Khách ưu tiên trang phục theo các gam màu sau:'}
          </p>

          {/* Color Palettes Swatches */}
          <div className="flex justify-center items-center gap-3 pt-2">
            {dressCodeColors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full shadow-md border-2 border-stone-300 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className={`text-[10px] font-medium ${mutedTextColor}`}>{color.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 7: Album Kỷ Niệm (Gallery) */}
        {data.galleryImages && data.galleryImages.length > 0 && (
          <motion.div {...sectionMotion} className="space-y-4">
            <div className="text-center">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-mono"
                style={{ color: activeAccent || activeColor }}
              >
                GALLERY
              </span>
              <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
                Khoảnh Khắc Ngọt Ngào
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {data.galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox && onOpenLightbox(i)}
                  className={`aspect-[3/4] rounded-2xl overflow-hidden border cursor-pointer relative group shadow-md ${cardBorder}`}
                  style={{ backgroundColor: isDark ? '#1c1917' : '#f5f5f4' }}
                >
                  <img
                    src={img}
                    alt={`Ảnh cưới ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded-full">
                      🔍 Phóng to
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section 8: Hộp Mừng Cưới VietQR Trực Tiếp */}
        {data.enableVietQR && (
          <motion.div {...sectionMotion} className="space-y-4">
            <div className="text-center">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-mono"
                style={{ color: activeAccent || activeColor }}
              >
                WEDDING GIFT
              </span>
              <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
                Hộp Mừng Cưới & Chúc Phúc
              </h3>
            </div>

            <div
              className={`p-4 rounded-3xl border shadow-2xl ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <VietQRGiftBox
                groomBank={data.groom.bank}
                brideBank={data.bride.bank}
                primaryColor={activeColor || '#f59e0b'}
              />
            </div>
          </motion.div>
        )}

        {/* Section 9: Xác Nhận Tham Dự (RSVP) */}
        {data.enableRSVP && (
          <motion.div
            {...sectionMotion}
            className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <div className="text-center">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-mono"
                style={{ color: activeColor }}
              >
                RSVP INVITATION
              </span>
              <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
                Xác Nhận Tham Dự
              </h3>
              <p className={`text-xs ${mutedTextColor} mt-1`}>
                Kính mong Quý Khách phản hồi trước ngày {mainCeremony?.dateSolar} để gia đình chuẩn bị chu đáo nhất.
              </p>
            </div>

            {rsvpSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-center text-xs font-semibold">
                ✓ Cảm ơn Quý Khách! Phản hồi của bạn đã được gửi thành công.
              </div>
            ) : (
              <form onSubmit={onSendRSVP} className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_trai')}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                      rsvpSide === 'nha_trai'
                        ? 'text-white shadow-lg'
                        : isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                    style={rsvpSide === 'nha_trai' ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                  >
                    Khách Nhà Trai
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_gai')}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                      rsvpSide === 'nha_gai'
                        ? 'text-white shadow-lg'
                        : isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                    style={rsvpSide === 'nha_gai' ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                  >
                    Khách Nhà Gái
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Họ và tên của Quý Khách..."
                  className={inputClass}
                />

                <div
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isDark ? 'bg-stone-950 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <span className={mutedTextColor}>Số lượng người tham dự:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                      className={`w-7 h-7 rounded-lg font-bold ${
                        isDark ? 'bg-stone-800 text-white hover:bg-stone-700' : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                      }`}
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm" style={{ color: activeColor }}>
                      {rsvpCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRsvpCount(rsvpCount + 1)}
                      className={`w-7 h-7 rounded-lg font-bold ${
                        isDark ? 'bg-stone-800 text-white hover:bg-stone-700' : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-all shadow-lg text-xs"
                  style={{ backgroundColor: activeColor }}
                >
                  Xác Nhận Tham Dự 💌
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Section 10: Sổ Lưu Bút & Lời Chúc (Guestbook) */}
        <motion.div
          {...sectionMotion}
          className={`p-6 rounded-3xl border space-y-5 shadow-2xl ${cardBorder}`}
          style={{ backgroundColor: cardBg }}
        >
          <div className="text-center">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-mono"
              style={{ color: activeAccent || activeColor }}
            >
              GUESTBOOK
            </span>
            <h3 className={`text-lg font-serif font-bold mt-0.5 ${headingColor}`}>
              Gửi Lời Chúc Phúc
            </h3>
          </div>

          <form onSubmit={onAddWish} className="space-y-2.5">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Tên của bạn..."
              className={inputClass}
            />
            <textarea
              required
              rows={2}
              value={newWishContent}
              onChange={(e) => setNewWishContent(e.target.value)}
              placeholder="Gửi lời chúc phúc trăm năm tới cô dâu & chú rể..."
              className={inputClass}
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white active:scale-95 transition-all shadow-md"
              style={{ backgroundColor: activeColor }}
            >
              Gửi Lời Chúc Mừng 💌
            </button>
          </form>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <strong style={{ color: activeColor }}>{w.name}</strong>
                  <span className={`text-[10px] font-mono ${mutedTextColor}`}>{w.time}</span>
                </div>
                <p className={`${textColor} text-[11px] leading-relaxed`}>{w.content}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Note */}
        <motion.div
          {...sectionMotion}
          className={`text-center py-6 border-t border-stone-200/40 ${mutedTextColor} text-xs italic`}
        >
          <p>{data.thankYouMessage}</p>
          <p className={`mt-2 font-serif font-bold text-sm ${headingColor}`}>
            {data.groom.shortName} &amp; {data.bride.shortName}
          </p>
        </motion.div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 left-0 right-0 px-4 z-40 max-w-md mx-auto">
        <div
          className="p-2 rounded-2xl backdrop-blur-md border shadow-2xl flex items-center justify-between gap-2"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.92)',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <button
            onClick={() => setShowRsvpModal(true)}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            style={{ backgroundColor: activeColor }}
          >
            <span>💌</span>
            <span>Xác Nhận Tham Dự</span>
          </button>

          {data.enableVietQR && (
            <button
              onClick={() => setShowGiftModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs border shadow-lg active:scale-95 transition-all flex items-center gap-1 ${
                isDark ? 'bg-stone-900 text-amber-300 border-amber-400/40' : 'bg-white text-stone-800 border-stone-300'
              }`}
            >
              <span>💳</span>
              <span>Mừng Cưới</span>
            </button>
          )}
        </div>
      </div>

      {/* RSVP Quick Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <button
              onClick={() => setShowRsvpModal(false)}
              className={`absolute top-4 right-4 ${mutedTextColor} hover:${textColor} text-lg`}
            >
              ✕
            </button>

            <h3 className={`text-lg font-serif font-bold text-center ${headingColor}`}>
              Xác Nhận Tham Dự (RSVP)
            </h3>

            {rsvpSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-700 text-center text-xs font-medium">
                ✓ Cảm ơn bạn! Xác nhận đã được ghi nhận.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  onSendRSVP(e);
                  setTimeout(() => setShowRsvpModal(false), 1200);
                }}
                className="space-y-3 text-xs"
              >
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_trai')}
                    className={`flex-1 py-2 rounded-xl border font-bold ${
                      rsvpSide === 'nha_trai'
                        ? 'text-white'
                        : isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                    style={rsvpSide === 'nha_trai' ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                  >
                    Khách Nhà Trai
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpSide('nha_gai')}
                    className={`flex-1 py-2 rounded-xl border font-bold ${
                      rsvpSide === 'nha_gai'
                        ? 'text-white'
                        : isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                    style={rsvpSide === 'nha_gai' ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                  >
                    Khách Nhà Gái
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Họ và tên của bạn..."
                  className={inputClass}
                />

                <div
                  className={`flex items-center justify-between p-2 rounded-xl border ${
                    isDark ? 'bg-stone-950 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <span className={mutedTextColor}>Số lượng người:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                      className={`w-6 h-6 rounded font-bold ${
                        isDark ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold" style={{ color: activeColor }}>
                      {rsvpCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRsvpCount(rsvpCount + 1)}
                      className={`w-6 h-6 rounded font-bold ${
                        isDark ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-white active:scale-95 transition-all shadow-md"
                  style={{ backgroundColor: activeColor }}
                >
                  Gửi Phản Hồi Ngay 💌
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Gift Quick Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <button
              onClick={() => setShowGiftModal(false)}
              className={`absolute top-4 right-4 ${mutedTextColor} hover:${textColor} text-lg`}
            >
              ✕
            </button>
            <h3
              className="text-lg font-serif font-bold text-center"
              style={{ color: activeColor }}
            >
              Hộp Mừng Cưới VietQR
            </h3>
            <VietQRGiftBox
              groomBank={data.groom.bank}
              brideBank={data.bride.bank}
              primaryColor={activeColor || '#f59e0b'}
            />
          </div>
        </div>
      )}
    </div>
  );
};
