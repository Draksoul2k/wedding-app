'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AutoScrollControllerProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  activeColor?: string;
  defaultActive?: boolean;
  className?: string;
}

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({
  scrollContainerRef,
  activeColor = '#e11d48',
  defaultActive = false,
  className,
}) => {
  const [isScrolling, setIsScrolling] = useState<boolean>(defaultActive);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // 1 = normal (approx 1px per frame), 2 = faster
  const userInteractingRef = useRef<boolean>(false);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const getTarget = (): { getScroll: () => number; setScroll: (val: number) => void; getMax: () => number } => {
      if (scrollContainerRef && scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        return {
          getScroll: () => el.scrollTop,
          setScroll: (val) => { el.scrollTop = val; },
          getMax: () => el.scrollHeight - el.clientHeight,
        };
      }
      return {
        getScroll: () => window.scrollY || document.documentElement.scrollTop,
        setScroll: (val) => { window.scrollTo({ top: val, behavior: 'auto' }); },
        getMax: () => document.documentElement.scrollHeight - window.innerHeight,
      };
    };

    const handleUserScroll = () => {
      userInteractingRef.current = true;
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
      // Resume auto scroll 2.5s after user stops touching/scrolling
      userTimeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, 2500);
    };

    const targetEl = scrollContainerRef?.current || (typeof window !== 'undefined' ? window : null);
    if (targetEl) {
      targetEl.addEventListener('wheel', handleUserScroll, { passive: true });
      targetEl.addEventListener('touchmove', handleUserScroll, { passive: true });
    }

    const scrollLoop = (time: number) => {
      if (isScrolling && !userInteractingRef.current) {
        const delta = Math.min(time - lastTime, 50); // cap delta
        lastTime = time;
        const target = getTarget();
        const max = target.getMax();
        const current = target.getScroll();

        if (max > 0) {
          if (current >= max - 2) {
            // Reached bottom, pause and loop smoothly to top after 3.5s
            userInteractingRef.current = true;
            setTimeout(() => {
              target.setScroll(0);
              setTimeout(() => {
                userInteractingRef.current = false;
              }, 600);
            }, 3500);
          } else {
            const step = (delta / 16.6) * (scrollSpeed * 0.95);
            target.setScroll(current + step);
          }
        }
      } else {
        lastTime = time;
      }
      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
      if (targetEl) {
        targetEl.removeEventListener('wheel', handleUserScroll);
        targetEl.removeEventListener('touchmove', handleUserScroll);
      }
    };
  }, [isScrolling, scrollSpeed, scrollContainerRef]);

  const handleScrollToTop = () => {
    if (scrollContainerRef && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={className || "fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-1.5 pointer-events-auto"}>
      {/* Auto scroll toggle pill */}
      <button
        type="button"
        onClick={() => setIsScrolling(!isScrolling)}
        className={`px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xl backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer ${
          isScrolling
            ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-300/40 animate-pulse'
            : 'bg-black/75 hover:bg-black/90 text-stone-200 border-white/20'
        }`}
        title={isScrolling ? 'Bấm để dừng tự động cuộn' : 'Bấm để tự động cuộn theo nhịp'}
      >
        <span>{isScrolling ? '❚❚ Tự lướt: BẬT' : '▶ Tự lướt: TẮT'}</span>
        <span className="text-[10px] opacity-80">📜</span>
      </button>

      {/* Speed & Top controls when active */}
      {isScrolling && (
        <button
          type="button"
          onClick={() => setScrollSpeed(scrollSpeed === 1 ? 1.8 : 1)}
          className="px-2 py-1.5 rounded-full text-[10px] font-mono font-bold bg-black/75 text-amber-300 border border-white/20 shadow-md backdrop-blur-md hover:bg-black"
          title="Tốc độ lướt"
        >
          {scrollSpeed}x
        </button>
      )}

      <button
        type="button"
        onClick={handleScrollToTop}
        className="w-7 h-7 rounded-full bg-black/75 text-white text-xs border border-white/20 shadow-md backdrop-blur-md hover:bg-black flex items-center justify-center cursor-pointer"
        title="Cuộn về đầu trang"
      >
        ↑
      </button>
    </div>
  );
};
