'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDateStr: string; // "2026-10-24" or "2026-10-24 11:00"
  theme?: 'cinema' | 'pastel' | 'traditional';
  activeColor?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateStr,
  theme = 'pastel',
  activeColor = '#c2182b',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 120, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateStr || '2026-10-24T11:00:00').getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (theme === 'cinema') {
    return (
      <div className="bg-stone-900/95 border border-amber-400/30 rounded-2xl p-4 text-center max-w-xs mx-auto shadow-2xl backdrop-blur-md">
        <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-semibold block mb-2">
          COUNTDOWN TO PREMIERE
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: timeLeft.days, label: 'NGÀY' },
            { val: timeLeft.hours, label: 'GIỜ' },
            { val: timeLeft.minutes, label: 'PHÚT' },
            { val: timeLeft.seconds, label: 'GIÂY' },
          ].map((item, i) => (
            <div key={i} className="bg-black/80 rounded-xl py-2 px-1 border border-stone-800 shadow-inner">
              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 block tracking-tight">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (theme === 'traditional') {
    return (
      <div
        className="rounded-2xl p-4 text-center max-w-xs mx-auto shadow-md border"
        style={{ backgroundColor: activeColor + '10', borderColor: activeColor + '40' }}
      >
        <span className="text-xs font-serif font-bold uppercase tracking-wider block mb-2" style={{ color: activeColor }}>
          ĐẾM NGƯỢC NGÀY VUI
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: timeLeft.days, label: 'Ngày' },
            { val: timeLeft.hours, label: 'Giờ' },
            { val: timeLeft.minutes, label: 'Phút' },
            { val: timeLeft.seconds, label: 'Giây' },
          ].map((item, i) => (
            <div key={i} className="bg-white/95 rounded-xl py-2 px-1 border shadow-xs" style={{ borderColor: activeColor + '30' }}>
              <span className="text-xl font-serif font-bold block" style={{ color: activeColor }}>
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-medium text-stone-600 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default pastel / minimalist
  return (
    <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 text-center max-w-xs mx-auto shadow-sm">
      <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold block mb-2">
        Cùng Đếm Ngược Khoảnh Khắc
      </span>
      <div className="grid grid-cols-4 gap-2">
        {[
          { val: timeLeft.days, label: 'Ngày' },
          { val: timeLeft.hours, label: 'Giờ' },
          { val: timeLeft.minutes, label: 'Phút' },
          { val: timeLeft.seconds, label: 'Giây' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl py-2 px-1 border border-stone-200 shadow-2xs">
            <span className="text-xl font-serif font-bold text-stone-800 block" style={{ color: activeColor }}>
              {String(item.val).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-stone-400 block font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
