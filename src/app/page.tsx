'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZENLOVE_TEMPLATES, ZenLoveTemplate } from '@/constants/zenlove-templates';
import { TemplateCardV3 } from '@/components/template-card-v3';

export default function ZenLoveHomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'thiep-cuoi' | 'thiep-tot-nghiep' | 'thiep-sinh-nhat'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return ZENLOVE_TEMPLATES.filter((t) => {
      // Category tab
      if (activeTab === 'thiep-cuoi' && t.category !== 'thiep-cuoi') return false;
      if (activeTab === 'thiep-tot-nghiep' && t.category !== 'thiep-tot-nghiep') return false;
      if (activeTab === 'thiep-sinh-nhat' && t.category !== 'thiep-sinh-nhat') return false;

      // Price filter
      if (priceFilter === 'free' && t.templateType !== 'free') return false;
      if (priceFilter === 'premium' && t.templateType !== 'premium') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }

      return true;
    });
  }, [activeTab, priceFilter, searchQuery]);

  const faqs = [
    {
      q: 'Tôi có thể tạo thiệp cưới online miễn phí không?',
      a: 'Hoàn toàn có! ZenLove cung cấp rất nhiều mẫu thiệp cưới hoàn toàn miễn phí với đầy đủ tính năng: tải ảnh, bản đồ Google Maps, xác nhận tham dự (RSVP) và hộp mừng cưới VietQR.'
    },
    {
      q: 'Mất bao lâu để hoàn thành một thiệp cưới trên ZenLove?',
      a: 'Chỉ mất khoảng 3 đến 5 phút! Bạn chỉ cần chọn mẫu ưng ý, nhập thông tin cô dâu chú rể, tải lên ảnh cưới và nhấn xuất bản là có ngay đường link thiệp cưới gửi khách.'
    },
    {
      q: 'Khách mời xem thiệp cưới trên điện thoại có mượt không?',
      a: 'Thiệp cưới ZenLove được tối ưu hóa 100% cho mọi thiết bị di động (iPhone, Android, máy tính bảng), hỗ trợ cuộn mượt, nhạc nền tự động và hiệu ứng hình ảnh sống động.'
    },
    {
      q: 'Tính năng xác nhận tham dự (RSVP) hoạt động như thế nào?',
      a: 'Khách mời khi mở thiệp có thể chọn tham dự một mình hoặc cùng gia đình, gửi lời chúc phúc. Kết quả sẽ được cập nhật tức thì giúp bạn thống kê số lượng bàn tiệc chuẩn xác.'
    },
    {
      q: 'Tôi có thể thay đổi nhạc nền trong thiệp cưới không?',
      a: 'Có, ZenLove tích hợp sẵn kho nhạc cưới lãng mạn thịnh hành và cho phép bạn tải lên bài hát kỷ niệm riêng của hai bạn.'
    }
  ];

  const customerShowcases = [
    { names: 'Bình & Thanh', date: '25.10.2026', img: 'https://cdn-resource.zenlove.me/uploads/b5a885aa-05d5-4c52-9902-41f404c84f75/QklOMDc4NjMxXzE3OTA0MDYzNzA0MDRfZGV2NG42M3lzZWQ.jpg?crop=0,540,1216,811&format=webp&quality=80' },
    { names: 'Phương Hồng & Thanh Bình', date: '18.11.2026', img: 'https://cdn-resource.zenlove.me/uploads/f3e26d9a-d549-4266-80f8-12ba9ba4b257/Mjg5QTcxNThfMTc4OTA0NzA3Njk1Nl94d3NrcXo0MTd0.jpg?crop=85,235,1459,973&format=webp&quality=80' },
    { names: 'Thế Bách & Kim Chi', date: '02.12.2026', img: 'https://cdn-resource.zenlove.me/uploads/4516ba33-a28d-489d-8d2b-e4c161e3bb27/MTc4OTcwMjk5MDMyMTkxOTc0ODQzMTQyMTIxNzUyMDE5MTk3NDg0MzE0MjEyMTc1MjAxNGVkMjY0ZDliYTc4MzY2M2RlODAzNDRlNDYwNTEwMGFfMTc4OTcxMzc1MjU3MF91emlvMWIybjY5.jpg?crop=0,285,1215,911&format=webp&quality=80' },
    { names: 'Huy Cường & Anh Thư', date: '12.12.2026', img: 'https://cdn-resource.zenlove.me/uploads/17a8e516-9334-43f5-bf69-72d4e499e5c9/SU1HMDcxOV8xNzg1NTg1MDE5NTAwX3lrZW4xaXpramg.jpg?crop=90,427,973,730&format=webp&quality=80' },
    { names: 'Quang Hiếu & Thu Trang', date: '20.12.2026', img: 'https://cdn-resource.zenlove.me/uploads/b05fcd1c-eb7f-4540-b833-3ca1fb7486ff/thu-trang-and-quang-hieu/MmFPYm9ReTRsWmZzT3JYZ1VVaWY1bEo2SzA0ekc5cjVtSFBjdEJiTV8xNzg5MTkzODIyNjQ5XzF4bW4wa2htZnZu.jpg?crop=0,221,1279,853&format=webp&quality=80' },
    { names: 'Xuân Hào & Mỹ Linh', date: '08.01.2027', img: 'https://cdn-resource.zenlove.me/uploads/1c8efe88-34a5-42ff-b0cc-0422dc7ac205/TU9OMDUwMTdfMTc5MDM5MTA5MjMwOV9jMTI4eHByOTlx.jpg?crop=71,132,996,560&format=webp&quality=80' }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. ZENLOVE HEADER / NAVBAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/assets/logo/logo-6.svg" alt="ZenLove Logo" className="w-8 h-8 object-contain" />
            <img src="/assets/logo/text-logo-dark.svg" alt="ZenLove" className="h-5 w-auto object-contain" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <Link href="/" className="text-rose-600 font-bold hover:text-rose-700 transition-colors">
              Trang chủ
            </Link>
            <Link href="/templates" className="hover:text-rose-600 transition-colors">
              Mẫu thiệp
            </Link>
            <Link href="/thiep-online/khach-hang" className="hover:text-rose-600 transition-colors">
              Thiệp đã tạo
            </Link>
            <Link href="/pricing" className="hover:text-rose-600 transition-colors">
              Gói dịch vụ
            </Link>
            <Link href="/contact" className="hover:text-rose-600 transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>Tạo thiệp ngay</span>
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-stone-300 hover:border-stone-400 text-stone-700 text-xs sm:text-sm font-medium transition-all"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO BANNER SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-rose-50/40 via-white to-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-semibold">
                <span>💖</span>
                <span>Miễn Phí • Đẹp Tinh Tế • Trong 5 Phút</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight tracking-tight">
                Tạo thiệp cưới online miễn phí, đẹp tinh tế trong 5 bước
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ZenLove là nền tảng tạo thiệp cưới online miễn phí chỉ với 5 phút, thay vì gửi thiệp giấy truyền thống qua tay, giờ đây bạn có thể gửi thiệp mời chỉ qua một đường link. Bắt đầu ngay!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/templates"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Tạo thiệp cưới ngay</span>
                  <span>→</span>
                </Link>
                <Link
                  href="#catalog"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Xem mẫu thiệp</span>
                </Link>
              </div>

              {/* Value stats */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-stone-500 text-xs">
                <div>
                  <span className="block text-xl font-black text-stone-900">50+</span>
                  <span>Mẫu thiệp đa dạng</span>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <span className="block text-xl font-black text-stone-900">100.000+</span>
                  <span>Cặp đôi tin dùng</span>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <span className="block text-xl font-black text-stone-900">100%</span>
                  <span>Miễn phí tạo thiệp</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Showcase */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-300/30 to-rose-300/30 rounded-3xl blur-2xl pointer-events-none" />
                <img
                  src="/assets/landing/hero-pc.webp"
                  alt="ZenLove Wedding Mockup"
                  className="relative w-full h-auto object-contain drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM & SOLUTION SECTION                                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold block">
              BẠN ĐANG CÓ KẾ HOẠCH MỜI TIỆC KHÁCH?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Nhưng có nhiều vấn đề phải bận tâm?
            </h2>
          </div>

          {/* 3 Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-2xl">
                ⏳
              </div>
              <h3 className="font-bold text-base text-stone-900">Mất nhiều thời gian</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tốn nhiều tuần để viết tay từng phong bì, đi phát thiệp tận nơi hoặc lo lắng thư bị thất lạc trên đường bưu điện.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                💌
              </div>
              <h3 className="font-bold text-base text-stone-900">Không đủ chia sẻ thành ý</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Thiệp giấy chỉ in được 1 ảnh nhỏ đơn điệu, không thể truyền tải hết câu chuyện tình yêu, album ảnh cưới và giai điệu âm nhạc.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="font-bold text-base text-stone-900">Không biết số khách mời tham dự</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Khó nắm bắt số lượng khách tham dự thực tế, dẫn đến việc đặt thừa hoặc thiếu cỗ tiệc, gây lãng phí chi phí cưới.
              </p>
            </div>
          </div>

          {/* 4 Feature Solutions */}
          <div className="mt-16 pt-12 border-t border-stone-100">
            <div className="text-center mb-10">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                Tính năng nổi bật của ZenLove
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/50 space-y-2">
                <span className="text-2xl block">⚡</span>
                <h4 className="font-bold text-sm text-stone-900">Thiết kế kéo thả nhanh chóng</h4>
                <p className="text-xs text-stone-500">Tùy biến dễ dàng ảnh dâu rể, ngày giờ và địa điểm chỉ trong 5 phút.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/50 space-y-2">
                <span className="text-2xl block">📝</span>
                <h4 className="font-bold text-sm text-stone-900">Quản lý số lượng khách (RSVP)</h4>
                <p className="text-xs text-stone-500">Khách xác nhận tham dự với 1 chạm, tổng hợp tự động số lượng khách.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/50 space-y-2">
                <span className="text-2xl block">🎨</span>
                <h4 className="font-bold text-sm text-stone-900">Đa dạng các mẫu thiệp online</h4>
                <p className="text-xs text-stone-500">50+ mẫu thiệp từ Cổ Điển Á Đông, Hiện Đại, Hàn Quốc tới Điện Ảnh.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/50 space-y-2">
                <span className="text-2xl block">🚀</span>
                <h4 className="font-bold text-sm text-stone-900">Dễ dàng chia sẻ trực tuyến</h4>
                <p className="text-xs text-stone-500">Gửi qua link Zalo, Facebook, SMS chỉ 1 chạm, tương thích mọi điện thoại.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TEMPLATE CATALOG SECTION WITH HOVER AUTO-SCROLL PREVIEW                */}
      {/* ========================================================================= */}
      <section id="catalog" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold block">
            KHO THIỆP MỜI ONLINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Các mẫu thiệp cưới online đẹp và miễn phí
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Rê chuột vào bất kỳ mẫu nào để xem trước toàn bộ thiệp tự động cuộn dọc
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-stone-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100 border border-stone-200/80 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('thiep-cuoi')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'thiep-cuoi' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Thiệp cưới
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('thiep-tot-nghiep')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'thiep-tot-nghiep' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Thiệp tốt nghiệp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('thiep-sinh-nhat')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'thiep-sinh-nhat' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Thiệp sinh nhật
            </button>
          </div>

          {/* Price / Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="free">Miễn phí (Free)</option>
              <option value="premium">Cao cấp (Premium)</option>
            </select>
          </div>
        </div>

        {/* Templates Grid (Auto-Scroll Preview upon Hover) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-8">
          {filteredTemplates.map((template, idx) => (
            <TemplateCardV3
              key={template.id}
              template={template}
              priority={idx < 6}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="text-sm">Không tìm thấy mẫu thiệp phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. 3-STEP GUIDE SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold block">
              QUY TRÌNH ĐƠN GIẢN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Tạo thiệp cưới online chỉ với 3 bước
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-base flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="font-bold text-base text-stone-900">Chọn mẫu thiệp</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Khám phá kho mẫu thiệp cưới đa phong cách và chọn thiết kế bạn yêu thích nhất.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-base flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-bold text-base text-stone-900">Cá nhân hóa nội dung</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tải lên ảnh cưới, cập nhật tên dâu rể, thời gian tổ chức hôn lễ và số tài khoản mừng cưới.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-base flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="font-bold text-base text-stone-900">Gửi thiệp &amp; Quản lý</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nhận đường link thiệp cưới riêng biệt và gửi qua Zalo, Facebook, theo dõi phản hồi RSVP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REAL CUSTOMER WEDDINGS SHOWCASE                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold block">
            CÂU CHUYỆN HẠNH PHÚC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Các thiệp mời đã được chia sẻ bởi người dùng
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {customerShowcases.map((c, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs hover:shadow-lg transition-all">
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={c.img}
                  alt={c.names}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5 text-center">
                <h4 className="font-serif font-bold text-xs text-stone-800 truncate">{c.names}</h4>
                <p className="text-[10px] font-mono text-stone-400 mt-0.5">{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQ ACCORDION SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-t border-stone-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold block">
              CÂU HỎI THƯỜNG GẶP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Danh mục câu hỏi thường gặp về ZenLove
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-[#fafaf9]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-100/50"
                >
                  <span>{f.q}</span>
                  <span className="text-base text-stone-400 font-mono">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ZENLOVE FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="bg-stone-900 text-stone-400 pt-16 pb-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
            {/* Col 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/assets/logo/logo-5.svg" alt="ZenLove" className="h-7 w-auto" />
                <span className="font-bold text-white text-lg tracking-wide">ZenLove</span>
              </div>
              <p className="leading-relaxed text-stone-400">
                Nền tảng tạo thiệp cưới online miễn phí, tinh tế và hiện đại số 1 Việt Nam. Giúp các cặp đôi gửi gắm trọn vẹn yêu thương.
              </p>
              <div className="pt-2">
                <img src="/assets/landing/DaThongBao_BCT.png" alt="Đã Thông Báo Bộ Công Thương" className="h-10 w-auto" />
              </div>
            </div>

            {/* Col 2: Liên kết */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Mẫu Thiệp Mời</h4>
              <ul className="space-y-2">
                <li><Link href="/templates" className="hover:text-white transition-colors">Thiệp cưới online</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Thiệp tốt nghiệp</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Thiệp sinh nhật</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Mẫu thiệp mới nhất</Link></li>
              </ul>
            </div>

            {/* Col 3: Chính sách & Pháp lý */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Chính Sách &amp; Hỗ Trợ</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
                <li><Link href="/payment-policy" className="hover:text-white transition-colors">Chính sách thanh toán</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Trung tâm hỗ trợ</Link></li>
              </ul>
            </div>

            {/* Col 4: Liên hệ */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">Thông Tin Liên Hệ</h4>
              <p>Hotline: <strong className="text-white">0823 312 212</strong></p>
              <p>Email: <strong className="text-white">zenlove.support@gmail.com</strong></p>
              <p>Hỗ trợ: 8:00 - 22:00 hàng ngày</p>
              <div className="pt-2 flex items-center gap-3 text-lg">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">📘</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">📷</a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">🎵</a>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-stone-500">
            <p>© {new Date().getFullYear()} ZenLove.me. Toàn bộ bản quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
