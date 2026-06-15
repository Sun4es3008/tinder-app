'use client';

import React, { useState } from 'react';
import SwipeCard from '@/components/SwipeCard';
import { swipeUser, getProfiles } from './actions';
import { useAppStore } from '@/store/useAppStore';
import { Flame, Heart, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  photoUrl: string;
}

interface ExploreClientProps {
  initialProfiles: User[];
}

export default function ExploreClient({ initialProfiles }: ExploreClientProps) {
  const [profiles, setProfiles] = useState<User[]>(initialProfiles);
  const [loading, setLoading] = useState(false);
  const { triggerMatch } = useAppStore();

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (profiles.length === 0) return;

    const topProfile = profiles[0];
    // Убираем карточку с экрана (клиентская оптимизация)
    setProfiles((prev) => prev.slice(1));

    try {
      // Отправляем свайп на сервер
      const res = await swipeUser(topProfile.id, direction === 'right');
      if (res.match && res.matchedUser) {
        // Если случился мэтч, показываем полноэкранный оверлей
        triggerMatch({
          id: res.matchedUser.id,
          name: res.matchedUser.name,
          age: res.matchedUser.age,
          gender: res.matchedUser.gender,
          bio: res.matchedUser.bio,
          photoUrl: res.matchedUser.photoUrl,
        });
      }
    } catch (error) {
      console.error('Ошибка записи свайпа:', error);
    }
  };

  const handleReload = async () => {
    setLoading(true);
    try {
      const freshProfiles = await getProfiles();
      setProfiles(freshProfiles);
    } catch (error) {
      console.error('Ошибка загрузки профилей:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 relative">
      {/* Шапка */}
      <header className="flex items-center justify-between py-2 border-b border-zinc-900/50">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-pink-500 fill-pink-500" />
          <span className="text-xl font-black tracking-wider text-brand-gradient">
            tinder
          </span>
          <span className="text-xs px-2 py-0.5 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full font-bold">
            PREMIUM
          </span>
        </div>
      </header>

      {/* Стопка карточек */}
      <div className="flex-1 flex items-center justify-center relative my-6">
        <AnimatePresence>
          {profiles.length > 0 ? (
            // Рендерим только первые 2 карточки для оптимизации производительности
            profiles.slice(0, 2).reverse().map((user, index, arr) => {
              const isActive = index === arr.length - 1;
              return (
                <SwipeCard
                  key={user.id}
                  user={user}
                  onSwipe={handleSwipe}
                  active={isActive}
                />
              );
            })
          ) : (
            // Экран окончания профилей
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 glass-card rounded-3xl flex flex-col items-center max-w-xs w-full"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                <Flame className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">На этом всё!</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Вы посмотрели все анкеты поблизости. Попробуйте обновить список.
              </p>
              <button
                onClick={handleReload}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white font-semibold hover:bg-zinc-800 transition active:scale-95 disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Загрузка...' : 'Повторить поиск'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Кнопки действий */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-4">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-rose-500 shadow-lg shadow-black/40 hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Skip"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-18 h-18 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Like"
          >
            <Heart className="w-9 h-9 fill-white" />
          </button>
        </div>
      )}
    </div>
  );
}
