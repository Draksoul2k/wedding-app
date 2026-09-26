'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TEMPLATES, VIETNAMESE_BANKS, DEFAULT_WEDDING_DATA, TemplateConfig } from '@/constants/templates';
import { POPULAR_WEDDING_SONGS, findSongByQuery, WeddingSong } from '@/constants/songs';
import { WeddingInvitationData } from '@/types/wedding';
import { WeddingView } from '@/components/wedding-view';

function CreateInvitationContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const variantParam = searchParams.get('variant');
  const phoneScrollRef = useRef<HTMLDivElement>(null);

  const initialTemplate = templateParam
    ? TEMPLATES.find((t) => t.id === templateParam) || TEMPLATES[0]
    : TEMPLATES[0];

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [data, setData] = useState<WeddingInvitationData>(() => ({
    ...DEFAULT_WEDDING_DATA,
    templateId: initialTemplate.id,
    themeName: initialTemplate.name,
    primaryColor: initialTemplate.primaryColor,
    heroPhoto: initialTemplate.frameAsset
  }));
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Template search & filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'chungdoi' | 'cinelove' | 'zenlove' | 'motdoi'>('all');
  const [templateSearch, setTemplateSearch] = useState<string>('');
  const [step1SubTab, setStep1SubTab] = useState<'template' | 'music'>('template');

  // Song search & preview state
  const [songSearchQuery, setSongSearchQuery] = useState<string>('');
  const [musicModeFilter, setMusicModeFilter] = useState<'all' | 'vocal' | 'instrumental'>('all');
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(null);
  const [activeLyricsSong, setActiveLyricsSong] = useState<WeddingSong | null>(null);
  const [showSelectedLyrics, setShowSelectedLyrics] = useState<boolean>(false);

  useEffect(() => {
    const handlePause = () => {
      if (previewAudio) {
        previewAudio.pause();
        setIsPlayingPreview(false);
        setCurrentPlayingUrl(null);
      }
    };
    const onVisibility = () => {
      if (document.hidden) handlePause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', handlePause);
    window.addEventListener('beforeunload', handlePause);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', handlePause);
      window.removeEventListener('beforeunload', handlePause);
      handlePause();
    };
  }, [previewAudio]);

  const isAudioPlaying = (url?: string | null) => {
    if (!url || !isPlayingPreview || !currentPlayingUrl) return false;
    return (
      currentPlayingUrl === url ||
      currentPlayingUrl.endsWith(url) ||
      url.endsWith(currentPlayingUrl) ||
      currentPlayingUrl.includes(url) ||
      url.includes(currentPlayingUrl)
    );
  };

  const handleSelectSong = (song: WeddingSong) => {
    setData((prev) => ({
      ...prev,
      musicTitle: `${song.title} - ${song.artist}`,
      musicTrackUrl: song.url,
      enableMusic: true
    }));
    // Instantly play the audio so the user hears it immediately!
    handleTogglePreview(song.url);
  };

  const handleTogglePreview = (url: string) => {
    if (previewAudio) {
      if (isPlayingPreview && isAudioPlaying(url)) {
        previewAudio.pause();
        setIsPlayingPreview(false);
        setCurrentPlayingUrl(null);
        return;
      }
      previewAudio.pause();
    }
    try {
      const newSound = new Audio(url);
      newSound.play()
        .then(() => {
          setPreviewAudio(newSound);
          setCurrentPlayingUrl(url);
          setIsPlayingPreview(true);
          newSound.onended = () => {
            setIsPlayingPreview(false);
            setCurrentPlayingUrl(null);
          };
          newSound.onerror = () => {
            setIsPlayingPreview(false);
            setCurrentPlayingUrl(null);
          };
        })
        .catch((err) => {
          console.error('Audio playback error:', err);
          setIsPlayingPreview(false);
          setCurrentPlayingUrl(null);
        });
    } catch (e) {
      console.error('Audio initialization error:', e);
      setIsPlayingPreview(false);
      setCurrentPlayingUrl(null);
    }
  };

  const handleSelectTemplate = (tmpl: TemplateConfig) => {
    setData((prev) => ({
      ...prev,
      templateId: tmpl.id,
      themeName: tmpl.name,
      primaryColor: tmpl.primaryColor,
      heroPhoto: tmpl.frameAsset,
      fallingEffect:
        tmpl.category === 'hoa_la'
          ? 'petals'
          : tmpl.category === 'truyen_thong'
          ? 'hearts'
          : tmpl.category === 'toi_gian'
          ? 'sparkles'
          : 'petals'
    }));
  };

  useEffect(() => {
    if (templateParam) {
      const found = TEMPLATES.find((t) => t.id === templateParam);
      if (found) {
        handleSelectTemplate(found);
        if (variantParam && found.colorVariants) {
          const v = found.colorVariants.find((cv) => cv.id === variantParam);
          if (v) {
            setData((prev) => ({
              ...prev,
              primaryColor: v.primaryColor,
              heroPhoto: v.frameAsset
            }));
          }
        }
      }
    }
  }, [templateParam, variantParam]);

  // File input refs
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to update nested data
  const updateGroom = (field: string, value: string) => {
    setData((prev) => {
      const nextGroom = { ...prev.groom, [field]: value };
      // If user updates fullName and shortName was still default "Thanh Tùng", sync shortName
      if (field === 'fullName' && (!prev.groom.shortName || prev.groom.shortName === 'Thanh Tùng')) {
        const words = value.trim().split(/\s+/);
        nextGroom.shortName = words[words.length - 1] || value;
      }
      return { ...prev, groom: nextGroom };
    });
  };

  const updateBride = (field: string, value: string) => {
    setData((prev) => {
      const nextBride = { ...prev.bride, [field]: value };
      // If user updates fullName and shortName was still default "Lan Anh", sync shortName
      if (field === 'fullName' && (!prev.bride.shortName || prev.bride.shortName === 'Lan Anh')) {
        const words = value.trim().split(/\s+/);
        nextBride.shortName = words.slice(-2).join(' ') || value;
      }
      return { ...prev, bride: nextBride };
    });
  };

  const updateGroomBank = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      groom: {
        ...prev.groom,
        bank: {
          ...prev.groom.bank,
          [field]: value,
          qrUrl: `https://img.vietqr.io/image/${field === 'bankCode' ? value : prev.groom.bank.bankCode}-${field === 'accountNumber' ? value : prev.groom.bank.accountNumber}-compact2.png?amount=0&addInfo=Mung+cuoi`
        }
      }
    }));
  };

  const updateBrideBank = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      bride: {
        ...prev.bride,
        bank: {
          ...prev.bride.bank,
          [field]: value,
          qrUrl: `https://img.vietqr.io/image/${field === 'bankCode' ? value : prev.bride.bank.bankCode}-${field === 'accountNumber' ? value : prev.bride.bank.accountNumber}-compact2.png?amount=0&addInfo=Mung+cuoi`
        }
      }
    }));
  };

  const updateCeremony = (index: number, field: string, value: string) => {
    setData((prev) => {
      const nextCeremonies = [...prev.ceremonies];
      nextCeremonies[index] = { ...nextCeremonies[index], [field]: value };
      return { ...prev, ceremonies: nextCeremonies };
    });
  };

  // Upload Hero Photo from Device
  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setData((prev) => ({
          ...prev,
          heroPhoto: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Multiple Gallery Images
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handlePublish = async () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`wedding_${data.slug}`, JSON.stringify(data));
      } catch (err) {
        console.warn('Storage limit warning, continuing with current state:', err);
      }

      // Sync to API store so other phones and guests can view
      try {
        await fetch('/api/wedding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: data.slug, data })
        });
      } catch (e) {
        console.warn('Could not sync to API:', e);
      }

      const url = `${window.location.origin}/thiep/${data.slug}`;
      setPublishedUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold font-serif text-rose-700 hover:opacity-80">
            Chung Đôi
          </Link>
          <span className="hidden sm:inline-block text-xs text-gray-400">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold text-gray-700">
            Tạo Thiệp Cưới Online
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-300 text-rose-700 bg-rose-50"
          >
            {showMobilePreview ? '✏️ Quay lại sửa' : '👁️ Xem thử'}
          </button>

          <button
            onClick={handlePublish}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            Xuất Bản Thiệp 🚀
          </button>
        </div>
      </header>

      {/* Published Modal */}
      {publishedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <span className="text-4xl block">🎉</span>
            <h3 className="text-xl font-bold text-gray-900 font-serif">
              Chúc mừng! Thiệp cưới đã sẵn sàng
            </h3>
            <p className="text-xs text-gray-500">
              Đường link thiệp cưới của bạn đã được khởi tạo thành công:
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <span className="truncate font-mono font-medium text-rose-700">{publishedUrl}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  alert('Đã sao chép đường link!');
                }}
                className="ml-2 px-2.5 py-1 bg-white border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
              >
                Sao chép
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <p className="font-bold">💡 Mẹo mời riêng từng khách (ChungDoi Style):</p>
              <p className="text-[11px]">
                Gửi link kèm tham số <code>?to=Tên+Khách</code> để in tên người nhận lên mặt bì thư!
                <br />
                <code className="text-rose-700 font-mono text-[10px] break-all">
                  {publishedUrl}?to=Anh+Hoang
                </code>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 text-center"
              >
                Xem thiệp ngay 💌
              </a>
              <button
                onClick={() => setPublishedUrl(null)}
                className="px-4 py-2.5 rounded-xl font-medium text-xs border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Split View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
        {/* Left Column: Form Builder Steps */}
        <div
          className={`flex-1 bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col overflow-hidden ${
            showMobilePreview ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Step Stepper Header (5 Steps) */}
          <div className="border-b border-stone-200 p-4 bg-stone-50/70">
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[
                { step: 1, label: '1. Mẫu & Nhạc' },
                { step: 2, label: '2. Dâu & Rể' },
                { step: 3, label: '3. Lịch Trình' },
                { step: 4, label: '4. Ảnh Cưới 📸' },
                { step: 5, label: '5. Mừng Cưới' }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step as any)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    activeStep === s.step
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6 max-h-[calc(100vh-180px)]">
            {/* STEP 1: CHỌN MẪU THIỆP & CÀI ĐẶT NHẠC */}
            {activeStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
                    <span>1. Chọn Mẫu Thiệp & Cài Đặt Nhạc Nền</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                      {TEMPLATES.length} mẫu phong phú
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tùy chọn phong cách thiệp cưới và bài hát nền lãng mạn tự động phát khi khách mở thiệp.
                  </p>
                </div>

                {/* Sub-tab Navigation: [🎨 Chọn Mẫu] vs [🎵 Chọn Nhạc Cưới] */}
                <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setStep1SubTab('template')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      step1SubTab === 'template'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🎨 Chọn Mẫu & Tông Màu</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      {TEMPLATES.length} mẫu
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep1SubTab('music')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      step1SubTab === 'music'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🎵 Cài Đặt Nhạc Cưới</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        step1SubTab === 'music'
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {data.enableMusic ? 'Đang bật 🎶' : 'Đã tắt'}
                    </span>
                  </button>
                </div>

                {/* Always-visible Quick Music Status Bar */}
                <div className="p-3 bg-gradient-to-r from-amber-50 via-rose-50/70 to-amber-50 rounded-2xl border border-amber-200/90 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                      🎵
                    </span>
                    <div className="truncate">
                      <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                        Nhạc cưới tự phát:
                      </span>
                      <strong className="text-xs text-stone-900 truncate block">
                        {data.musicTitle || 'I Do - 911 (Wedding Song)'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {data.musicTrackUrl && (
                      <button
                        type="button"
                        onClick={() => handleTogglePreview(data.musicTrackUrl!)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isAudioPlaying(data.musicTrackUrl)
                            ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                        }`}
                        title={isAudioPlaying(data.musicTrackUrl) ? 'Tạm dừng bài hát' : 'Nghe thử bài hát'}
                      >
                        {isAudioPlaying(data.musicTrackUrl) ? (
                          <>
                            <span className="font-mono text-xs font-black tracking-tighter">❚❚</span>
                            <span>Đang phát</span>
                            <span className="flex items-center gap-0.5 h-2.5">
                              <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                              <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.35s' }} />
                              <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px]">▶</span>
                            <span>Nghe thử</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setStep1SubTab(step1SubTab === 'music' ? 'template' : 'music')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-1"
                    >
                      <span>{step1SubTab === 'music' ? '← Xem danh sách mẫu' : 'Đổi nhạc / Tìm bài hát ▾'}</span>
                    </button>
                  </div>
                </div>

                {/* SUB-TAB 1: TEMPLATE & COLOR SELECTION */}
                {step1SubTab === 'template' && (
                  <div className="space-y-4">
                    {/* Collection Filter (Clean style names, no third-party branding) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
                        <span className="text-[10px] font-bold uppercase text-stone-500 pl-2 shrink-0">Bộ sưu tập:</span>
                        {[
                          { id: 'all', label: `Tất cả (${TEMPLATES.length})` },
                          { id: 'cinelove', label: `🎬 Điện Ảnh & Poster (${TEMPLATES.filter((t) => t.source === 'cinelove').length})` },
                          { id: 'motdoi', label: `🌟 Thanh Lịch & Quý Phái (${TEMPLATES.filter((t) => t.source === 'motdoi').length})` },
                          { id: 'chungdoi', label: `🌸 Đa Sắc Phối Màu (${TEMPLATES.filter((t) => t.source === 'chungdoi').length})` },
                          { id: 'zenlove', label: `🌿 Mộc Mạc & Tối Giản (${TEMPLATES.filter((t) => t.source === 'zenlove').length})` },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSourceFilter(s.id as any)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              sourceFilter === s.id
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-2">
                        {[
                          { id: 'all', label: 'Mọi phong cách' },
                          { id: 'truyen_thong', label: `🏮 Truyền thống (${TEMPLATES.filter((t) => t.category === 'truyen_thong').length})` },
                          { id: 'hoa_la', label: `🌿 Hoa lá (${TEMPLATES.filter((t) => t.category === 'hoa_la').length})` },
                          { id: 'toi_gian', label: `✨ Tối giản (${TEMPLATES.filter((t) => t.category === 'toi_gian').length})` },
                          { id: 'hien_dai', label: `👑 Điện ảnh & Hiện đại (${TEMPLATES.filter((t) => t.category === 'hien_dai').length})` },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              selectedCategory === cat.id
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200/60'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <input
                        type="text"
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        placeholder="🔍 Tìm mẫu theo tên hoặc từ khóa (VD: Điện ảnh, Hoàng gia, Song Hỷ, Hộ chiếu, Pastel, Vintage...)"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                      />
                      {templateSearch && (
                        <button
                          type="button"
                          onClick={() => setTemplateSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Template Grid with Smooth Auto-Scroll Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                      {TEMPLATES.filter((tmpl) => {
                        const matchesSource = sourceFilter === 'all' || tmpl.source === sourceFilter;
                        const matchesCat = selectedCategory === 'all' || tmpl.category === selectedCategory;
                        const q = templateSearch.toLowerCase().trim();
                        const matchesSearch =
                          !q ||
                          tmpl.name.toLowerCase().includes(q) ||
                          tmpl.tag.toLowerCase().includes(q) ||
                          tmpl.description.toLowerCase().includes(q) ||
                          tmpl.id.toLowerCase().includes(q);
                        return matchesSource && matchesCat && matchesSearch;
                      }).map((tmpl) => {
                        const isSelected = data.templateId === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => handleSelectTemplate(tmpl)}
                            className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 flex flex-col justify-between group relative ${
                              isSelected
                                ? 'border-rose-600 ring-4 ring-rose-100 bg-rose-50/40 shadow-sm'
                                : 'border-stone-200 hover:border-rose-300 bg-white hover:shadow-xs'
                            }`}
                          >
                            <div className="h-44 sm:h-52 rounded-xl overflow-hidden bg-stone-900 mb-2 relative">
                              <img
                                src={tmpl.frameAsset}
                                alt={tmpl.name}
                                className="w-full h-auto block select-none transition-transform duration-[3500ms] ease-in-out group-hover:-translate-y-[calc(100%-180px)]"
                                loading="lazy"
                              />
                              {/* Source Tag Badge */}
                              <span className="absolute top-2 left-2 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-900/85 text-amber-300 backdrop-blur-xs uppercase border border-amber-400/20">
                                {tmpl.source === 'cinelove'
                                  ? '🎬 Điện Ảnh'
                                  : tmpl.source === 'motdoi'
                                  ? '🌟 Thanh Lịch'
                                  : tmpl.source === 'zenlove'
                                  ? '🌿 Tối Giản'
                                  : '🌸 Đa Sắc'}
                              </span>
                              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                                {tmpl.tag}
                              </span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-rose-600/15 flex items-center justify-center pointer-events-none">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-lg flex items-center gap-1">
                                    ✓ Đang chọn
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-left">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className="font-bold text-xs text-gray-800 truncate">{tmpl.name}</p>
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-2xs shrink-0"
                                  style={{ backgroundColor: tmpl.primaryColor }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-500 line-clamp-1">{tmpl.description}</p>

                              {/* Color variant dots on card */}
                              {tmpl.colorVariants && tmpl.colorVariants.length > 0 && (
                                <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-stone-100">
                                  <span className="text-[9px] text-stone-500 font-medium">Tông màu:</span>
                                  <div className="flex items-center gap-1">
                                    {tmpl.colorVariants.map((v) => (
                                      <span
                                        key={v.id}
                                        className="w-3 h-3 rounded-full border border-stone-200 inline-block"
                                        style={{ backgroundColor: v.primaryColor }}
                                        title={v.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Color Variant Chooser Section when selected template has color variations */}
                    {(() => {
                      const curTmpl = TEMPLATES.find((t) => t.id === data.templateId);
                      if (!curTmpl || !curTmpl.colorVariants || curTmpl.colorVariants.length === 0) return null;

                      return (
                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                              <span>🎨</span>
                              <span>Chọn Tông Màu Chủ Đạo Cho Mẫu "{curTmpl.name}"</span>
                            </h3>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {curTmpl.colorVariants.length} phối màu thiết kế
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {curTmpl.colorVariants.map((variant) => {
                              const isSelected = data.primaryColor === variant.primaryColor;
                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() => {
                                    setData((prev) => ({
                                      ...prev,
                                      primaryColor: variant.primaryColor,
                                      heroPhoto: variant.frameAsset
                                    }));
                                  }}
                                  className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all ${
                                    isSelected
                                      ? 'border-rose-600 bg-white shadow-sm ring-2 ring-rose-100'
                                      : 'border-stone-200 bg-white/70 hover:bg-white'
                                  }`}
                                >
                                  <span
                                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: variant.primaryColor }}
                                  />
                                  <div className="truncate">
                                    <span className="font-bold text-xs text-stone-800 truncate block">
                                      {variant.name}
                                    </span>
                                    <span className="text-[10px] text-stone-500 font-mono">
                                      {variant.primaryColor}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* SUB-TAB 2: PROMINENT WEDDING MUSIC STATION */}
                {step1SubTab === 'music' && (
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <span className="text-base">🎵</span>
                          <span>Kho Nhạc Cưới Tự Động (Phát khi khách mở thiệp)</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Nhập tên bài hát yêu thích, nghe thử trực tiếp và chọn bài hát cho thiệp cưới của bạn.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !data.enableMusic;
                          setData({ ...data, enableMusic: nextState });
                          if (!nextState && previewAudio) {
                            previewAudio.pause();
                            setIsPlayingPreview(false);
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all shadow-xs cursor-pointer ${
                          data.enableMusic
                            ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-200'
                            : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                        }`}
                        title="Bấm để bật hoặc tắt nhạc nền thiệp cưới"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${data.enableMusic ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
                        <span>{data.enableMusic ? '✓ Nhạc nền: BẬT' : '✕ Nhạc nền: TẮT'}</span>
                      </button>
                    </div>

                    {data.enableMusic ? (
                      <div className="space-y-4">
                        {/* 2 CHẾ ĐỘ NHẠC CƯỚI: CÓ LỜI (VOCAL) vs KHÔNG LỜI (INSTRUMENTAL) */}
                        <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                              <span>🎼</span>
                              <span>Chọn Chế Độ Nhạc Nền:</span>
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {musicModeFilter === 'vocal'
                                ? 'Đang lọc: Ca sĩ hát'
                                : musicModeFilter === 'instrumental'
                                ? 'Đang lọc: Hòa tấu không lời'
                                : 'Tất cả bài hát'}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setMusicModeFilter('vocal')}
                              className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                                musicModeFilter === 'vocal'
                                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                  : 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              <span>🎤 Chế Độ Có Lời</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                musicModeFilter === 'vocal' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                              }`}>
                                {POPULAR_WEDDING_SONGS.filter((s) => s.mode === 'vocal').length} bài
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setMusicModeFilter('instrumental')}
                              className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                                musicModeFilter === 'instrumental'
                                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                                  : 'bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-800'
                              }`}
                            >
                              <span>🎻 Chế Độ Không Lời</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                musicModeFilter === 'instrumental' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                              }`}>
                                {POPULAR_WEDDING_SONGS.filter((s) => s.mode === 'instrumental').length} bài
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setMusicModeFilter('all')}
                              className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                                musicModeFilter === 'all'
                                  ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-400'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              <span>🌟 Tất Cả</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                musicModeFilter === 'all' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                              }`}>
                                {POPULAR_WEDDING_SONGS.length}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Search Song by Title Input */}
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1.5">
                            🔍 Tìm bài hát hoặc ca sĩ theo tên:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={songSearchQuery}
                              onChange={(e) => setSongSearchQuery(e.target.value)}
                              placeholder="Ví dụ: Ánh Nắng Của Anh, I Do, Cưới Thôi, Canon In D, Beautiful In White..."
                              className="w-full p-3 pl-4 rounded-xl border border-amber-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
                            />
                            {songSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setSongSearchQuery('')}
                                className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-600 font-bold"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Autocomplete / Filtered Song Suggestions */}
                        {songSearchQuery.trim() !== '' && (
                          <div className="max-h-56 overflow-y-auto space-y-1.5 bg-white p-3 rounded-2xl border border-amber-300 shadow-md">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-1">
                              Kết quả tìm kiếm cho "{songSearchQuery}":
                            </span>
                            {findSongByQuery(songSearchQuery, musicModeFilter).length === 0 ? (
                              <p className="text-xs text-stone-500 py-2 text-center">
                                Không tìm thấy bài hát. Bạn có thể dán link file MP3 tùy chỉnh bên dưới!
                              </p>
                            ) : (
                              findSongByQuery(songSearchQuery, musicModeFilter).map((song) => {
                                const isCurrentPlaying = isAudioPlaying(song.url);
                                return (
                                  <div
                                    key={song.id}
                                    onClick={() => {
                                      handleSelectSong(song);
                                      setSongSearchQuery('');
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-rose-50 cursor-pointer flex items-center justify-between text-xs transition-colors border border-stone-100 hover:border-rose-200"
                                  >
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <strong className="text-gray-900 block font-serif text-xs">{song.title}</strong>
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                          song.mode === 'vocal'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-sky-100 text-sky-800'
                                        }`}>
                                          {song.mode === 'vocal' ? '🎤 Có Lời' : '🎻 Không Lời'}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-gray-500">{song.artist}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTogglePreview(song.url);
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                          isCurrentPlaying
                                            ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                                            : 'bg-stone-100 text-stone-700 hover:bg-amber-200'
                                        }`}
                                      >
                                        {isCurrentPlaying ? (
                                          <>
                                            <span className="font-mono text-xs font-black tracking-tighter">❚❚</span>
                                            <span>Dừng</span>
                                            <span className="flex items-center gap-0.5 h-2">
                                              <span className="w-0.5 h-2 bg-white rounded-full animate-bounce" />
                                              <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce delay-100" />
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span className="text-[10px]">▶</span>
                                            <span>Nghe</span>
                                          </>
                                        )}
                                      </button>
                                      <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] shadow-2xs">
                                        Chọn bài này ✓
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                        {/* Currently Selected Song Card */}
                        {(() => {
                          const curPlaying = isAudioPlaying(data.musicTrackUrl);
                          const curSongObj = POPULAR_WEDDING_SONGS.find(
                            (s) => s.url === data.musicTrackUrl || data.musicTitle?.includes(s.title)
                          );
                          return (
                            <div className="p-4 bg-white rounded-2xl border-2 border-rose-400 space-y-3 shadow-xs">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                                    🎶
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">
                                        Bài hát đang chọn cho thiệp:
                                      </span>
                                      {curSongObj && (
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                          curSongObj.mode === 'vocal'
                                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                                        }`}>
                                          {curSongObj.mode === 'vocal' ? '🎤 Bản Có Lời' : '🎻 Bản Không Lời'}
                                        </span>
                                      )}
                                    </div>
                                    <strong className="text-xs sm:text-sm text-gray-900 truncate block font-serif">
                                      {data.musicTitle || 'Ánh Nắng Của Anh - Đức Phúc (Bản Có Lời)'}
                                    </strong>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {data.musicTrackUrl && (
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePreview(data.musicTrackUrl!)}
                                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                        curPlaying
                                          ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                                      }`}
                                      title={curPlaying ? 'Tạm dừng nhạc' : 'Nghe thử bài này'}
                                    >
                                      {curPlaying ? (
                                        <>
                                          <span className="font-mono text-xs font-black tracking-tighter">❚❚</span>
                                          <span>Tạm dừng</span>
                                          <span className="flex items-center gap-0.5 h-2.5">
                                            <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                                            <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.35s' }} />
                                            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-[10px]">▶</span>
                                          <span>Nghe thử bài này</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* In-Card Lyrics Toggle for Selected Song */}
                              {curSongObj?.lyrics && (
                                <div className="pt-2 border-t border-rose-100">
                                  <button
                                    type="button"
                                    onClick={() => setShowSelectedLyrics(!showSelectedLyrics)}
                                    className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <span>📜 {showSelectedLyrics ? 'Thu gọn lời bài hát' : 'Xem lời bài hát (Lyrics)'}</span>
                                    <span className="text-[10px] text-stone-500">
                                      {showSelectedLyrics ? '▴' : '▾'}
                                    </span>
                                  </button>

                                  {showSelectedLyrics && (
                                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-stone-700 whitespace-pre-line font-serif leading-relaxed max-h-48 overflow-y-auto">
                                      <p className="font-bold text-[11px] text-rose-800 uppercase tracking-wider mb-1 font-sans">
                                        Lời bài hát: {curSongObj.title}
                                      </p>
                                      {curSongObj.lyrics}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Complete Popular Wedding Songs Grid with Mode Filtering */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              <span>🌟</span>
                              <span>
                                Danh sách bài hát cưới {musicModeFilter === 'vocal' ? 'Có Lời' : musicModeFilter === 'instrumental' ? 'Không Lời' : 'thịnh hành'}:
                              </span>
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {findSongByQuery('', musicModeFilter).length} bài hát chọn lọc
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                            {findSongByQuery('', musicModeFilter).map((song) => {
                              const isCurSong = data.musicTitle?.includes(song.title) || data.musicTrackUrl === song.url;
                              const isCurrentPlaying = isAudioPlaying(song.url);
                              return (
                                <div
                                  key={song.id}
                                  onClick={() => handleSelectSong(song)}
                                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                    isCurSong
                                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200'
                                      : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50/40'
                                  }`}
                                >
                                  <div className="truncate flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-gray-900 truncate">{song.title}</span>
                                      <span className={`text-[8px] px-1 py-0.2 rounded font-bold shrink-0 ${
                                        song.mode === 'vocal'
                                          ? 'bg-rose-100 text-rose-800'
                                          : 'bg-sky-100 text-sky-800'
                                      }`}>
                                        {song.mode === 'vocal' ? 'Có Lời' : 'Không Lời'}
                                      </span>
                                      {isCurSong && (
                                        <span className="text-[8px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold shrink-0">
                                          Đang chọn ✓
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-gray-500 truncate block">{song.artist}</span>
                                      {song.lyrics && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveLyricsSong(song);
                                          }}
                                          className="text-[9px] text-rose-600 hover:text-rose-800 font-bold shrink-0 underline"
                                        >
                                          Lời bài hát
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTogglePreview(song.url);
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                                      isCurrentPlaying
                                        ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                                        : 'bg-stone-100 hover:bg-amber-200 text-stone-700'
                                    }`}
                                    title={isCurrentPlaying ? 'Tạm dừng' : 'Nghe thử'}
                                  >
                                    {isCurrentPlaying ? (
                                      <>
                                        <span className="font-mono text-xs font-black tracking-tighter">❚❚</span>
                                        <span>Dừng</span>
                                        <span className="flex items-center gap-0.5 h-2">
                                          <span className="w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                                          <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.35s' }} />
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-[9px]">▶</span>
                                        <span>Nghe</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom MP3 URL Input Option */}
                        <div className="border-t border-amber-200/80 pt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Hoặc dán link file nhạc MP3 tùy chỉnh của riêng bạn:
                          </label>
                          <input
                            type="url"
                            value={data.musicTrackUrl || ''}
                            onChange={(e) => setData({ ...data, musicTrackUrl: e.target.value })}
                            placeholder="https://example.com/audio/my-wedding-song.mp3"
                            className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-xl text-center text-xs text-stone-500">
                        Chức năng phát nhạc nền đang tắt. Hãy tích chọn <strong>"Bật nhạc nền"</strong> ở trên để khách truy cập có thể nghe nhạc khi mở thiệp cưới.
                      </div>
                    )}
                  </div>
                )}

                {/* Effect and Custom Slug */}
                <div className="border-t border-stone-200 pt-4 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Hiệu Ứng Rơi & Đường Dẫn Thiệp
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Hiệu ứng hoạt họa
                      </label>
                      <select
                        value={data.fallingEffect}
                        onChange={(e) => setData({ ...data, fallingEffect: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-rose-500 bg-white"
                      >
                        <option value="petals">🌸 Cánh hoa hồng rơi</option>
                        <option value="hearts">💕 Trái tim bay lãng mạn</option>
                        <option value="sparkles">✨ Ánh sáng lấp lánh</option>
                        <option value="none">Không dùng hiệu ứng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Đường dẫn riêng (Slug)
                      </label>
                      <input
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                        placeholder="nam-huong-wedding"
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-rose-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: THÔNG TIN DÂU & RỂ */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Thông tin Cô Dâu & Chú Rể</h2>
                  <p className="text-xs text-gray-500">
                    Nhập tên hai bạn và họ tên phụ mẫu hai bên gia đình.
                  </p>
                </div>

                {/* Chú rể */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    🤵 Nhà Trai (Chú Rể)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Họ và tên Chú Rể
                      </label>
                      <input
                        type="text"
                        value={data.groom.fullName}
                        onChange={(e) => updateGroom('fullName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Tên gọi thân mật
                      </label>
                      <input
                        type="text"
                        value={data.groom.shortName}
                        onChange={(e) => updateGroom('shortName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Thứ bậc</label>
                      <input
                        type="text"
                        value={data.groom.birthOrder}
                        onChange={(e) => updateGroom('birthOrder', e.target.value)}
                        placeholder="Trưởng nam"
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Họ tên Bố</label>
                      <input
                        type="text"
                        value={data.groom.fatherName}
                        onChange={(e) => updateGroom('fatherName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Họ tên Mẹ</label>
                      <input
                        type="text"
                        value={data.groom.motherName}
                        onChange={(e) => updateGroom('motherName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Cô dâu */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-3">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                    👰 Nhà Gái (Cô Dâu)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Họ và tên Cô Dâu
                      </label>
                      <input
                        type="text"
                        value={data.bride.fullName}
                        onChange={(e) => updateBride('fullName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Tên gọi thân mật
                      </label>
                      <input
                        type="text"
                        value={data.bride.shortName}
                        onChange={(e) => updateBride('shortName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Thứ bậc</label>
                      <input
                        type="text"
                        value={data.bride.birthOrder}
                        onChange={(e) => updateBride('birthOrder', e.target.value)}
                        placeholder="Ái nữ"
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Họ tên Bố</label>
                      <input
                        type="text"
                        value={data.bride.fatherName}
                        onChange={(e) => updateBride('fatherName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Họ tên Mẹ</label>
                      <input
                        type="text"
                        value={data.bride.motherName}
                        onChange={(e) => updateBride('motherName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LỊCH TRÌNH HÔN LỄ */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Lịch Trình & Địa Điểm Hôn Lễ</h2>
                  <p className="text-xs text-gray-500">
                    Cấu hình thời gian tổ chức tiệc cưới, lễ thành hôn và link bản đồ Google Maps.
                  </p>
                </div>

                <div className="space-y-4">
                  {data.ceremonies.map((ceremony, idx) => (
                    <div key={ceremony.id || idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800">
                          Sự kiện #{idx + 1}: {ceremony.title}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Tiêu đề sự kiện
                          </label>
                          <input
                            type="text"
                            value={ceremony.title}
                            onChange={(e) => updateCeremony(idx, 'title', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Giờ tổ chức
                          </label>
                          <input
                            type="text"
                            value={ceremony.time}
                            onChange={(e) => updateCeremony(idx, 'time', e.target.value)}
                            placeholder="11:30"
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Ngày Dương lịch
                          </label>
                          <input
                            type="date"
                            value={ceremony.dateSolar}
                            onChange={(e) => updateCeremony(idx, 'dateSolar', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Ngày Âm lịch
                          </label>
                          <input
                            type="text"
                            value={ceremony.dateLunar}
                            onChange={(e) => updateCeremony(idx, 'dateLunar', e.target.value)}
                            placeholder="16 Tháng 3 Năm Giáp Thìn"
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Tên Trung tâm / Tư gia
                          </label>
                          <input
                            type="text"
                            value={ceremony.venueName}
                            onChange={(e) => updateCeremony(idx, 'venueName', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Link Google Maps
                          </label>
                          <input
                            type="text"
                            value={ceremony.mapUrl || ''}
                            onChange={(e) => updateCeremony(idx, 'mapUrl', e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Địa chỉ cụ thể
                        </label>
                        <input
                          type="text"
                          value={ceremony.address}
                          onChange={(e) => updateCeremony(idx, 'address', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dress Code & Quy Định Trang Phục */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        👗 Dress Code & Gợi Ý Trang Phục
                      </h3>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Gợi ý màu sắc trang phục cho khách mời để ảnh kỷ niệm hài hòa nhất.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Lời nhắn / Hướng dẫn trang phục:
                    </label>
                    <textarea
                      rows={2}
                      value={data.dressCode?.description || ''}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          dressCode: {
                            ...(prev.dressCode || {
                              enabled: true,
                              title: 'Dress Code & Trang Phục',
                              colors: [
                                { name: 'Trắng Sữa', hex: '#FAF9F6' },
                                { name: 'Be / Pastel', hex: '#EAD7C5' },
                                { name: 'Terracotta', hex: '#C27D56' },
                                { name: 'Xanh Sage', hex: '#8FA392' },
                                { name: 'Vàng Cát', hex: '#D1AC00' }
                              ]
                            }),
                            description: e.target.value
                          }
                        }))
                      }
                      placeholder="Để những bức hình kỷ niệm thêm phần đồng điệu, kính mong quý khách ưu tiên trang phục..."
                      className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-semibold text-gray-600">Bảng màu hiển thị:</span>
                    <div className="flex items-center gap-2">
                      {(data.dressCode?.colors || [
                        { name: 'Trắng Sữa', hex: '#FAF9F6' },
                        { name: 'Be / Pastel', hex: '#EAD7C5' },
                        { name: 'Terracotta', hex: '#C27D56' },
                        { name: 'Xanh Sage', hex: '#8FA392' },
                        { name: 'Vàng Cát', hex: '#D1AC00' }
                      ]).map((c, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-stone-300 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ẢNH CƯỚI & ALBUM (CHUNGDOI STYLE) */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Ảnh Cưới & Album Kỷ Niệm</h2>
                  <p className="text-xs text-gray-500">
                    Tải ảnh từ điện thoại hoặc máy tính của bạn. Ảnh sẽ tự động đồng bộ ngay vào thiệp!
                  </p>
                </div>

                {/* 1. Ảnh Bìa Chính (Hero Photo) */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                      🌟 1. Ảnh Bìa Thiệp Cưới (Hero Image)
                    </span>
                    {data.heroPhoto && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        ✓ Đã có ảnh
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Bức ảnh đẹp nhất của cô dâu & chú rể, hiển thị trang trọng trên đầu thiệp trong khung vòm nghệ thuật.
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    {/* Preview Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-200 border border-rose-200 shrink-0 relative shadow-sm">
                      <img
                        src={data.heroPhoto || TEMPLATES.find((t) => t.id === data.templateId)?.frameAsset}
                        alt="Ảnh bìa"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={heroInputRef}
                        accept="image/*"
                        onChange={handleHeroUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <span>📁 Tải ảnh từ thiết bị của bạn</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              heroPhoto:
                                'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80'
                            })
                          }
                          className="flex-1 py-1.5 rounded-lg border border-gray-300 text-[10px] font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Dùng ảnh mẫu 1
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              heroPhoto:
                                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&auto=format&fit=crop&q=80'
                            })
                          }
                          className="flex-1 py-1.5 rounded-lg border border-gray-300 text-[10px] font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Dùng ảnh mẫu 2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Album Ảnh Cưới (Photo Gallery) */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      📸 2. Album Ảnh Cưới Pre-Wedding ({data.galleryImages.length} ảnh)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Tải lên không giới hạn ảnh cưới (5, 10, 20 ảnh tuỳ ý). Trên thiệp mời, ban đầu hệ thống sẽ xếp gọn 5 ảnh đẹp nhất và kèm nút <strong>[Xem thêm ảnh]</strong> để khách mời bấm mở rộng toàn bộ album.
                  </p>

                  <input
                    type="file"
                    ref={galleryInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-stone-800 bg-white border border-amber-300 hover:bg-amber-100/50 shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>➕ Tải thêm nhiều ảnh vào album</span>
                  </button>

                  {/* Thumbnails Grid with Delete Button */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {data.galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-amber-200 bg-stone-200 shadow-2xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center shadow-md opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: QUỸ MỪNG CƯỚI VIETQR */}
            {activeStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Quỹ Mừng Cưới (VietQR Tự Động)</h2>
                  <p className="text-xs text-gray-500">
                    Chỉ cần chọn ngân hàng và điền số tài khoản, mã QR chuẩn VietQR sẽ được sinh tự động!
                  </p>
                </div>

                {/* Tài khoản Chú rể */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    💳 Tài khoản Chú Rể
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Ngân hàng</label>
                      <select
                        value={data.groom.bank.bankCode}
                        onChange={(e) => {
                          const bank = VIETNAMESE_BANKS.find((b) => b.code === e.target.value);
                          updateGroomBank('bankCode', e.target.value);
                          if (bank) updateGroomBank('bankName', bank.name);
                        }}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      >
                        {VIETNAMESE_BANKS.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.code} - {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Số tài khoản</label>
                      <input
                        type="text"
                        value={data.groom.bank.accountNumber}
                        onChange={(e) => updateGroomBank('accountNumber', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tên chủ tài khoản</label>
                      <input
                        type="text"
                        value={data.groom.bank.accountName}
                        onChange={(e) => updateGroomBank('accountName', e.target.value.toUpperCase())}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Tài khoản Cô dâu */}
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                    💳 Tài khoản Cô Dâu
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Ngân hàng</label>
                      <select
                        value={data.bride.bank.bankCode}
                        onChange={(e) => {
                          const bank = VIETNAMESE_BANKS.find((b) => b.code === e.target.value);
                          updateBrideBank('bankCode', e.target.value);
                          if (bank) updateBrideBank('bankName', bank.name);
                        }}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs"
                      >
                        {VIETNAMESE_BANKS.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.code} - {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Số tài khoản</label>
                      <input
                        type="text"
                        value={data.bride.bank.accountNumber}
                        onChange={(e) => updateBrideBank('accountNumber', e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tên chủ tài khoản</label>
                      <input
                        type="text"
                        value={data.bride.bank.accountName}
                        onChange={(e) => updateBrideBank('accountName', e.target.value.toUpperCase())}
                        className="w-full p-2 rounded-lg border border-gray-300 text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Lời cảm ơn */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Lời cảm ơn chân thành cuối thiệp
                  </label>
                  <textarea
                    rows={2}
                    value={data.thankYouMessage}
                    onChange={(e) => setData({ ...data, thankYouMessage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Buttons */}
          <div className="border-t border-stone-200 p-4 bg-stone-50/70 flex justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1) as any)}
              disabled={activeStep === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Quay lại
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1) as any)}
              disabled={activeStep === 5}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 shadow-sm"
            >
              Tiếp tục →
            </button>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview (Split View) */}
        <div
          className={`flex-1 flex flex-col items-center justify-center ${
            showMobilePreview ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="w-full max-w-[390px] h-[780px] bg-black rounded-[48px] p-3 shadow-2xl ring-8 ring-stone-800/10 flex flex-col relative overflow-hidden">
            {/* iPhone Dynamic Island Mockup Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 pointer-events-none" />

            {/* Mobile Screen Container */}
            <div
              ref={phoneScrollRef}
              className="flex-1 bg-white rounded-[38px] overflow-y-auto relative no-scrollbar"
            >
              <WeddingView data={data} isLivePreview={true} />
            </div>
          </div>
          <span className="text-[11px] text-gray-400 mt-3 font-medium">
            📱 Xem trước trực tiếp trên giao diện Smartphone
          </span>
        </div>
        {/* MODAL XEM LỜI BÀI HÁT (LYRICS MODAL) */}
        {activeLyricsSong && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveLyricsSong(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm shadow-xs">
                    📜
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900 leading-tight">
                      {activeLyricsSong.title}
                    </h3>
                    <p className="text-[11px] text-stone-500">{activeLyricsSong.artist}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLyricsSong(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Mode & status badge */}
              <div className="px-5 py-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  activeLyricsSong.mode === 'vocal'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-sky-100 text-sky-800'
                }`}>
                  {activeLyricsSong.mode === 'vocal' ? '🎤 Bản Có Lời (Vocal)' : '🎻 Bản Không Lời (Instrumental)'}
                </span>

                <span className="text-stone-400 font-medium">Thời lượng: {activeLyricsSong.duration || '04:00'}</span>
              </div>

              {/* Lyrics Scrollable Body */}
              <div className="p-5 overflow-y-auto flex-1 text-center font-serif text-stone-800 text-sm leading-relaxed whitespace-pre-line bg-gradient-to-b from-stone-50/50 to-white selection:bg-rose-100">
                {activeLyricsSong.lyrics || 'Đang cập nhật lời bài hát...'}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePreview(activeLyricsSong.url)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAudioPlaying(activeLyricsSong.url)
                      ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {isAudioPlaying(activeLyricsSong.url) ? (
                    <>
                      <span className="font-mono text-xs font-black tracking-tighter">❚❚</span>
                      <span>Tạm dừng</span>
                      <span className="flex items-center gap-0.5 h-2.5">
                        <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                        <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.35s' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px]">▶</span>
                      <span>Nghe thử bài này</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectSong(activeLyricsSong);
                    setActiveLyricsSong(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Chọn bài này cho thiệp ✓</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-600 font-sans">
          <div className="text-center space-y-2">
            <span className="text-3xl block animate-spin">💍</span>
            <p className="text-xs font-semibold">Đang tải trình tạo thiệp cưới...</p>
          </div>
        </div>
      }
    >
      <CreateInvitationContent />
    </Suspense>
  );
}
