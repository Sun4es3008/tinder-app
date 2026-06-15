'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  photoUrl: string;
}

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
}

export default function SwipeCard({ user, onSwipe, active }: SwipeCardProps) {
  const x = useMotionValue(0);

  // Динамические трансформации угла поворота и прозрачности штампов
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLike = useTransform(x, [10, 100], [0, 1]);
  const opacityNope = useTransform(x, [-100, -10], [1, 0]);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!active) return;

    const threshold = 120;
    if (info.offset.x > threshold) {
      // Лайк (свайп вправо)
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      // Скип (свайп влево)
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x: active ? x : 0, rotate: active ? rotate : 0, zIndex: active ? 10 : 1 }}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      animate={active ? undefined : { scale: 0.95, opacity: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute w-full h-[65dvh] rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800 touch-none ${
        active ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* Изображение профиля */}
      <img
        src={user.photoUrl}
        alt={user.name}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Затемняющий оверлей снизу */}
      <div className="absolute inset-0 card-gradient-overlay pointer-events-none" />

      {/* Штамп "LIKE" (зеленый) */}
      {active && (
        <motion.div
          style={{ opacity: opacityLike }}
          className="absolute top-10 left-10 border-4 border-emerald-500 text-emerald-500 text-3xl font-black px-4 py-2 rounded-xl uppercase tracking-wider rotate-[-12deg] pointer-events-none"
        >
          LIKE
        </motion.div>
      )}

      {/* Штамп "NOPE" (красный) */}
      {active && (
        <motion.div
          style={{ opacity: opacityNope }}
          className="absolute top-10 right-10 border-4 border-rose-500 text-rose-500 text-3xl font-black px-4 py-2 rounded-xl uppercase tracking-wider rotate-[12deg] pointer-events-none"
        >
          NOPE
        </motion.div>
      )}

      {/* Информация о пользователе */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col text-white pointer-events-none">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-black tracking-tight">{user.name}</span>
          <span className="text-2xl font-light text-zinc-300">{user.age}</span>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 select-none">
          {user.bio}
        </p>
      </div>
    </motion.div>
  );
}
