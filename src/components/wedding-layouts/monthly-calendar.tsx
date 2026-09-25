'use client';

import React from 'react';

interface MonthlyCalendarProps {
  weddingDateStr?: string;
  targetDateStr?: string;
  activeColor?: string;
  accentColor?: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  weddingDateStr,
  targetDateStr,
  activeColor,
  accentColor
}) => {
  const dateStr = weddingDateStr || targetDateStr || '2026-10-24';
  const color = activeColor || accentColor || '#b91c1c';
  // Parse date or fallback to Oct 2026
  let year = 2026;
  let month = 10; // 1-indexed
  let day = 24;

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
  } catch (e) {
    // fallback
  }

  // Days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  // First day of month (0 = Sun, 1 = Mon, etc.)
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  // Vietnamese days: T2 (1), T3 (2), T4 (3), T5 (4), T6 (5), T7 (6), CN (0)
  const dayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 for Monday

  const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const gridCells: (number | null)[] = [];

  for (let i = 0; i < dayOffset; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push(d);
  }

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-stone-200 shadow-sm max-w-xs mx-auto text-center font-sans">
      <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
          Lịch Ngày Cưới
        </span>
        <span className="text-sm font-bold font-serif" style={{ color }}>
          Tháng {month} / {year}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[11px] mb-2 font-medium text-stone-400">
        {dayHeaders.map((h, i) => (
          <div key={i} className="py-1">
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {gridCells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="p-1" />;
          }
          const isWeddingDay = cell === day;
          return (
            <div
              key={`day-${cell}`}
              className={`aspect-square flex items-center justify-center rounded-full text-[11px] transition-all relative ${
                isWeddingDay
                  ? 'font-bold text-white shadow-md animate-pulse'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
              style={
                isWeddingDay
                  ? { backgroundColor: color }
                  : {}
              }
            >
              {cell}
              {isWeddingDay && (
                <span className="absolute -top-1.5 -right-1 text-[10px] leading-none">
                  ❤️
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-stone-500 mt-3 italic">
        Save the date • Ngày hai ta nên duyên vợ chồng
      </p>
    </div>
  );
};
