'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZenLoveTemplate } from '@/constants/zenlove-templates';

interface TemplateCardV3Props {
  template: ZenLoveTemplate;
  priority?: boolean;
}

const ASPECT_RATIO_CONSTANT = 1000 / 1470; // 0.68027

export const TemplateCardV3: React.FC<TemplateCardV3Props> = ({ template, priority = false }) => {
  const router = useRouter();
  const [scrollPercent, setScrollPercent] = useState<number>(75);
  const [durationSec, setDurationSec] = useState<number>(5.5);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const pct = Number((100 * Math.max(0, 1 - (naturalWidth / naturalHeight) / ASPECT_RATIO_CONSTANT)).toFixed(2));
      const dur = Number(Math.max(1.4, pct / 9).toFixed(2));
      setScrollPercent(pct);
      setDurationSec(dur);
    }
  };

  const badgeBg =
    template.templateType === 'premium'
      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
      : template.tag === 'Hot'
      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';

  const badgeText =
    template.templateType === 'premium'
      ? 'PREMIUM'
      : template.tag === 'Hot'
      ? 'HOT'
      : 'MIỄN PHÍ';

  return (
    <div
      className="template-item-v3 infrastructure"
      style={{
        '--image-scroll-percent': `${scrollPercent}%`,
        '--scroll-duration': `${durationSec}s`
      } as React.CSSProperties}
    >
      <article className="group/template-item-v3 relative flex w-full cursor-pointer flex-col items-center rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out hover:-translate-y-[8px] hover:bg-white hover:shadow-xl overflow-hidden bg-white">
        {/* Aspect Ratio Container (1000:1470) */}
        <div className="relative w-full overflow-hidden rounded-[10px] aspect-[1000/1470] bg-gray-100">
          {/* Badge */}
          <div
            className={`absolute top-2 right-2 z-10 rounded-full px-2 py-[2px] text-[10px] font-bold uppercase leading-[16px] tracking-[0.5px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] backdrop-blur-[4px] transition-all duration-200 group-hover/template-item-v3:-translate-y-8 group-hover/template-item-v3:opacity-0 ${badgeBg}`}
          >
            {badgeText}
          </div>

          {/* Long Scroll Image */}
          <Link
            href={`/template-preview/${template.slug || template.id}`}
            className="relative inline-block h-full w-full overflow-hidden bg-gray-100"
          >
            <img
              src={template.longThumbnailUrl}
              alt={template.name}
              title={`Xem và tùy chỉnh ${template.name}`}
              onLoad={handleImageLoad}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="auto-scroll-img h-auto w-full align-top [transform:translate3d(0,0,0)] transition-transform duration-200 ease-out group-hover/template-item-v3:[transition-duration:var(--scroll-duration)] group-hover/template-item-v3:[transition-timing-function:ease] group-hover/template-item-v3:[transform:translate3d(0,calc(var(--image-scroll-percent,0%)*-1),0)]"
            />
          </Link>

          {/* Hover Overlay Button */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/template-item-v3:opacity-100 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
            <button
              type="button"
              onClick={() => router.push(`/template-preview/${template.slug || template.id}`)}
              className="pointer-events-auto px-5 py-2 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Xem mẫu</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Template Information */}
        <div className="w-full px-2.5 py-3 text-center">
          <h3 className="font-serif font-bold text-sm text-stone-800 truncate" title={template.name}>
            {template.name}
          </h3>
          <p className="text-[11px] text-stone-400 capitalize mt-0.5">
            {template.templateType === 'premium' ? 'Gói Cao Cấp' : 'Miễn Phí'}
          </p>
        </div>
      </article>
    </div>
  );
};
