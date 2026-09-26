'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  guestName?: string;
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
  onEditField?: (field: 'couple' | 'date') => void;
}

export const FullCardLayout: React.FC<FullCardLayoutProps> = ({
  data,
  template,
  activeColor,
  activeAccent,
  guestName,
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
  onEditField,
}) => {
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mainCeremony = data.ceremonies[0];
  const targetDateStr = mainCeremony?.dateSolar || '2026-10-25';

  const displayPhoto = data.heroPhoto || template.frameAsset;

  const defaultColors = [
    { name: 'Trắng Sữa', hex: '#FAF9F6' },
    { name: 'Be / Pastel', hex: '#EAD7C5' },
    { name: 'Terracotta', hex: '#C27D56' },
    { name: 'Xanh Sage', hex: '#8FA392' },
    { name: 'Vàng Cát', hex: '#D1AC00' }
  ];

  const dressCodeColors = data.dressCode?.colors || defaultColors;

  // Determine dark vs light theme based on background texture
  const isDark = Boolean(
    template.bgTexture &&
      (template.bgTexture.toLowerCase().includes('0f0f10') ||
        template.bgTexture.toLowerCase() === '#000' ||
        template.bgTexture.toLowerCase() === '#000000' ||
        template.bgTexture.toLowerCase() === '#0c0a09' ||
        template.bgTexture.toLowerCase() === '#09090b')
  );

  const containerBg = isDark
    ? '#0c0a09'
    : (template.bgTexture && template.bgTexture.startsWith('#') && !template.bgTexture.includes('0f0f10')
        ? template.bgTexture
        : '#faf8f5');
  const cardBg = isDark ? '#1a1816' : (template.cardBg || '#ffffff');
  const cardBorder = isDark ? 'border-stone-800' : 'border-stone-200/90 shadow-lg';
  const textColor = isDark ? 'text-stone-100' : 'text-stone-800';
  const mutedTextColor = isDark ? 'text-stone-400' : 'text-stone-600';
  const headingColor = isDark ? 'text-white' : 'text-stone-900';
  const inputClass = isDark
    ? 'w-full p-3 rounded-2xl bg-stone-950 border border-stone-700 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-400'
    : 'w-full p-3 rounded-2xl bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400';

  // Smooth kinetic scroll animation preset
  const scrollReveal = {
    initial: { opacity: 0, y: 36, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Google Calendar Link Generator
  const getGoogleCalendarUrl = () => {
    const title = `Lễ Thành Hôn: ${data.groom.shortName} & ${data.bride.shortName}`;
    const details = `Kính mời Quý Khách cùng gia đình tới chung vui cùng đôi uyên ương ${data.groom.fullName} & ${data.bride.fullName}.\nĐịa điểm: ${mainCeremony?.venueName || ''} - ${mainCeremony?.address || ''}`;
    const location = `${mainCeremony?.venueName || ''}, ${mainCeremony?.address || ''}`;
    const cleanDate = targetDateStr.replace(/-/g, '');
    const startTime = `${cleanDate}T030000Z`;
    const endTime = `${cleanDate}T080000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  // Google Maps Link Generator
  const getMapsUrl = (c: { mapUrl?: string; venueName: string; address: string }) => {
    if (c.mapUrl && c.mapUrl.trim()) return c.mapUrl;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.venueName + ' ' + c.address)}`;
  };

  return (
    <div
      className={`min-h-screen relative font-sans ${textColor} selection:bg-amber-400 selection:text-black overflow-x-hidden`}
      style={{ backgroundColor: containerBg }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-semibold shadow-2xl border border-stone-700 flex items-center gap-2 backdrop-blur-md"
          >
            <span>✨</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC MOBILE HERO COVER (Fitted Cover with Kinetic Parallax Reveal) */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-md mx-auto h-[86vh] min-h-[520px] max-h-[700px] overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Background Artwork Frame */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={displayPhoto}
            alt={template.name}
            className="w-full h-full object-cover object-top select-none"
            loading="eager"
          />
        </motion.div>

        {/* Ambient Overlay: Only subtle bottom transition if needed, no dirtying top/middle overlay */}
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60 pointer-events-none" />
        ) : (
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${containerBg} 0%, transparent 100%)`
            }}
          />
        )}

        {/* Top Header: "Save The Date" in Flowing Calligraphy - Crisp ZenLove Typography, No Drop Shadow */}
        <div className="relative z-10 pt-7 px-6 flex justify-between items-start pointer-events-none">
          <div
            className="font-cursive text-3xl sm:text-4xl font-normal select-none"
            style={{
              color: isDark ? '#ffffff' : '#111827',
              textShadow: 'none'
            }}
          >
            Save The Date
          </div>
        </div>

        {/* Lower-Third / Skirt Area: Editable Typography (Cinelove / ZenLove Style Calligraphy) */}
        <div className="relative z-20 px-6 pt-2 pb-2 text-center mt-auto flex flex-col items-center justify-center">
          <div
            onClick={() => onEditField?.('couple')}
            className={`group relative select-none transition-all duration-200 rounded-xl p-2.5 ${
              onEditField
                ? 'cursor-pointer hover:ring-2 hover:ring-sky-400/60 hover:bg-sky-50/10'
                : ''
            }`}
            title={onEditField ? 'Nhấp để chỉnh sửa kiểu chữ và tên' : undefined}
          >
            <div
              className="font-cursive leading-tight text-center"
              style={{
                fontSize: `${data.typography?.fontSize || 42}px`,
                color: data.typography?.color || (isDark ? '#ffffff' : '#111827'),
                fontFamily: data.typography?.fontFamily
                  ? `'${data.typography.fontFamily}', var(--font-charmonman), var(--font-cursive), cursive`
                  : 'var(--font-charmonman), var(--font-cursive), cursive',
                textShadow: 'none'
              }}
            >
              <div>{data.bride.shortName || data.bride.fullName || 'Thanh Hằng'}</div>
              <div className="text-2xl opacity-75 my-0.5 italic font-serif">&amp;</div>
              <div>{data.groom.shortName || data.groom.fullName || 'Minh Trí'}</div>
            </div>
          </div>

          {/* Wedding Solar Date */}
          {targetDateStr && (
            <div
              onClick={() => onEditField?.('date')}
              className={`mt-1 text-xs uppercase tracking-[0.2em] font-mono font-medium select-none transition-all ${
                onEditField ? 'cursor-pointer hover:underline' : ''
              }`}
              style={{
                color: isDark ? '#f1f5f9' : '#374151',
                textShadow: 'none'
              }}
              title={onEditField ? 'Nhấp để chỉnh sửa ngày cưới' : undefined}
            >
              {targetDateStr.split('-').reverse().join(' . ')}
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 pb-6 px-4 text-center space-y-2"
        >
          {/* Personalized Guest Greeting Badge if provided */}
          {guestName && (
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-serif shadow-lg">
                Kính mời: <strong className="text-white text-xs tracking-wide">{guestName}</strong>
              </div>
            </div>
          )}

          {/* Animated Scroll Down Indicator */}
          <div className="flex flex-col items-center justify-center gap-1 text-white/90 animate-bounce">
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-medium drop-shadow-md">
              Vuốt xuống để mở thiệp
            </span>
            <span className="text-sm leading-none drop-shadow-md">↓</span>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WEDDING INVITATION CONTENT SECTIONS (Kinetic Reveal Upon Scroll)  */}
      {/* ========================================================================= */}
      <div className="max-w-md mx-auto px-4 pt-8 pb-32 space-y-12" style={{ backgroundColor: containerBg }}>

        {/* Elegant Couple Headline Header */}
        <motion.div {...scrollReveal} className="text-center pt-2 pb-2 space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] tracking-[0.3em] uppercase font-mono font-bold border"
            style={{
              borderColor: activeColor + '40',
              backgroundColor: activeColor + '10',
              color: activeAccent || activeColor
            }}
          >
            ✦ HAPPY WEDDING ✦
          </div>
          <h1 className={`text-2xl sm:text-3xl font-serif font-black tracking-wide ${headingColor}`}>
            {data.groom.shortName || data.groom.fullName || 'Chú Rể'}{' '}
            <span className="font-serif italic font-light" style={{ color: activeAccent || activeColor }}>
              &amp;
            </span>{' '}
            {data.bride.shortName || data.bride.fullName || 'Cô Dâu'}
          </h1>
          <p className={`text-xs font-mono tracking-wider ${mutedTextColor}`}>
            {mainCeremony?.dateSolar} {mainCeremony?.dateLunar ? `(${mainCeremony?.dateLunar})` : ''}
          </p>
        </motion.div>

        {/* Section 1: Thư Báo Hỷ & Lời Ngỏ Yêu Thương */}
        {data.loveStory && (
          <motion.section
            {...scrollReveal}
            className={`p-6 sm:p-7 rounded-3xl border text-center space-y-3.5 shadow-2xl relative overflow-hidden ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            {/* Ambient Corner Glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: activeColor + '25' }}
            />

            {/* Wax Seal Badge */}
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border shadow-md mx-auto mb-1"
                 style={{ backgroundColor: activeColor + '18', borderColor: activeColor + '40', color: activeColor }}>
              <span className="text-xl">💌</span>
            </div>

            <div className="space-y-1">
              <span
                className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold block"
                style={{ color: activeAccent || activeColor }}
              >
                THƯ BÁO HỶ
              </span>
              <h2 className={`text-xl sm:text-2xl font-serif font-bold ${headingColor}`}>
                {data.loveStory.title || 'Hành Trình Tình Yêu'}
              </h2>
            </div>

            {data.loveStory.quotes && (
              <p className={`text-xs ${mutedTextColor} leading-relaxed italic max-w-xs mx-auto font-serif px-2`}>
                &ldquo;{data.loveStory.quotes}&rdquo;
              </p>
            )}

            <p className={`text-[12px] ${textColor} leading-relaxed pt-1`}>
              {data.loveStory.content}
            </p>

            <div className="pt-2 flex justify-center items-center gap-2 text-stone-400">
              <span className="w-8 h-px bg-stone-300 dark:bg-stone-700" />
              <span className="text-xs" style={{ color: activeColor }}>✦ ✦ ✦</span>
              <span className="w-8 h-px bg-stone-300 dark:bg-stone-700" />
            </div>
          </motion.section>
        )}

        {/* Section 2: Đếm Ngược Ngày Chung Đôi */}
        <motion.section {...scrollReveal} className="space-y-3.5 text-center">
          <div className="space-y-1">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              COUNTDOWN
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              Đếm Ngược Ngày Chung Đôi
            </h3>
          </div>
          <div className="shadow-xl rounded-3xl p-1">
            <CountdownTimer
              targetDateStr={targetDateStr}
              theme={isDark ? 'cinema' : 'pastel'}
              activeColor={activeColor}
            />
          </div>
        </motion.section>

        {/* Section 3: Lịch Tháng & Thêm Vào Lịch Điện Thoại */}
        <motion.section {...scrollReveal} className="space-y-3.5">
          <div className="text-center space-y-1">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              CALENDAR
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              Thời Gian Tổ Chức
            </h3>
          </div>

          <div
            className={`rounded-3xl p-4 sm:p-5 border shadow-xl space-y-4 ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <MonthlyCalendar
              targetDateStr={targetDateStr}
              accentColor={activeColor || '#f59e0b'}
            />

            {/* Google Calendar Direct Add Button */}
            <div className="pt-2 text-center">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all hover:brightness-110"
                style={{ backgroundColor: activeColor }}
              >
                <span>📅</span>
                <span>Thêm vào Google Calendar của bạn</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Gia Đình Hai Bên & Cô Dâu Chú Rể */}
        <motion.section {...scrollReveal} className="space-y-4">
          <div className="text-center space-y-1">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              FAMILY & COUPLE
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              Gia Đình & Nhân Vật Chính
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Nhà Trai */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`p-4 rounded-2xl border shadow-lg space-y-2 relative overflow-hidden ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <div
                className="w-1.5 h-6 rounded-full absolute top-4 left-0"
                style={{ backgroundColor: activeColor }}
              />
              <span
                className="text-[10px] font-mono tracking-wider uppercase block font-bold"
                style={{ color: activeAccent || activeColor }}
              >
                [ NHÀ TRAI ]
              </span>
              <p className={`${mutedTextColor} text-[11px]`}>Bố: <strong className={headingColor}>{data.groom.fatherName}</strong></p>
              <p className={`${mutedTextColor} text-[11px] mb-2`}>Mẹ: <strong className={headingColor}>{data.groom.motherName}</strong></p>
              <div className="border-t border-stone-200/40 pt-2">
                <span className="text-[10px] uppercase font-mono opacity-80 block" style={{ color: activeColor }}>
                  {data.groom.birthOrder}
                </span>
                <p className={`font-serif font-bold text-base mt-0.5 ${headingColor}`}>
                  {data.groom.fullName}
                </p>
              </div>
            </motion.div>

            {/* Nhà Gái */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`p-4 rounded-2xl border shadow-lg space-y-2 relative overflow-hidden ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <div
                className="w-1.5 h-6 rounded-full absolute top-4 right-0"
                style={{ backgroundColor: activeColor }}
              />
              <span
                className="text-[10px] font-mono tracking-wider uppercase block font-bold"
                style={{ color: activeAccent || activeColor }}
              >
                [ NHÀ GÁI ]
              </span>
              <p className={`${mutedTextColor} text-[11px]`}>Bố: <strong className={headingColor}>{data.bride.fatherName}</strong></p>
              <p className={`${mutedTextColor} text-[11px] mb-2`}>Mẹ: <strong className={headingColor}>{data.bride.motherName}</strong></p>
              <div className="border-t border-stone-200/40 pt-2">
                <span className="text-[10px] uppercase font-mono opacity-80 block" style={{ color: activeColor }}>
                  {data.bride.birthOrder}
                </span>
                <p className={`font-serif font-bold text-base mt-0.5 ${headingColor}`}>
                  {data.bride.fullName}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 5: Lịch Trình Hôn Lễ (Itinerary / Timeline) */}
        <motion.section {...scrollReveal} className="space-y-4">
          <div className="text-center space-y-1">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              ITINERARY
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              Lịch Trình Hôn Lễ
            </h3>
          </div>

          <div className="space-y-3.5">
            {data.ceremonies.map((c, i) => (
              <motion.div
                key={c.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-5 rounded-2xl border shadow-xl space-y-3 transition-all ${cardBorder}`}
                style={{ backgroundColor: cardBg }}
              >
                <div className="flex items-center justify-between border-b border-stone-200/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💍</span>
                    <span
                      className="font-serif text-sm font-bold tracking-wide"
                      style={{ color: activeColor }}
                    >
                      {c.title}
                    </span>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xs"
                    style={{
                      backgroundColor: activeColor + '18',
                      color: activeColor,
                      border: `1px solid ${activeColor}40`
                    }}
                  >
                    ⏰ {c.time}
                  </span>
                </div>

                <div className={`text-xs space-y-1.5 ${mutedTextColor}`}>
                  <p>
                    <strong className={headingColor}>Ngày tổ chức:</strong> {c.dateSolar} {c.dateLunar && `(${c.dateLunar})`}
                  </p>
                  <p>
                    <strong className={headingColor}>Địa điểm:</strong> <span className={`font-semibold ${headingColor}`}>{c.venueName}</span>
                  </p>
                  <p className="text-[11px] leading-relaxed opacity-90">{c.address}</p>
                </div>

                {/* Direct Google Maps Direction Link */}
                <div className="pt-2 border-t border-stone-200/30">
                  <a
                    href={getMapsUrl(c)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                    style={{ color: activeColor }}
                  >
                    <span>📍 Xem chỉ đường trên Google Maps</span>
                    <span>→</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 6: Dress Code Gợi Ý Trang Phục */}
        <motion.section
          {...scrollReveal}
          className={`p-6 rounded-3xl border text-center space-y-4 shadow-xl ${cardBorder}`}
          style={{ backgroundColor: cardBg }}
        >
          <div className="space-y-1">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              DRESS CODE
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              {data.dressCode?.title || 'Trang Phục Gợi Ý'}
            </h3>
          </div>

          <p className={`text-xs ${mutedTextColor} max-w-xs mx-auto leading-relaxed`}>
            {data.dressCode?.description || 'Để những bức ảnh kỷ niệm thêm phần đồng điệu và rạng rỡ, kính mong Quý Khách ưu tiên trang phục theo các gam màu sau:'}
          </p>

          {/* Color Palettes Swatches with Entrance Animation */}
          <div className="flex justify-center items-center gap-3 pt-2 flex-wrap">
            {dressCodeColors.map((color, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-11 h-11 rounded-full shadow-lg border-2 border-white/80 transition-transform active:scale-110 cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  onClick={() => showToast(`Tone màu: ${color.name}`)}
                />
                <span className={`text-[10px] font-medium ${mutedTextColor}`}>{color.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 7: Album Kỷ Niệm (Gallery) */}
        {data.galleryImages && data.galleryImages.length > 0 && (() => {
          const totalImages = data.galleryImages.length;
          const displayImages = showAllPhotos ? data.galleryImages : data.galleryImages.slice(0, 5);
          const hasMore = totalImages > 5;
          const remainingCount = totalImages - 5;

          return (
            <motion.section {...scrollReveal} className="space-y-4">
              <div className="text-center space-y-1">
                <span
                  className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
                  style={{ color: activeAccent || activeColor }}
                >
                  GALLERY
                </span>
                <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
                  Khoảnh Khắc Ngọt Ngào
                </h3>
                <p className={`text-xs ${mutedTextColor}`}>
                  {totalImages} bức ảnh kỷ niệm ngày trọng đại
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {displayImages.map((img, i) => {
                  const isFirstAndOdd = i === 0 && (displayImages.length === 5 || displayImages.length % 2 !== 0);
                  const isFifthWhenCollapsed = !showAllPhotos && hasMore && i === 4;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
                      onClick={() => onOpenLightbox && onOpenLightbox(i)}
                      className={`${
                        isFirstAndOdd ? 'col-span-2 aspect-[16/10]' : 'aspect-[3/4]'
                      } rounded-2xl overflow-hidden border cursor-pointer relative group shadow-lg ${cardBorder}`}
                      style={{ backgroundColor: isDark ? '#1c1917' : '#f5f5f4' }}
                    >
                      <img
                        src={img}
                        alt={`Ảnh cưới ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Interactive overlay on 5th photo when collapsed */}
                      {isFifthWhenCollapsed ? (
                        <div
                          className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 gap-1 group-hover:bg-black/70 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllPhotos(true);
                          }}
                        >
                          <span className="text-2xl font-mono font-bold text-amber-300">
                            +{remainingCount}
                          </span>
                          <span className="text-[11px] font-semibold tracking-wide">
                            Xem thêm ảnh
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-full">
                            🔍 Phóng to
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Expand / Collapse Button */}
              {hasMore && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-lg active:scale-95 transition-all hover:brightness-110"
                    style={{ backgroundColor: activeColor }}
                  >
                    <span>📸</span>
                    <span>
                      {showAllPhotos
                        ? 'Thu gọn bớt ảnh ↑'
                        : `Xem thêm ${remainingCount} ảnh cưới khác ↓`}
                    </span>
                  </button>
                </div>
              )}
            </motion.section>
          );
        })()}

        {/* Section 8: Hộp Mừng Cưới & VietQR Trực Tiếp */}
        {data.enableVietQR && (
          <motion.section {...scrollReveal} className="space-y-4">
            <div className="text-center space-y-1">
              <span
                className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
                style={{ color: activeAccent || activeColor }}
              >
                WEDDING GIFT
              </span>
              <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
                Hộp Mừng Cưới &amp; Chúc Phúc
              </h3>
            </div>

            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-2xl ${cardBorder}`}
              style={{ backgroundColor: cardBg }}
            >
              <VietQRGiftBox
                groomBank={data.groom.bank}
                brideBank={data.bride.bank}
                primaryColor={activeColor || '#f59e0b'}
              />
            </div>
          </motion.section>
        )}

        {/* Section 9: Xác Nhận Tham Dự (RSVP) */}
        {data.enableRSVP && (
          <motion.section
            {...scrollReveal}
            className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${cardBorder}`}
            style={{ backgroundColor: cardBg }}
          >
            <div className="text-center space-y-1">
              <span
                className="text-[10px] tracking-[0.35em] uppercase font-mono font-bold"
                style={{ color: activeColor }}
              >
                RSVP INVITATION
              </span>
              <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
                Xác Nhận Tham Dự
              </h3>
              <p className={`text-xs ${mutedTextColor} mt-1`}>
                Kính mong Quý Khách phản hồi trước ngày {mainCeremony?.dateSolar} để gia đình chuẩn bị chu đáo nhất.
              </p>
            </div>

            {rsvpSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center text-xs font-semibold space-y-1">
                <span className="text-2xl block">🎉</span>
                <p>Cảm ơn Quý Khách!</p>
                <p className="font-normal opacity-90">Phản hồi của bạn đã được gia đình ghi nhận.</p>
              </div>
            ) : (
              <form onSubmit={onSendRSVP} className="space-y-3.5 text-xs">
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
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
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
                  className="w-full py-3.5 rounded-2xl font-bold text-white active:scale-95 transition-all shadow-lg text-xs hover:brightness-110"
                  style={{ backgroundColor: activeColor }}
                >
                  Xác Nhận Tham Dự 💌
                </button>
              </form>
            )}
          </motion.section>
        )}

        {/* Section 10: Sổ Lưu Bút & Lời Chúc (Guestbook) */}
        <motion.section
          {...scrollReveal}
          className={`p-6 rounded-3xl border space-y-5 shadow-2xl ${cardBorder}`}
          style={{ backgroundColor: cardBg }}
        >
          <div className="text-center space-y-1">
            <span
              className="text-[10px] uppercase tracking-[0.35em] font-mono font-bold"
              style={{ color: activeAccent || activeColor }}
            >
              GUESTBOOK
            </span>
            <h3 className={`text-xl font-serif font-bold ${headingColor}`}>
              Gửi Lời Chúc Phúc
            </h3>
          </div>

          <form onSubmit={onAddWish} className="space-y-3">
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
              className="w-full py-3 rounded-2xl text-xs font-bold text-white active:scale-95 transition-all shadow-md hover:brightness-110"
              style={{ backgroundColor: activeColor }}
            >
              Gửi Lời Chúc Mừng 💌
            </button>
          </form>

          {/* List of heartfelt wishes */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border text-xs shadow-xs ${
                  isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <strong style={{ color: activeColor }} className="font-serif">{w.name}</strong>
                  <span className={`text-[10px] font-mono ${mutedTextColor}`}>{w.time}</span>
                </div>
                <p className={`${textColor} text-[11px] leading-relaxed`}>{w.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Thank You Note */}
        <motion.div
          {...scrollReveal}
          className={`text-center py-8 border-t border-stone-200/40 ${mutedTextColor} text-xs italic space-y-2`}
        >
          <p className="max-w-xs mx-auto leading-relaxed">{data.thankYouMessage || 'Sự hiện diện của Quý Khách là niềm vinh hạnh lớn nhất cho gia đình chúng tôi!'}</p>
          <p className={`font-serif font-bold text-base not-italic ${headingColor}`}>
            {data.groom.shortName} &amp; {data.bride.shortName}
          </p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM STICKY ACTION BAR (Convenient for mobile users)                 */}
      {/* ========================================================================= */}
      <div className="sticky bottom-4 left-0 right-0 px-4 z-40 max-w-md mx-auto">
        <div
          className="p-2 rounded-2xl backdrop-blur-md border shadow-2xl flex items-center justify-between gap-2"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.92)',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <button
            onClick={() => setShowRsvpModal(true)}
            className="flex-1 py-3 rounded-xl font-bold text-xs text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            style={{ backgroundColor: activeColor }}
          >
            <span>💌</span>
            <span>Xác Nhận Tham Dự</span>
          </button>

          {data.enableVietQR && (
            <button
              onClick={() => setShowGiftModal(true)}
              className={`px-4 py-3 rounded-xl font-bold text-xs border shadow-lg active:scale-95 transition-all flex items-center gap-1.5 ${
                isDark ? 'bg-stone-900 text-amber-300 border-amber-400/40' : 'bg-white text-stone-800 border-stone-300'
              }`}
            >
              <span>💳</span>
              <span>Mừng Cưới</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (Original Art Lightbox, Quick RSVP, Quick VietQR)                */}
      {/* ========================================================================= */}


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
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300 text-center text-xs font-medium">
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
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
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
                  className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-all shadow-md"
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
