'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ZENLOVE_TEMPLATES, ZenLoveTemplate } from '@/constants/zenlove-templates';
import { TemplateCardV3 } from '@/components/template-card-v3';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'thiep-cuoi' | 'thiep-tot-nghiep' | 'thiep-sinh-nhat'>('all');
  const [activeStyle, setActiveStyle] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return ZENLOVE_TEMPLATES.filter((t) => {
      if (activeCategory === 'thiep-cuoi' && t.category !== 'thiep-cuoi') return false;
      if (activeCategory === 'thiep-tot-nghiep' && t.category !== 'thiep-tot-nghiep') return false;
      if (activeCategory === 'thiep-sinh-nhat' && t.category !== 'thiep-sinh-nhat') return false;

      if (priceFilter === 'free' && t.templateType !== 'free') return false;
      if (priceFilter === 'premium' && t.templateType !== 'premium') return false;

      if (activeStyle !== 'all') {
        const text = (t.name + ' ' + t.description).toLowerCase();
        if (!text.includes(activeStyle.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }

      return true;
    });
  }, [activeCategory, activeStyle, priceFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo/logo-6.svg" alt="ZenLove" className="w-8 h-8 object-contain" />
            <img src="/assets/logo/text-logo-dark.svg" alt="ZenLove" className="h-5 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-rose-600 transition-colors">Trang chủ</Link>
            <Link href="/templates" className="text-rose-600 font-bold hover:text-rose-700 transition-colors">Mẫu thiệp</Link>
            <Link href="/thiep-online/khach-hang" className="hover:text-rose-600 transition-colors">Thiệp đã tạo</Link>
            <Link href="/pricing" className="hover:text-rose-600 transition-colors">Gói dịch vụ</Link>
            <Link href="/contact" className="hover:text-rose-600 transition-colors">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Tạo thiệp ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-stone-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Mẫu thiệp</span>
        </nav>

        {/* Title & Description */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Kho mẫu thiệp cưới online đẹp tinh tế
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Khám phá hơn 50+ mẫu thiệp cưới online miễn phí, hiện đại, hỗ trợ nhạc nền, bản đồ, RSVP và hộp mừng cưới VietQR.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 pb-8 border-b border-stone-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100 border border-stone-200 overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  activeCategory === 'all' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('thiep-cuoi')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  activeCategory === 'thiep-cuoi' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Thiệp cưới
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('thiep-tot-nghiep')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  activeCategory === 'thiep-tot-nghiep' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Thiệp tốt nghiệp
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('thiep-sinh-nhat')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  activeCategory === 'thiep-sinh-nhat' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Thiệp sinh nhật
              </button>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm mẫu thiệp..."
                className="w-full px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Style Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
            <span className="text-stone-400 font-medium shrink-0">Phong cách:</span>
            {['all', 'Truyền thống', 'Hiện đại', 'Tối giản', 'Điện ảnh', 'Hoa sen', 'Hàn Quốc'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setActiveStyle(st === 'all' ? 'all' : st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  activeStyle === (st === 'all' ? 'all' : st)
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {st === 'all' ? 'Tất cả phong cách' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of 50 Templates with Auto-Scroll Hover Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-8">
          {filtered.map((template, idx) => (
            <TemplateCardV3
              key={template.id}
              template={template}
              priority={idx < 6}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-stone-400 space-y-2">
            <span className="text-5xl block">💌</span>
            <p className="text-sm font-medium">Không tìm thấy mẫu thiệp nào theo tiêu chí lựa chọn.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveStyle('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <img src="/assets/logo/logo-5.svg" alt="ZenLove" className="h-6 w-auto" />
            <span className="font-bold text-white text-base">ZenLove</span>
          </div>
          <p>© {new Date().getFullYear()} ZenLove.me. Toàn bộ bản quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
