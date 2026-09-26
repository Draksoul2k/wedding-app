'use client';

import React, { useState, useEffect } from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { TEMPLATES, TemplateLayoutType } from '@/constants/templates';
import { FallingEffect } from './falling-effect';
import { motion, AnimatePresence } from 'motion/react';
import { CinematicLayout } from './wedding-layouts/cinematic-layout';
import { MinimalZenLayout } from './wedding-layouts/minimal-zen-layout';
import { TraditionalLayout } from './wedding-layouts/traditional-layout';
import { EditorialMagazineLayout } from './wedding-layouts/editorial-magazine-layout';
import { FullCardLayout } from './wedding-layouts/full-card-layout';
import { BotanicalGardenLayout } from './wedding-layouts/botanical-garden-layout';
import { AutoScrollController } from './auto-scroll-controller';
import { FloatingWishesStream } from './floating-wishes-stream';

interface WeddingViewProps {
  data: WeddingInvitationData;
  guestName?: string;
  isLivePreview?: boolean;
}

export const WeddingView: React.FC<WeddingViewProps> = ({
  data,
  guestName = '',
  isLivePreview = false,
}) => {
  const [isOpen, setIsOpen] = useState(isLivePreview);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [overrideLayout, setOverrideLayout] = useState<TemplateLayoutType | null>(null);

  const [wishes, setWishes] = useState<Array<{ name: string; content: string; time: string }>>([
    {
      name: 'Nguyễn Văn Minh',
      content: 'Chúc hai bạn trăm năm hạnh phúc, sớm đón quý tử nha!',
      time: 'Vừa xong'
    },
    {
      name: 'Thu Trang (Đồng nghiệp)',
      content: 'Chúc tân lang tân nương luôn yêu thương và thấu hiểu nhau suốt cuộc đời!',
      time: '1 giờ trước'
    }
  ]);
  const [newWishName, setNewWishName] = useState('');
  const [newWishContent, setNewWishContent] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpSide, setRsvpSide] = useState<'nha_trai' | 'nha_gai'>('nha_trai');
  const [rsvpCount, setRsvpCount] = useState(1);

  const template = TEMPLATES.find((t) => t.id === data.templateId) || TEMPLATES[0];
  const activeColor = data.primaryColor || template.primaryColor;
  const activeAccent = template.accentColor || '#d4af37';
  const envelopeGradient = template.envelopeGradient || 'from-red-600 to-rose-700';
  const seal = template.sealSymbol || '囍';

  // Reset any manual layout override whenever the user switches templates
  useEffect(() => {
    setOverrideLayout(null);
  }, [data.templateId]);

  // Current layout determined by template or user override
  const currentLayout: TemplateLayoutType = overrideLayout || template.layoutType || 'full_long_card';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = data.musicTrackUrl || '/audio/anh-nang-cua-anh.mp3';
      const sound = new Audio(url);
      sound.loop = true;
      setAudio(sound);
      return () => {
        sound.pause();
      };
    }
  }, [data.musicTrackUrl]);

  const toggleMusic = () => {
    if (!audio) {
      if (typeof window !== 'undefined') {
        const url = data.musicTrackUrl || '/audio/anh-nang-cua-anh.mp3';
        const sound = new Audio(url);
        sound.loop = true;
        setAudio(sound);
        sound.play()
          .then(() => setIsPlayingMusic(true))
          .catch((e) => console.log('Playback prevented:', e));
      }
      return;
    }
    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      audio.play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log('Playback prevented:', e));
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    if (data.enableMusic) {
      toggleMusic();
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishContent.trim()) return;
    setWishes([
      { name: newWishName.trim(), content: newWishContent.trim(), time: 'Vừa xong' },
      ...wishes
    ]);
    setNewWishName('');
    setNewWishContent('');
  };

  const handleSendRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
  };

  return (
    <div
      className="relative min-h-screen text-gray-800 antialiased"
      style={{ backgroundColor: template.bgTexture || '#faf8f5' }}
    >
      {/* Falling particles effect */}
      <FallingEffect type={data.fallingEffect} />

      {/* Lightbox Modal for Gallery Images */}
      {lightboxIndex !== null && data.galleryImages && data.galleryImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-rose-400 z-50 p-2"
          >
            ✕
          </button>
          <img
            src={data.galleryImages[lightboxIndex]}
            alt="Ảnh cưới phóng to"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
            {lightboxIndex + 1} / {data.galleryImages.length}
          </div>
        </div>
      )}



      {/* 3D Envelope Intro Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -80, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-stone-900/90 to-stone-950/95 backdrop-blur-md"
          >
            <div className="text-center text-white mb-6">
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: activeAccent }}>
                Wedding Invitation
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif mt-2 tracking-wide text-stone-100">
                {data.groom.shortName} & {data.bride.shortName}
              </h2>
              {guestName && (
                <p className="mt-2 text-sm text-stone-300">
                  Trân trọng kính mời: <strong className="font-semibold" style={{ color: activeAccent }}>{guestName}</strong>
                </p>
              )}
            </div>

            {/* Envelope 3D Graphic */}
            <div
              className="relative w-80 sm:w-96 h-56 bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl shadow-2xl border p-6 flex flex-col items-center justify-between text-center overflow-hidden"
              style={{ borderColor: activeColor + '40' }}
            >
              <div className="w-full flex justify-between items-center text-[11px] uppercase tracking-widest text-stone-500 border-b border-stone-200/80 pb-2">
                <span>Save The Date</span>
                <span>{data.ceremonies[0]?.dateSolar || '2026'}</span>
              </div>

              <div className="my-auto">
                <span className="text-4xl font-serif block mb-1" style={{ color: activeColor }}>{seal}</span>
                <p className="text-xs text-stone-600 tracking-wide">
                  Thiệp cưới gửi đến bạn và gia đình
                </p>
              </div>

              {/* Wax Seal Button */}
              <button
                onClick={handleOpenEnvelope}
                className={`group relative -mb-3 px-8 py-2.5 rounded-full bg-gradient-to-r ${envelopeGradient} text-white font-serif font-bold text-sm tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2`}
              >
                <span>MỞ THIỆP CƯỚI</span>
                <span className="text-sm">{seal}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation Container */}
      <main className="max-w-md mx-auto shadow-2xl relative overflow-hidden bg-white">
        {/* Dynamic Layout Switcher Bar */}
        <div className="bg-stone-900 text-white px-3 py-2 flex flex-wrap items-center justify-between gap-1 text-[11px] font-sans border-b border-white/10 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span>📐 Bố cục:</span>
            <span className="font-bold text-white">
              {currentLayout === 'cinelove_movie'
                ? '🎬 Điện Ảnh'
                : currentLayout === 'zenlove_minimal'
                ? '🌿 Tối Giản'
                : currentLayout === 'botanical_garden'
                ? '🌸 Vườn Hoa'
                : currentLayout === 'chungdoi_traditional'
                ? '🏮 Truyền Thống'
                : currentLayout === 'full_long_card'
                ? '📜 Trải Dài'
                : '📰 Tạp Chí Vogue'}
            </span>
          </div>

          {/* Quick Layout Switch Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setOverrideLayout('cinelove_movie')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'cinelove_movie' ? 'bg-amber-400 text-black shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục Poster Điện ảnh"
            >
              🎬 Phim
            </button>
            <button
              onClick={() => setOverrideLayout('zenlove_minimal')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'zenlove_minimal' ? 'bg-amber-400 text-black shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục Tối giản & Lịch tháng"
            >
              🌿 Tối Giản
            </button>
            <button
              onClick={() => setOverrideLayout('botanical_garden')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'botanical_garden' ? 'bg-emerald-400 text-emerald-950 shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục Vườn hoa thảo mộc"
            >
              🌸 Hoa
            </button>
            <button
              onClick={() => setOverrideLayout('chungdoi_traditional')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'chungdoi_traditional' ? 'bg-amber-400 text-black shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục Truyền thống Song Hỷ"
            >
              🏮 Hỷ
            </button>
            <button
              onClick={() => setOverrideLayout('chungdoi_magazine')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'chungdoi_magazine' ? 'bg-amber-400 text-black shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục Tạp chí Thời trang"
            >
              📰 Vogue
            </button>
            <button
              onClick={() => setOverrideLayout('full_long_card')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                currentLayout === 'full_long_card' ? 'bg-rose-500 text-white shadow-xs font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="Bố cục trải dài kết hợp poster và thông tin chi tiết"
            >
              📜 Dài
            </button>

            {/* Quick Music Toggle in Header */}
            {data.enableMusic && (
              <button
                type="button"
                onClick={toggleMusic}
                className={`ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                  isPlayingMusic
                    ? 'bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-400/40'
                    : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                }`}
                title={isPlayingMusic ? 'Bấm để tắt nhạc' : 'Bấm để phát nhạc'}
              >
                <span>{isPlayingMusic ? '🔊 Nhạc: Bật' : '🔇 Nhạc: Tắt'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Multi-Layout Rendering Engine */}
        {currentLayout === 'cinelove_movie' && (
          <CinematicLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}

        {currentLayout === 'zenlove_minimal' && (
          <MinimalZenLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}

        {currentLayout === 'chungdoi_traditional' && (
          <TraditionalLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}

        {currentLayout === 'chungdoi_magazine' && (
          <EditorialMagazineLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}

        {currentLayout === 'botanical_garden' && (
          <BotanicalGardenLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}

        {currentLayout === 'full_long_card' && (
          <FullCardLayout
            data={data}
            template={template}
            activeColor={activeColor}
            activeAccent={activeAccent}
            guestName={guestName}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
            rsvpSent={rsvpSent}
            onSendRSVP={handleSendRSVP}
            rsvpSide={rsvpSide}
            setRsvpSide={setRsvpSide}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            wishes={wishes}
            newWishName={newWishName}
            setNewWishName={setNewWishName}
            newWishContent={newWishContent}
            setNewWishContent={setNewWishContent}
            onAddWish={handleAddWish}
          />
        )}
      </main>

      {/* ZenLove-Style Floating Live Wishes Stream with Heart Reactions */}
      {isOpen && !isLivePreview && (
        <FloatingWishesStream
          primaryColor={activeColor}
          activeAccent={activeAccent}
          wishes={wishes}
        />
      )}

      {/* ZenLove-Style Auto-Scroll Controller */}
      {isOpen && !isLivePreview && (
        <AutoScrollController
          activeColor={activeColor}
          defaultActive={false}
        />
      )}

      {/* Floating Interactive Music Disc Player */}
      {data.enableMusic && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all cursor-pointer ${
              isPlayingMusic
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/40 ring-4 ring-rose-400/25'
                : 'bg-stone-900/90 text-white border-white/20 hover:bg-stone-900 shadow-stone-950/50 hover:scale-105 active:scale-95'
            }`}
            title={isPlayingMusic ? 'Bấm để tạm dừng nhạc cưới' : 'Bấm để phát nhạc cưới'}
          >
            <span
              className={`text-lg inline-block ${isPlayingMusic ? 'animate-spin' : ''}`}
              style={{ animationDuration: '3.5s' }}
            >
              🎵
            </span>
            <span className="text-xs font-bold font-sans hidden sm:inline max-w-[130px] truncate">
              {isPlayingMusic ? (data.musicTitle?.split('-')[0]?.trim() || 'Đang phát') : 'Bật nhạc'}
            </span>
            {isPlayingMusic ? (
              <span className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-full bg-white rounded-full animate-pulse" />
                <span className="w-0.5 h-2 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse delay-150" />
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold hidden sm:inline">
                Play ▶
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
