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
  const isCineloveMovie = template.id === 'cine-thiep-cuoi-39' || template.layoutType === 'cinelove_movie';

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

  // Real-time Countdown calculation for Hero Showcase
  const [heroCountdown, setHeroCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 120,
    hours: 14,
    minutes: 28,
    seconds: 45
  });

  React.useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateStr || '2026-10-24T11:00:00').getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setHeroCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Mini Calendar calculation for Hero Showcase
  let targetYear = 2026;
  let targetMonth = 12;
  let targetDay = 9;
  try {
    const parts = targetDateStr.split('-');
    if (parts.length === 3) {
      targetYear = parseInt(parts[0], 10);
      targetMonth = parseInt(parts[1], 10);
      targetDay = parseInt(parts[2], 10);
    }
  } catch (e) {}

  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const firstDayIndex = new Date(targetYear, targetMonth - 1, 1).getDay();
  const dayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 for Monday
  const miniCalendarCells: (number | null)[] = [];
  for (let i = 0; i < dayOffset; i++) miniCalendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) miniCalendarCells.push(d);

  // Template-specific Hero Layout Variant
  const heroVariant = React.useMemo(() => {
    const tid = template.id;
    if (template.category === 'truyen_thong' || ['chibi_red', 'baroque_v2_darkred', 'cine-thiep-cuoi-47'].includes(tid)) {
      return 'traditional';
    }
    if (['cine-thiep-cuoi-61', 'cine-thiep-cuoi-40', 'cine-thiep-cuoi-18'].includes(tid)) {
      return 'countdown'; // ZenLove Image 2
    }
    if (['cine-thiep-cuoi-39', 'cine-thiep-cuoi-46', 'cine-thiep-cuoi-16', 'cine-thiep-cuoi-36', 'cine-thiep-cuoi-38'].includes(tid)) {
      return 'calendar'; // ZenLove Image 1
    }
    if (['cine-thiep-cuoi-2', 'cine-thiep-cuoi-114', 'cine-thiep-cuoi-5'].includes(tid)) {
      return 'magazine'; // Vogue Fashion Editorial
    }
    if (['cine-thiep-cuoi-1', 'cine-thiep-cuoi-44', 'cine-thiep-cuoi-41'].includes(tid)) {
      return 'ticket'; // Cinema VIP Ticket Pass
    }
    if (['cine-thiep-cuoi-23', 'cine-thiep-cuoi-42', 'cine-thiep-cuoi-17'].includes(tid)) {
      return 'polaroid'; // Polaroid card taped
    }
    const hash = tid.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const variants: ('calendar' | 'countdown' | 'polaroid' | 'magazine' | 'ticket' | 'traditional')[] = [
      'calendar', 'countdown', 'polaroid', 'magazine', 'ticket', 'traditional'
    ];
    return variants[hash % variants.length];
  }, [template.id, template.category]);

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

  // Helper for Cinelove Text Selection Box
  const renderSelectionHandles = () => {
    if (!onEditField) return null;
    return (
      <>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md border border-gray-200 px-2 py-0.5 flex items-center gap-1.5 text-[10px] text-gray-700 whitespace-nowrap z-30 pointer-events-auto">
          <span className="hover:text-sky-600 cursor-pointer" title="Sao chép">📋</span>
          <span className="text-gray-300">|</span>
          <span className="hover:text-rose-600 cursor-pointer" title="Xóa">🗑️</span>
          <span className="text-gray-300">|</span>
          <span className="hover:text-gray-900 cursor-pointer" title="Tùy chọn">⋯</span>
        </div>
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
      </>
    );
  };

  // Helper for Floating Wishes & Bottom Action Bar
  const renderFloatingFooter = () => (
    <div className="space-y-1.5 max-w-[320px] mx-auto pb-2 w-full">
      <div className="flex flex-col gap-1 items-center">
        <div className="px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-sm text-white text-[10px] shadow-sm max-w-full truncate">
          <strong>Huy:</strong> Chúc hai bạn trăm năm hạnh phúc!
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-sm text-white text-[10px] shadow-sm max-w-full truncate">
          <strong>Chanh:</strong> Chúc mừng hạnh phúc trăm năm!
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-sm text-white text-[10px] shadow-sm max-w-full truncate">
          <strong>Linh:</strong> ✨ Đồng tâm đồng lòng, xây đắp tổ ấm thịnh vượng!
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="pt-2 flex items-center justify-between gap-1.5 px-2">
        <button
          type="button"
          onClick={() => setShowRsvpModal(true)}
          className="flex-1 py-1.5 px-3 rounded-full bg-stone-900/85 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>💌</span>
          <span>Gửi lời chúc...</span>
        </button>
        <button
          type="button"
          onClick={() => setShowGiftModal(true)}
          className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Mừng cưới"
        >
          🎁
        </button>
        <button
          type="button"
          onClick={() => showToast('Đã gửi tim chúc mừng! ❤️')}
          className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Thả tim"
        >
          👍
        </button>
      </div>
    </div>
  );

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
      <div className="relative w-full max-w-md mx-auto h-[88vh] min-h-[580px] max-h-[760px] overflow-hidden shadow-2xl flex flex-col justify-between">
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
            className={`w-full h-full object-cover select-none transition-all duration-300 ${
              data.heroPhotoPosition === 'bottom'
                ? 'object-bottom'
                : data.heroPhotoPosition === 'center'
                ? 'object-center'
                : 'object-top'
            }`}
            loading="eager"
          />
        </motion.div>

        {/* Ambient Vignette for depth */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/65 pointer-events-none" />
        )}

        {/* ========================================================================= */}
        {/* VARIANT 1: COUNTDOWN (Wine Burgundy 4-Box - Media 1790399931495)          */}
        {/* ========================================================================= */}
        {heroVariant === 'countdown' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            <div className="pt-6">
              <div
                className="font-cursive text-3xl sm:text-4xl font-bold select-none drop-shadow-xs"
                style={{ color: data.typography?.color || '#641b24' }}
              >
                We get married!
              </div>
            </div>

            {/* Couple Names in All-Caps Serif */}
            <div className="my-auto py-2">
              <div
                onClick={() => onEditField?.('couple')}
                className={`group relative select-none transition-all duration-200 rounded-xl p-2 inline-block ${
                  onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400/70 hover:bg-sky-50/15' : ''
                }`}
                title={onEditField ? 'Nhấp để chỉnh sửa kiểu chữ và tên' : undefined}
              >
                <div
                  className={`relative px-4 py-1.5 transition-all ${
                    onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''
                  }`}
                  style={{
                    opacity: data.typography?.opacity ?? 1,
                    textAlign: (data.typography?.textAlign || 'center') as any,
                    textDecoration: (data.typography?.textDecoration || 'none') as any,
                    textTransform: (data.typography?.textTransform || 'uppercase') as any,
                    fontStyle: (data.typography?.fontStyle || 'normal') as any,
                    fontWeight: data.typography?.fontWeight === 'normal' ? 400 : 700,
                    letterSpacing: `${data.typography?.letterSpacing || 1}px`
                  }}
                >
                  {renderSelectionHandles()}
                  <div
                    className="font-serif font-bold uppercase tracking-wider leading-tight"
                    style={{
                      fontSize: `${data.typography?.fontSize || 38}px`,
                      color: data.typography?.color || '#641b24',
                      textShadow: '0 1px 4px rgba(255,255,255,0.95), 0 0 2px #ffffff'
                    }}
                  >
                    <div>{data.bride.shortName || data.bride.fullName || 'PHƯƠNG NGA'}</div>
                    <div className="text-lg opacity-85 my-0.5 font-serif italic normal-case">&amp;</div>
                    <div>{data.groom.shortName || data.groom.fullName || 'HOÀNG LONG'}</div>
                  </div>
                </div>
              </div>

              {/* Solar Date */}
              <div
                onClick={() => onEditField?.('date')}
                className="mt-1 text-sm font-serif font-semibold tracking-wider select-none cursor-pointer"
                style={{ color: data.typography?.color || '#641b24' }}
              >
                {targetDateStr.split('-').reverse().join('.')}
              </div>

              <div
                className="font-cursive text-lg sm:text-xl italic mt-1.5 select-none"
                style={{ color: data.typography?.color || '#641b24' }}
              >
                We will be husband and wife in
              </div>

              {/* 4-Box Burgundy Glass Live Countdown */}
              <div className="grid grid-cols-4 gap-2 max-w-[270px] mx-auto mt-2">
                <div className="bg-[#641b24]/90 backdrop-blur-md rounded-xl p-1.5 text-white text-center shadow-md border border-white/20">
                  <span className="block font-mono font-bold text-base leading-tight">{heroCountdown.days}</span>
                  <span className="block text-[9px] uppercase font-sans tracking-tight opacity-90">ngày</span>
                </div>
                <div className="bg-[#641b24]/90 backdrop-blur-md rounded-xl p-1.5 text-white text-center shadow-md border border-white/20">
                  <span className="block font-mono font-bold text-base leading-tight">{heroCountdown.hours}</span>
                  <span className="block text-[9px] uppercase font-sans tracking-tight opacity-90">giờ</span>
                </div>
                <div className="bg-[#641b24]/90 backdrop-blur-md rounded-xl p-1.5 text-white text-center shadow-md border border-white/20">
                  <span className="block font-mono font-bold text-base leading-tight">{heroCountdown.minutes}</span>
                  <span className="block text-[9px] uppercase font-sans tracking-tight opacity-90">phút</span>
                </div>
                <div className="bg-[#641b24]/90 backdrop-blur-md rounded-xl p-1.5 text-white text-center shadow-md border border-white/20">
                  <span className="block font-mono font-bold text-base leading-tight">{heroCountdown.seconds}</span>
                  <span className="block text-[9px] uppercase font-sans tracking-tight opacity-90">giây</span>
                </div>
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 2: CALENDAR (Zenlove Monthly Strip - Media 1790399914508)          */}
        {/* ========================================================================= */}
        {heroVariant === 'calendar' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            <div className="pt-6">
              <div
                className="font-cursive text-4xl sm:text-5xl font-bold select-none drop-shadow-sm"
                style={{
                  color: isDark ? '#ffffff' : (data.typography?.color || '#18181b'),
                  textShadow: isDark
                    ? '0 2px 10px rgba(0,0,0,0.8)'
                    : '0 1px 3px rgba(255,255,255,0.95), 0 0 1px #ffffff'
                }}
              >
                Save The Date
              </div>
            </div>

            {/* Couple Calligraphy Names */}
            <div className="my-auto py-2">
              <div
                onClick={() => onEditField?.('couple')}
                className={`group relative select-none transition-all duration-200 rounded-xl p-2 inline-block ${
                  onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400/70 hover:bg-sky-50/15' : ''
                }`}
                title={onEditField ? 'Nhấp để chỉnh sửa kiểu chữ và tên' : undefined}
              >
                <div
                  className={`relative px-4 py-2 transition-all ${
                    onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''
                  }`}
                  style={{
                    opacity: data.typography?.opacity ?? 1,
                    textAlign: (data.typography?.textAlign || 'center') as any,
                    textDecoration: (data.typography?.textDecoration || 'none') as any,
                    textTransform: (data.typography?.textTransform || 'none') as any,
                    fontStyle: (data.typography?.fontStyle || 'normal') as any,
                    fontWeight: data.typography?.fontWeight === 'normal' ? 400 : 700,
                    letterSpacing: `${data.typography?.letterSpacing || 0}px`
                  }}
                >
                  {renderSelectionHandles()}
                  <div
                    className="font-cursive leading-tight select-none"
                    style={{
                      fontSize: `${data.typography?.fontSize || 44}px`,
                      color: data.typography?.color || (isDark ? '#ffffff' : '#18181b'),
                      fontFamily: data.typography?.fontFamily
                        ? `'${data.typography.fontFamily}', var(--font-charmonman), var(--font-cursive), cursive`
                        : 'var(--font-charmonman), var(--font-cursive), cursive',
                      textShadow: (data.typography?.color === '#ffffff' || data.typography?.color === '#d4af37')
                        ? '0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)'
                        : '0 1px 4px rgba(255,255,255,0.95), 0 0 2px #ffffff'
                    }}
                  >
                    <div>{data.bride.shortName || data.bride.fullName || 'Thanh Hằng'}</div>
                    <div className="text-2xl opacity-85 my-0.5 italic font-serif font-normal">&amp;</div>
                    <div>{data.groom.shortName || data.groom.fullName || 'Minh Trí'}</div>
                  </div>
                </div>
              </div>

              {/* Tagline & Monthly Calendar Grid */}
              <div className="mt-1 select-none">
                <div className="font-cursive text-xl text-stone-900 leading-tight">
                  Our wedding day
                </div>
                <div className="font-cursive text-2xl text-stone-900 font-bold mb-1">
                  Tháng {targetMonth}
                </div>

                {/* 7-column Calendar strip */}
                <div className="max-w-[240px] mx-auto grid grid-cols-7 gap-1 text-[11px] font-mono text-stone-700 items-center justify-items-center">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span className="relative w-7 h-7 flex items-center justify-center font-bold">
                    <img
                      src="/templates/cinelove/calendar_heart.png"
                      alt="Wedding Heart"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-125"
                    />
                    <span className="relative z-10 text-[11px] font-bold text-white drop-shadow-xs">
                      {targetDay}
                    </span>
                  </span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                  <span>13</span>
                  <span>14</span>
                </div>
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 3: POLAROID (Taped Photo Card - Media 1790396363124)              */}
        {/* ========================================================================= */}
        {heroVariant === 'polaroid' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            <div className="pt-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-600 font-bold block">
                WEDDING INVITATION
              </span>
              <div
                onClick={() => onEditField?.('couple')}
                className={`group relative select-none inline-block ${
                  onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400 rounded-lg' : ''
                }`}
              >
                <div
                  className={`px-3 py-0.5 ${onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''}`}
                  style={{
                    fontSize: `${data.typography?.fontSize || 36}px`,
                    color: data.typography?.color || '#1c1917',
                    fontWeight: 700,
                    textShadow: '0 1px 4px rgba(255,255,255,0.95), 0 0 2px #ffffff'
                  }}
                >
                  {renderSelectionHandles()}
                  <span>{data.groom.shortName || 'Minh Trí'}</span>
                  <span className="font-serif italic font-normal mx-2 text-stone-400">&amp;</span>
                  <span>{data.bride.shortName || 'Thanh Hằng'}</span>
                </div>
              </div>
              <p className="text-[11px] font-serif italic text-stone-600">
                “Gặp gỡ là duyên, bên nhau là định mệnh”
              </p>
            </div>

            {/* Realistic Polaroid Card with Top Masking Tape */}
            <div className="my-auto relative max-w-[270px] mx-auto bg-white p-3 pt-5 pb-4 rounded-xl shadow-2xl border border-stone-200/90 rotate-[-1deg]">
              {/* Masking Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-200/85 shadow-xs border-y border-amber-300/60 z-30" />
              
              {/* Photo Frame inside Polaroid */}
              <div className="aspect-[4/5] w-full rounded-lg overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src={displayPhoto}
                  alt="Polaroid wedding photo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Inscription on Polaroid */}
              <div className="mt-3 text-center space-y-0.5">
                <div className="font-serif font-bold text-xs text-stone-800">
                  {data.groom.fullName || 'Trần Minh Trí'} &amp; {data.bride.fullName || 'Lê Thanh Hằng'}
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  {targetDateStr}
                </div>
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 4: MAGAZINE (Vogue Editorial High-Fashion)                       */}
        {/* ========================================================================= */}
        {heroVariant === 'magazine' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            {/* Vogue Masthead */}
            <div className="pt-5 border-b border-white/30 pb-2">
              <div className="font-serif text-4xl sm:text-5xl font-black tracking-[0.2em] text-white drop-shadow-md uppercase">
                V O G U E
              </div>
              <div className="flex justify-between text-[9px] font-mono tracking-widest text-white/90 uppercase px-2 pt-1">
                <span>WEDDING ISSUE</span>
                <span>VOL. 2026</span>
                <span>SPECIAL EDITION</span>
              </div>
            </div>

            {/* Magazine Headline & Couple Names */}
            <div className="my-auto py-2">
              <div
                onClick={() => onEditField?.('couple')}
                className={`group relative select-none inline-block ${
                  onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400 rounded-lg' : ''
                }`}
              >
                <div className={`px-4 py-2 ${onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''}`}>
                  {renderSelectionHandles()}
                  <div
                    className="font-serif font-black uppercase tracking-wider leading-tight text-white drop-shadow-lg"
                    style={{
                      fontSize: `${data.typography?.fontSize || 38}px`,
                      textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)'
                    }}
                  >
                    <div>{data.bride.shortName || 'BẢO TRÂM'}</div>
                    <div className="text-sm font-sans tracking-[0.3em] font-normal opacity-85 my-1">LOVES</div>
                    <div>{data.groom.shortName || 'TUẤN KHANG'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs font-serif italic text-white/95 drop-shadow-md">
                “A True Love Story Never Ends”
              </div>

              {/* Barcode & Issue Info Badge */}
              <div className="mt-3 inline-flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white">
                <span className="font-mono text-base tracking-widest">||| | |||| | ||</span>
                <span className="text-[10px] font-mono uppercase tracking-wider">{targetDateStr}</span>
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 5: TICKET (Cinema VIP Pass / Boarding Pass)                       */}
        {/* ========================================================================= */}
        {heroVariant === 'ticket' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            {/* Cinema Header */}
            <div className="pt-5">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-mono font-bold tracking-widest uppercase shadow-md">
                CINEMA VIP TICKET PASS
              </span>
            </div>

            {/* Ticket Card Container with Perforated Edges */}
            <div className="my-auto max-w-[280px] mx-auto bg-stone-900/85 backdrop-blur-md p-4 rounded-2xl border-2 border-dashed border-amber-300/70 text-white shadow-2xl">
              <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase block mb-1">
                PREMIERE SCREENING
              </span>

              <div
                onClick={() => onEditField?.('couple')}
                className={`group relative select-none inline-block w-full ${
                  onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400 rounded-lg' : ''
                }`}
              >
                <div className={`py-1 ${onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''}`}>
                  {renderSelectionHandles()}
                  <div className="font-serif font-black text-xl sm:text-2xl text-amber-300 tracking-wide uppercase">
                    {data.groom.shortName || 'Tuấn Khang'} &amp; {data.bride.shortName || 'Bảo Trâm'}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-stone-600 my-2 pt-2 grid grid-cols-3 gap-1 text-[10px] font-mono text-stone-300">
                <div>
                  <span className="block text-[8px] text-stone-500 uppercase">NGÀY CHIẾU</span>
                  <span className="font-bold text-amber-200">{targetDateStr}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-stone-500 uppercase">GIỜ G</span >
                  <span className="font-bold text-amber-200">{mainCeremony?.time || '11:00'}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-stone-500 uppercase">VỊ TRÍ</span>
                  <span className="font-bold text-amber-200">VIP 01-02</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-700/60 font-mono text-sm tracking-[0.25em] text-stone-400">
                |||| | ||||| || | |||| ||
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VARIANT 6: TRADITIONAL (Oriental Double Happiness 囍 Red & Gold)           */}
        {/* ========================================================================= */}
        {heroVariant === 'traditional' && (
          <div className="relative z-20 flex-1 flex flex-col justify-between p-4 text-center">
            {/* Top Red Lanterns & Song Hỷ */}
            <div className="pt-5 flex items-center justify-center gap-3">
              <span className="text-xl">🏮</span>
              <div className="px-4 py-1 rounded-full bg-red-900/90 border border-amber-300/80 text-amber-300 text-xs font-serif font-bold tracking-widest shadow-md">
                囍 THIỆP HỒNG BÁO HỶ 囍
              </div>
              <span className="text-xl">🏮</span>
            </div>

            {/* Center Golden Medallion with Nested Names */}
            <div className="my-auto py-2">
              <div className="w-56 h-56 mx-auto rounded-full bg-red-950/80 backdrop-blur-md border-4 border-amber-400/90 shadow-2xl flex flex-col items-center justify-center p-3 relative">
                <span className="text-amber-300 text-xl font-bold mb-1">囍</span>
                
                <div
                  onClick={() => onEditField?.('couple')}
                  className={`group relative select-none w-full ${
                    onEditField ? 'cursor-pointer hover:ring-2 hover:ring-sky-400 rounded-lg' : ''
                  }`}
                >
                  <div className={`px-2 py-0.5 ${onEditField ? 'ring-1 ring-sky-500 rounded-sm' : ''}`}>
                    {renderSelectionHandles()}
                    <div className="font-cursive text-amber-200 text-2xl font-bold leading-tight">
                      <div>{data.groom.fullName || data.groom.shortName || 'Hoàng Hải'}</div>
                      <div className="text-xs font-serif italic text-amber-300/80 my-0.5">và</div>
                      <div>{data.bride.fullName || data.bride.shortName || 'Mỹ Châu'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-amber-300/90 border-t border-amber-400/40 pt-1">
                  {targetDateStr}
                  {mainCeremony?.dateLunar && (
                    <div className="text-[9px] text-amber-400/75">({mainCeremony.dateLunar})</div>
                  )}
                </div>
              </div>
            </div>

            {renderFloatingFooter()}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WEDDING INVITATION CONTENT SECTIONS (Kinetic Reveal Upon Scroll)  */}
      {/* ========================================================================= */}
      <div className="max-w-md mx-auto px-4 pt-8 pb-32 space-y-12" style={{ backgroundColor: containerBg }}>
        {isCineloveMovie ? (
          <>
            {/* ========================================================================= */}
            {/* CINELOVE SECTION 1: ARCH PORTRAITS (CÔ DÂU & CHÚ RỂ)                      */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5 items-end">
                {/* Chú rể Arch */}
                <div className="space-y-2 text-center">
                  <div className="aspect-[3/4] rounded-t-full overflow-hidden border-2 border-stone-200/90 shadow-xl bg-stone-100">
                    <img
                      src={data.groom.avatarUrl || '/templates/cinelove/groom_arch.png'}
                      alt="Chú rể"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-serif uppercase tracking-wider text-stone-700 font-bold block">
                      Chú rể {data.groom.shortName || data.groom.fullName || 'MINH TRÍ'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {(data.groom as any).birthDate || '06.05.1998'}
                    </span>
                  </div>
                </div>

                {/* Cô dâu Arch */}
                <div className="space-y-2 text-center">
                  <div className="aspect-[3/4] rounded-t-full overflow-hidden border-2 border-stone-200/90 shadow-xl bg-stone-100">
                    <img
                      src={data.bride.avatarUrl || '/templates/cinelove/bride_arch.png'}
                      alt="Cô dâu"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-serif uppercase tracking-wider text-stone-700 font-bold block">
                      Cô dâu {data.bride.shortName || data.bride.fullName || 'THANH HẰNG'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {(data.bride as any).birthDate || '20.08.2001'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 2: OUR LOVE STORY NOTEBOOK CARD                          */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="relative bg-[#fffdfa] border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-xl overflow-hidden">
                {/* Left Binder Holes */}
                <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-5 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-stone-200 shadow-inner border border-stone-300" />
                  ))}
                </div>

                <div className="pl-4 text-center space-y-3">
                  <div className="font-serif font-black text-lg tracking-[0.2em] text-stone-800 uppercase">
                    OUR LOVE STORY
                  </div>
                  <p className="font-serif italic text-xs text-stone-600 leading-relaxed px-2">
                    &ldquo;{data.loveStory?.quotes || 'Tình yêu không phải là tìm một ai đó hoàn hảo, mà là học cách nhìn thấy những điều tuyệt vời từ một người không hoàn hảo.'}&rdquo;
                  </p>
                  <div className="w-12 h-px bg-stone-300 mx-auto my-1" />
                  <p className="font-serif text-[12px] text-stone-700 leading-relaxed text-justify indent-4">
                    {data.loveStory?.content || 'Chúng mình gặp nhau vào một ngày mùa thu Hà Nội, khi những cơn gió đầu mùa vừa se lạnh. Từ hai người xa lạ, chúng mình đã cùng nhau đi qua những năm tháng thanh xuân, cùng sẻ chia những vui buồn và nhận ra rằng: đối phương chính là mảnh ghép trọn vẹn nhất cho cuộc đời mình...'}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 3: FAMILY DETAILS (NHÀ TRAI & NHÀ GÁI)                   */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white/95 border border-stone-200/90 rounded-2xl p-5 shadow-xl">
                <div className="grid grid-cols-2 gap-4 text-center divide-x divide-stone-200">
                  {/* Nhà Trai */}
                  <div className="space-y-1 text-xs">
                    <span className="font-serif font-bold tracking-wider text-rose-900 block text-xs sm:text-sm mb-2">
                      NHÀ TRAI
                    </span>
                    <p className="text-stone-500 text-[10.5px]">ÔNG: <strong className="text-stone-800">{data.groom.fatherName || 'NGUYỄN VĂN AN'}</strong></p>
                    <p className="text-stone-500 text-[10.5px]">BÀ: <strong className="text-stone-800">{data.groom.motherName || 'TRẦN THỊ MAI'}</strong></p>
                    <p className="text-stone-400 text-[10px] italic">Hà Nội</p>
                    <div className="pt-2 border-t border-stone-100 mt-2">
                      <span className="text-[10px] uppercase font-mono text-stone-400 block">{data.groom.birthOrder || 'TRƯỞNG NAM'}</span>
                      <p className="font-serif font-bold text-sm text-stone-900 mt-0.5">{data.groom.fullName || 'MINH TRÍ'}</p>
                    </div>
                  </div>

                  {/* Nhà Gái */}
                  <div className="space-y-1 text-xs pl-4">
                    <span className="font-serif font-bold tracking-wider text-rose-900 block text-xs sm:text-sm mb-2">
                      NHÀ GÁI
                    </span>
                    <p className="text-stone-500 text-[10.5px]">ÔNG: <strong className="text-stone-800">{data.bride.fatherName || 'LÊ VĂN BÌNH'}</strong></p>
                    <p className="text-stone-500 text-[10.5px]">BÀ: <strong className="text-stone-800">{data.bride.motherName || 'NGUYỄN THỊ HOA'}</strong></p>
                    <p className="text-stone-400 text-[10px] italic">Quảng Ninh</p>
                    <div className="pt-2 border-t border-stone-100 mt-2">
                      <span className="text-[10px] uppercase font-mono text-stone-400 block">{data.bride.birthOrder || 'ÚT NỮ'}</span>
                      <p className="font-serif font-bold text-sm text-stone-900 mt-0.5">{data.bride.fullName || 'THANH HẰNG'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 4: FORMAL INVITATION & BIG DATE WIDGET                   */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl text-center space-y-4">
                <span className="font-serif text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block">
                  TRÂN TRỌNG KÍNH MỜI
                </span>
                <div className="text-base font-serif font-bold text-stone-900">
                  {guestName || 'Quý Khách & Người Thương'}
                </div>
                <p className="text-xs text-stone-600 font-serif italic">
                  Đến tham dự lễ thành hôn và chung vui cùng gia đình chúng mình
                </p>

                {/* Big Date Widget */}
                <div className="py-3 border-y border-stone-200 my-3">
                  <div className="text-[11px] font-serif uppercase tracking-widest text-stone-500 mb-1">
                    Thứ Ba
                  </div>
                  <div className="flex items-center justify-center gap-6 font-serif">
                    <div className="text-sm font-bold text-stone-700">Tháng {targetMonth}</div>
                    <div className="text-5xl sm:text-6xl font-black text-rose-900 px-3 tracking-tight">
                      {targetDay < 10 ? `0${targetDay}` : targetDay}
                    </div>
                    <div className="text-sm font-bold text-stone-700">Năm {targetYear}</div>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-1">
                    (Tức ngày 20 tháng 10 năm Ất Tỵ)
                  </div>
                </div>

                {/* Time & Venue */}
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="font-bold text-rose-900 text-sm">
                    VÀO LÚC: {mainCeremony?.time || '11:00'}
                  </div>
                  <div className="font-serif font-black text-sm uppercase text-stone-900">
                    {mainCeremony?.venueName || 'TRUNG TÂM TIỆC CƯỚI TRỐNG ĐỒNG PALACE'}
                  </div>
                  <div className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    {mainCeremony?.address || 'Số 72 Quán Sứ, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={getMapsUrl(mainCeremony || { venueName: 'Trống Đồng Palace', address: '72 Quán Sứ, Hoàn Kiếm, Hà Nội' })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <span>📍</span>
                    <span>Xem chỉ đường Google Maps</span>
                  </a>
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <span>📅</span>
                    <span>Thêm vào lịch</span>
                  </a>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 5: FULL-WIDTH ROMANCE PHOTO                              */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-200/90 relative">
                <img
                  src="/templates/cinelove/couple_walking.png"
                  alt="Khoảnh khắc ngọt ngào"
                  className="w-full h-auto object-cover select-none"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 text-center">
                  <p className="font-cursive text-white text-lg sm:text-xl drop-shadow-md">
                    &ldquo;You are my today and all of my tomorrows.&rdquo;
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 6: WEDDING TIMELINE                                      */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-800 font-bold block">
                    PROGRAM
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 uppercase">
                    TIMELINE TIỆC CƯỚI
                  </h3>
                </div>

                <div className="space-y-4 max-w-xs mx-auto">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-lg shadow-xs shrink-0">
                      📸
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-rose-900">10:30</span>
                      <h4 className="font-serif font-bold text-xs uppercase text-stone-800">Đón khách &amp; Chụp ảnh</h4>
                      <p className="text-[11px] text-stone-500">Chụp hình lưu niệm cùng cô dâu, chú rể</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-lg shadow-xs shrink-0">
                      💍
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-rose-900">10:45</span>
                      <h4 className="font-serif font-bold text-xs uppercase text-stone-800">Lễ Thành Hôn</h4>
                      <p className="text-[11px] text-stone-500">Nghi thức trao nhẫn &amp; cắt bánh cưới</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-lg shadow-xs shrink-0">
                      🥂
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-rose-900">11:00</span>
                      <h4 className="font-serif font-bold text-xs uppercase text-stone-800">Khai Tiệc Mừng</h4>
                      <p className="text-[11px] text-stone-500">Thưởng thức tiệc mặn &amp; âm nhạc</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 7: RSVP FORM                                             */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-rose-900 font-bold block">
                    RSVP INVITATION
                  </span>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Xác Nhận Tham Dự
                  </h3>
                  <p className="text-xs text-stone-500">
                    Để chuẩn bị chu đáo nhất, kính mong bạn phản hồi trước ngày {mainCeremony?.dateSolar || '01.12.2025'}
                  </p>
                </div>

                {rsvpSent ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center text-xs font-semibold space-y-1">
                    <span className="text-2xl block">🎉</span>
                    <p>Cảm ơn bạn rất nhiều!</p>
                    <p className="font-normal opacity-90">Phản hồi của bạn đã được chuyển tới cô dâu &amp; chú rể.</p>
                  </div>
                ) : (
                  <form onSubmit={onSendRSVP} className="space-y-3.5 text-xs">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpSide('nha_trai')}
                        className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                          rsvpSide === 'nha_trai'
                            ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        Khách Nhà Trai
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpSide('nha_gai')}
                        className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                          rsvpSide === 'nha_gai'
                            ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        Khách Nhà Gái
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Họ và tên của bạn..."
                      className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />

                    <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-600">Số lượng người tham dự:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))}
                          className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 font-bold hover:bg-stone-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-rose-900">
                          {rsvpCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRsvpCount(rsvpCount + 1)}
                          className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 font-bold hover:bg-stone-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold text-white bg-rose-900 hover:bg-rose-800 active:scale-95 transition-all shadow-md text-xs cursor-pointer"
                    >
                      Gửi Phản Hồi Tham Dự 💌
                    </button>
                  </form>
                )}
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 8: HỘP MỪNG CƯỚI (PINK RIBBON GIFT BOX + VIETQR)          */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl space-y-4 text-center">
                <div className="w-14 h-14 mx-auto mb-1">
                  <img
                    src="/templates/cinelove/gift_box_icon.png"
                    alt="Hộp yêu thương"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-stone-900 uppercase">
                    HỘP MỪNG CƯỚI
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Gửi gắm lời chúc và món quà yêu thương đến cô dâu, chú rể
                  </p>
                </div>

                <div className="pt-2">
                  <VietQRGiftBox
                    groomBank={data.groom.bank}
                    brideBank={data.bride.bank}
                    primaryColor="#881337"
                  />
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 9: GUESTBOOK (SỔ LƯU BÚT)                                */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-rose-900">
                    GUESTBOOK
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 uppercase">
                    GỬI LỜI CHÚC PHÚC
                  </h3>
                </div>

                <form onSubmit={onAddWish} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newWishName}
                    onChange={(e) => setNewWishName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <textarea
                    required
                    rows={2}
                    value={newWishContent}
                    onChange={(e) => setNewWishContent(e.target.value)}
                    placeholder="Gửi lời chúc phúc trăm năm tới cô dâu & chú rể..."
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-rose-900 hover:bg-rose-800 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Gửi Lời Chúc Mừng 💌
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {wishes.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs shadow-xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <strong className="font-serif text-rose-900">{w.name}</strong>
                        <span className="text-[10px] font-mono text-stone-400">{w.time}</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">{w.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ========================================================================= */}
            {/* CINELOVE SECTION 10: FOOTER COUNTDOWN & SIGNATURE                         */}
            {/* ========================================================================= */}
            <motion.section {...scrollReveal}>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-200/90 relative min-h-[380px] flex flex-col justify-between p-6 text-center text-white">
                <img
                  src="/templates/cinelove/footer_countdown_bg.png"
                  alt="Footer background"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
                <div className="absolute inset-0 bg-black/45 pointer-events-none" />

                <div className="relative z-10 pt-2 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/85 font-semibold block">
                    COUNTDOWN
                  </span>
                  <h3 className="font-serif font-black text-xl text-white drop-shadow-md uppercase">
                    NGÀY CHUNG ĐÔI
                  </h3>
                </div>

                {/* 4 White Glass Countdown Boxes */}
                <div className="relative z-10 grid grid-cols-4 gap-2 max-w-[280px] mx-auto my-auto py-4">
                  <div className="bg-white/85 backdrop-blur-md rounded-xl p-2 text-stone-900 text-center shadow-lg border border-white/40">
                    <span className="block font-mono font-black text-lg leading-tight">{heroCountdown.days}</span>
                    <span className="block text-[9px] uppercase font-sans font-bold tracking-tight text-stone-600">ngày</span>
                  </div>
                  <div className="bg-white/85 backdrop-blur-md rounded-xl p-2 text-stone-900 text-center shadow-lg border border-white/40">
                    <span className="block font-mono font-black text-lg leading-tight">{heroCountdown.hours}</span>
                    <span className="block text-[9px] uppercase font-sans font-bold tracking-tight text-stone-600">giờ</span>
                  </div>
                  <div className="bg-white/85 backdrop-blur-md rounded-xl p-2 text-stone-900 text-center shadow-lg border border-white/40">
                    <span className="block font-mono font-black text-lg leading-tight">{heroCountdown.minutes}</span>
                    <span className="block text-[9px] uppercase font-sans font-bold tracking-tight text-stone-600">phút</span>
                  </div>
                  <div className="bg-white/85 backdrop-blur-md rounded-xl p-2 text-stone-900 text-center shadow-lg border border-white/40">
                    <span className="block font-mono font-black text-lg leading-tight">{heroCountdown.seconds}</span>
                    <span className="block text-[9px] uppercase font-sans font-bold tracking-tight text-stone-600">giây</span>
                  </div>
                </div>

                <div className="relative z-10 pb-2 space-y-2">
                  <div className="font-cursive text-2xl text-amber-200 drop-shadow-md">
                    Forever starts here
                  </div>
                  <p className="text-[11px] text-white/90 italic font-serif max-w-xs mx-auto leading-relaxed">
                    {data.thankYouMessage || 'Cảm ơn bạn đã luôn đồng hành và là một phần trong câu chuyện hạnh phúc của chúng mình! ❤️'}
                  </p>
                </div>
              </div>
            </motion.section>
          </>
        ) : (
          <>
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
          </>
        )}
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
