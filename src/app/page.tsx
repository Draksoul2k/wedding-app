'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TEMPLATES, TemplateConfig } from '@/constants/templates';
import { TemplatePreviewModal } from '@/components/template-preview-modal';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'chungdoi' | 'cinelove' | 'zenlove' | 'motdoi'>('all');
  const [activeVariants, setActiveVariants] = useState<Record<string, string>>({});
  const [previewModalTemplate, setPreviewModalTemplate] = useState<TemplateConfig | null>(null);

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesSource = sourceFilter === 'all' || t.source === sourceFilter;
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSource && matchesCat;
  });

  const getTemplateAsset = (t: TemplateConfig) => {
    if (t.colorVariants && t.colorVariants.length > 0) {
      const activeVariantId = activeVariants[t.id];
      const found = t.colorVariants.find((v) => v.id === activeVariantId);
      if (found) return found.frameAsset;
    }
    return t.frameAsset;
  };

  const getTemplateColor = (t: TemplateConfig) => {
    if (t.colorVariants && t.colorVariants.length > 0) {
      const activeVariantId = activeVariants[t.id];
      const found = t.colorVariants.find((v) => v.id === activeVariantId);
      if (found) return found.primaryColor;
    }
    return t.primaryColor;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="text-xl font-bold font-serif text-rose-700">Chung Đôi</span>
            <span className="hidden sm:inline-block text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full ml-1">
              Thiệp Cưới Online
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/thiep/thanh-tung-lan-anh"
              className="hidden sm:inline-block px-4 py-2 text-xs font-semibold text-gray-700 hover:text-rose-600 transition-colors"
            >
              Xem thiệp mẫu
            </Link>
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              Tạo Thiệp Ngay ✨
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-rose-50/60 via-amber-50/40 to-stone-50">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold">
            <span>🎬</span>
            <span>Bộ sưu tập 52+ mẫu thiệp cưới đa dạng phong cách, bố cục độc bản & hiện đại</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            Mỗi Mẫu Một Bố Cục Riêng <br className="hidden sm:inline" />
            <span className="text-rose-700">Đẹp Độc Bản & Tinh Tế</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Không còn sự trùng lặp màu sắc rườm rà. Mỗi thiết kế đều có phong cách và bố cục độc đáo riêng biệt,
            hỗ trợ tùy chọn tông màu chủ đạo trực tiếp và cuộn xem toàn bộ thiệp mượt mà.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg hover:shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Bắt Đầu Tạo Thiệp Miễn Phí</span>
              <span>→</span>
            </Link>

            <Link
              href="/thiep/demo?template=cine-thiep-cuoi-61"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Xem Mẫu Điện Ảnh VIP</span>
              <span>🎬</span>
            </Link>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto pt-8 text-left">
            {[
              { icon: '🎬', title: '52 Mẫu Thiết Kế', desc: 'Đa dạng phong cách & bố cục' },
              { icon: '🎨', title: 'Chọn Tông Màu', desc: 'Đổi màu ngay trên mẫu' },
              { icon: '🎵', title: 'Nhạc Theo Tên', desc: 'Nhập tên bài hát tự phát' },
              { icon: '👗', title: 'Bảng Dress Code', desc: 'Gợi ý trang phục khách' },
              { icon: '💳', title: 'VietQR Mừng Cưới', desc: 'Sinh mã QR ngân hàng' },
              { icon: '💌', title: 'Mở Bì Thư 3D', desc: 'Con dấu sáp hoàng gia' },
            ].map((prop, i) => (
              <div key={i} className="p-3 bg-white/90 rounded-2xl border border-stone-200/70 shadow-xs hover:border-rose-300 transition-all">
                <span className="text-xl block mb-1">{prop.icon}</span>
                <p className="font-bold text-xs text-stone-800">{prop.title}</p>
                <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Catalog */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 flex-1 w-full">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-600 font-bold">
            Thư viện thiết kế nguyên bản
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Khám Phá Các Bố Cục Thiệp Cưới Độc Đáo
          </h2>
          <p className="text-xs text-stone-500">
            Di chuột vào từng mẫu để cuộn xem toàn bộ giao diện từ trên xuống dưới
          </p>
        </div>

        {/* Dual Filter Bars: Website Source + Style */}
        <div className="space-y-3 mb-8">
          {/* Collection Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: `Tất cả mẫu (${TEMPLATES.length})` },
              { id: 'cinelove', label: `🎬 Điện Ảnh & Poster (${TEMPLATES.filter((t) => t.source === 'cinelove').length} mẫu)` },
              { id: 'motdoi', label: `🌟 Thanh Lịch & Quý Phái (${TEMPLATES.filter((t) => t.source === 'motdoi').length} mẫu)` },
              { id: 'chungdoi', label: `🌸 Đa Sắc Phối Màu (${TEMPLATES.filter((t) => t.source === 'chungdoi').length} mẫu)` },
              { id: 'zenlove', label: `🌿 Mộc Mạc & Tối Giản (${TEMPLATES.filter((t) => t.source === 'zenlove').length} mẫu)` },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSourceFilter(s.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  sourceFilter === s.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Category Style Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Mọi phong cách' },
              { id: 'hien_dai', label: '🎬 Điện ảnh & Tạp chí' },
              { id: 'toi_gian', label: '✨ Tối giản & Lịch tháng' },
              { id: 'truyen_thong', label: '🏮 Cổ điển Song Hỷ' },
              { id: 'hoa_la', label: '🌸 Vườn hoa thảo mộc' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Templates with CineLove Hover-to-Scroll Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const currentAsset = getTemplateAsset(template);
            const currentColor = getTemplateColor(template);

            return (
              <div
                key={template.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Smooth CineLove Auto-Scroll & Click to Preview Modal */}
                <div
                  onClick={() => setPreviewModalTemplate(template)}
                  className="relative h-80 sm:h-84 overflow-hidden bg-stone-100 cursor-pointer"
                >
                  <img
                    src={currentAsset}
                    alt={template.name}
                    className="w-full h-full object-cover object-top block select-none transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient shadow top & bottom */}
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <span className="text-[10px] text-white/80 font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      ↓ Bấm để xem thử tự lướt & chi tiết
                    </span>
                  </div>

                  {/* Source & Tag Badges */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-stone-950/85 text-amber-300 shadow-md backdrop-blur-xs uppercase border border-amber-400/20">
                    {template.source === 'cinelove'
                      ? '🎬 Điện Ảnh'
                      : template.source === 'motdoi'
                      ? '🌟 Thanh Lịch'
                      : template.source === 'zenlove'
                      ? '🌿 Tối Giản'
                      : '🌸 Đa Sắc'}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-md backdrop-blur-xs">
                    {template.tag}
                  </span>
                </div>

                {/* Card Content & Color Variant Selector */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3
                        onClick={() => setPreviewModalTemplate(template)}
                        className="font-serif font-bold text-sm text-stone-900 group-hover:text-rose-600 transition-colors truncate cursor-pointer"
                      >
                        {template.name}
                      </h3>
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 shrink-0 shadow-2xs"
                        style={{ backgroundColor: currentColor }}
                        title={`Màu chủ đạo: ${currentColor}`}
                      />
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Color Variant Palette Dots (for templates with multiple colors) */}
                  {template.colorVariants && template.colorVariants.length > 0 && (
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-stone-600">Đổi màu mẫu:</span>
                      <div className="flex items-center gap-1.5">
                        {template.colorVariants.map((variant) => {
                          const isSelected = (activeVariants[template.id] || template.colorVariants![0].id) === variant.id;
                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveVariants((prev) => ({
                                  ...prev,
                                  [template.id]: variant.id
                                }));
                              }}
                              className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-125 ${
                                isSelected ? 'ring-2 ring-rose-500 scale-110 border-white shadow-sm' : 'border-white/80'
                              }`}
                              style={{ backgroundColor: variant.primaryColor }}
                              title={variant.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/create?template=${template.id}${activeVariants[template.id] ? `&variant=${activeVariants[template.id]}` : ''}`}
                      className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
                    >
                      Dùng Mẫu Này
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPreviewModalTemplate(template)}
                      className="px-3.5 py-2.5 rounded-xl text-center text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      Xem Thử
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ZenLove Style Interactive Template Preview Modal */}
        {previewModalTemplate && (
          <TemplatePreviewModal
            template={previewModalTemplate}
            activeVariantId={activeVariants[previewModalTemplate.id]}
            onClose={() => setPreviewModalTemplate(null)}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">💍</span>
            <span className="font-serif font-bold text-base">Chung Đôi</span>
            <span className="text-stone-500 text-[11px]">© 2026. All rights reserved.</span>
          </div>
          <p className="text-stone-500 text-center sm:text-right">
            Nền tảng tạo thiệp cưới online thế hệ mới – Nhanh chóng, Sang trọng, Đậm dấu ấn riêng.
          </p>
        </div>
      </footer>
    </div>
  );
}
