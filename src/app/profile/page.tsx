'use client';

import React, { useState } from 'react';
import { Flame, Shield, Settings, Bell, HelpCircle, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [premiumActive, setPremiumActive] = useState(true);

  const stats = [
    { label: 'Лайков', value: '148', icon: Heart, color: 'text-pink-500' },
    { label: 'Мэтчей', value: '18', icon: Flame, color: 'text-orange-500' },
    { label: 'Рейтинг', value: '9.8', icon: Award, color: 'text-yellow-500' },
  ];

  const menuItems = [
    { label: 'Поиск и расстояние', icon: Settings, desc: 'Радиус 15 км, возраст 18-30' },
    { label: 'Уведомления', icon: Bell, desc: 'Включены пуш-уведомления' },
    { label: 'Безопасность', icon: Shield, desc: 'Верифицированный профиль' },
    { label: 'Помощь и поддержка', icon: HelpCircle, desc: 'Ответ в течение 5 минут' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* Шапка */}
      <h1 className="text-2xl font-black text-white mb-6">Профиль</h1>

      {/* Аватар и Имя */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-800 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
              alt="Иван"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-zinc-950 flex items-center justify-center" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-white">Иван</h2>
          <span className="text-xl font-light text-zinc-400">25</span>
        </div>
        <p className="text-xs text-zinc-500">Москва, Россия</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center"
            >
              <Icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <span className="text-lg font-black text-white">{stat.value}</span>
              <span className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">{stat.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Премиум баннер */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="w-full bg-brand-gradient rounded-3xl p-5 mb-8 text-white relative overflow-hidden shadow-lg shadow-pink-500/10 cursor-pointer"
        onClick={() => setPremiumActive(!premiumActive)}
      >
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h3 className="font-black text-lg tracking-tight mb-1 flex items-center gap-2">
              Tinder Gold <Flame className="w-5 h-5 fill-white" />
            </h3>
            <p className="text-xs text-pink-100 opacity-90 max-w-[200px]">
              {premiumActive ? 'Ваш тариф активен! Безлимитные лайки включены.' : 'Активируйте подписку для безлимитных лайков и супер-бустов.'}
            </p>
          </div>
          <span className="px-4 py-2 bg-white text-pink-600 rounded-full font-bold text-xs shadow-md">
            {premiumActive ? 'АКТИВЕН' : 'КУПИТЬ'}
          </span>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-6 translate-x-6" />
      </motion.div>

      {/* Список настроек */}
      <div className="flex-1 flex flex-col gap-3">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-card p-4 rounded-2xl flex items-center gap-4 border border-zinc-900/60 hover:border-zinc-800/80 transition duration-200 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Icon className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-100">{item.label}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
