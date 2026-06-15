'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, MessageCircle, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { showMatchOverlay, matchedUser, closeMatchOverlay } = useAppStore();

  const navItems = [
    { href: '/', icon: Flame, label: 'Explore' },
    { href: '/matches', icon: MessageCircle, label: 'Chats' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  const isChatPage = pathname?.startsWith('/chat/');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      {/* Контейнер в виде телефона для десктопа */}
      <div className="relative w-full max-w-md h-[100dvh] bg-zinc-950 border-x border-zinc-900 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Контент страницы */}
        <main className={`flex-1 overflow-y-auto no-scrollbar relative ${isChatPage ? 'pb-0' : 'pb-20'}`}>
          {children}
        </main>

        {/* Нижняя навигационная панель */}
        {!isChatPage && (
          <nav className="absolute bottom-0 left-0 right-0 h-20 glass flex items-center justify-around px-4 z-40 border-t border-zinc-900/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 relative group">
                  <span className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-gradient-to-tr from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <Icon className="w-6 h-6" />
                  </span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeIndicator"
                      className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-pink-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Полноэкранный оверлей "Мэтч!" */}
        <AnimatePresence>
          {showMatchOverlay && matchedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="w-full flex flex-col items-center"
              >
                {/* Анимированный заголовок */}
                <motion.h1 
                  initial={{ letterSpacing: "2px" }}
                  animate={{ letterSpacing: "6px" }}
                  className="text-5xl font-black italic text-brand-gradient tracking-widest mb-2 animate-pulse"
                >
                  IT'S A MATCH!
                </motion.h1>
                <p className="text-zinc-400 text-sm mb-12">
                  Вы понравились друг другу!
                </p>

                {/* Фотографии */}
                <div className="flex items-center justify-center gap-6 mb-16 relative">
                  {/* Фото текущего юзера */}
                  <motion.div 
                    initial={{ x: -100, rotate: -15, opacity: 0 }}
                    animate={{ x: -10, rotate: -8, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-zinc-800"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop" 
                      alt="Вы" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Сердечко */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.5 }}
                    className="absolute z-10 w-12 h-12 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center shadow-lg"
                  >
                    <span className="text-2xl text-white">❤️</span>
                  </motion.div>

                  {/* Фото собеседника */}
                  <motion.div 
                    initial={{ x: 100, rotate: 15, opacity: 0 }}
                    animate={{ x: 10, rotate: 8, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-zinc-800"
                  >
                    <img 
                      src={matchedUser.photoUrl} 
                      alt={matchedUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                <p className="text-xl font-bold text-white mb-8">
                  Вы и {matchedUser.name} подошли друг другу
                </p>

                {/* Кнопки */}
                <div className="w-full flex flex-col gap-4">
                  <Link 
                    href={`/chat/${matchedUser.id}`}
                    onClick={closeMatchOverlay}
                    className="w-full py-4 rounded-full bg-brand-gradient text-white font-bold hover:opacity-90 transition shadow-lg shadow-pink-500/20 text-center active:scale-95"
                  >
                    Написать сообщение
                  </Link>
                  <button 
                    onClick={closeMatchOverlay}
                    className="w-full py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:bg-zinc-800 transition active:scale-95"
                  >
                    Продолжить свайпы
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
