'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FloatingWishItem {
  name: string;
  content: string;
  avatar?: string;
  time?: string;
}

const DEFAULT_FLOATING_WISHES: FloatingWishItem[] = [
  { name: 'Linh', avatar: '🌸', content: 'Đồng lòng xây đắp tổ ấm trăm năm viên mãn! 🎉' },
  { name: 'Hà', avatar: '💐', content: 'Chúc mừng hạnh phúc hai bạn trăm năm bền chặt!' },
  { name: 'Huy (Bạn ĐH)', avatar: '🥂', content: 'Sớm đón quý tử, mãi ngọt ngào như ngày đầu nha!' },
  { name: 'Chanh', avatar: '💍', content: 'Mẫu thiệp cưới siêu đẹp! Trăm năm hạnh phúc nhé!' },
  { name: 'Minh Thảo', avatar: '✨', content: 'Tân lang tuấn tú, tân nương dịu dàng, đôi lứa xứng đôi!' },
  { name: 'Quang Anh', avatar: '🎉', content: 'Về chung một nhà, hạnh phúc ngập tràn mỗi ngày!' },
  { name: 'Phương Ly', avatar: '💖', content: 'Mãi mãi một tình yêu nồng thắm và ngọt ngào nhé!' },
];

interface ActiveBubble {
  bubbleId: string;
  name: string;
  avatar: string;
  content: string;
}

interface FloatingWishesStreamProps {
  primaryColor?: string;
  activeAccent?: string;
  wishes?: FloatingWishItem[];
  className?: string;
}

export const FloatingWishesStream: React.FC<FloatingWishesStreamProps> = ({
  primaryColor = '#e11d48',
  activeAccent = '#f59e0b',
  wishes = [],
  className,
}) => {
  // Combine real user wishes (if any) with default sample wishes
  const allWishes: FloatingWishItem[] = React.useMemo(() => {
    if (wishes && wishes.length > 0) {
      return [...wishes, ...DEFAULT_FLOATING_WISHES];
    }
    return DEFAULT_FLOATING_WISHES;
  }, [wishes]);

  const [visibleWishes, setVisibleWishes] = useState<ActiveBubble[]>([]);
  const currentIndexRef = useRef(0);
  const [likeCount, setLikeCount] = useState(87);
  const [toastHearts, setToastHearts] = useState<Array<{ id: number; x: number; icon: string }>>([]);
  const prevWishesLengthRef = useRef(wishes.length);

  // Initialize first 2 bubbles
  useEffect(() => {
    const firstTwo = allWishes.slice(0, 2).map((w, idx) => ({
      bubbleId: `init-${idx}-${Date.now()}`,
      name: w.name,
      avatar: w.avatar || (idx % 2 === 0 ? '🌸' : '💍'),
      content: w.content,
    }));
    setVisibleWishes(firstTwo);
    currentIndexRef.current = 2;
  }, []);

  // When a guest submits a new wish, immediately inject it on top!
  useEffect(() => {
    if (wishes.length > prevWishesLengthRef.current) {
      const newestWish = wishes[0];
      if (newestWish) {
        const newBubble: ActiveBubble = {
          bubbleId: `guest-wish-${Date.now()}-${Math.random()}`,
          name: newestWish.name,
          avatar: newestWish.avatar || '💌',
          content: newestWish.content,
        };
        // Add to visible, keeping max 2 bubbles
        setVisibleWishes((cur) => {
          const nextList = [...cur.slice(-1), newBubble];
          return nextList;
        });

        // Trigger a cheerful burst of celebration hearts
        triggerCelebrationBurst();
      }
    }
    prevWishesLengthRef.current = wishes.length;
  }, [wishes]);

  // Rhythmically cycle next wish every 4 seconds, keeping exactly 2 bubbles
  useEffect(() => {
    const timer = setInterval(() => {
      if (allWishes.length === 0) return;

      const nextItem = allWishes[currentIndexRef.current % allWishes.length];
      currentIndexRef.current += 1;

      const nextBubble: ActiveBubble = {
        bubbleId: `bubble-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: nextItem.name,
        avatar: nextItem.avatar || '💖',
        content: nextItem.content,
      };

      setVisibleWishes((cur) => {
        // Keep strictly at most 2 bubbles to avoid stacking & blocking couple photos
        const updated = cur.length >= 2 ? [cur[cur.length - 1], nextBubble] : [...cur, nextBubble];
        return updated;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [allWishes]);

  const triggerCelebrationBurst = () => {
    setLikeCount((prev) => prev + 1);
    const id = Date.now() + Math.random();
    const icons = ['❤️', '💖', '💍', '✨', '💐', '🥂'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomX = Math.floor(Math.random() * 60) - 30;

    setToastHearts((prev) => [...prev, { id, x: randomX, icon: randomIcon }]);
    setTimeout(() => {
      setToastHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  const handleShootHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerCelebrationBurst();
  };

  const totalWishesCount = (wishes && wishes.length > 0 ? wishes.length : 0) + 87;

  return (
    <div
      className={
        className ||
        'absolute bottom-16 left-3 right-3 z-30 pointer-events-none flex flex-col justify-end max-w-sm'
      }
    >
      {/* Floating Wishes Bubbles Stream (Max 2 bubbles, smoothly fading up) */}
      <div className="space-y-1.5 max-w-[270px]">
        <AnimatePresence mode="popLayout">
          {visibleWishes.map((wish) => (
            <motion.div
              key={wish.bubbleId}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.88, transition: { duration: 0.35 } }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] shadow-lg pointer-events-auto"
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">
                {wish.avatar}
              </span>
              <span className="font-bold text-amber-200 shrink-0">{wish.name}:</span>
              <span className="truncate max-w-[160px] text-stone-100 font-medium">
                {wish.content}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Hearts Particles Burst */}
      <div className="relative pointer-events-none">
        {toastHearts.map((heart) => (
          <motion.span
            key={heart.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: heart.x }}
            animate={{ opacity: 0, y: -120, scale: 1.6, x: heart.x + (Math.random() * 20 - 10) }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute bottom-1 right-3 text-lg select-none"
          >
            {heart.icon}
          </motion.span>
        ))}
      </div>

      {/* Mini Interactive Engagement Bar (Như trong ảnh ZenLove) */}
      <div className="mt-2 flex items-center justify-between gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] flex items-center gap-1 shadow-md">
            <span>💬</span>
            <span className="font-semibold">Lời chúc:</span>
            <span className="font-mono text-amber-300 font-bold">{totalWishesCount}</span>
          </div>

          <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] flex items-center gap-1 font-mono">
            <span>🥂</span>
            <span>36</span>
          </div>
        </div>

        {/* Bắn tim button */}
        <button
          type="button"
          onClick={handleShootHeart}
          className="px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer border border-white/30"
          style={{ backgroundColor: primaryColor }}
        >
          <span>💖 Bắn tim</span>
          <span className="font-mono text-[9px] bg-black/30 px-1.5 py-0.2 rounded-full">
            {likeCount}
          </span>
        </button>
      </div>
    </div>
  );
};
