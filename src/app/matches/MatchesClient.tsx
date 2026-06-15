'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Search, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface Partner {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
}

interface LastMessage {
  text: string;
  createdAt: Date;
  senderId: string;
}

interface Match {
  id: string;
  partner: Partner;
  lastMessage: LastMessage | null;
}

interface MatchesClientProps {
  initialMatches: Match[];
}

export default function MatchesClient({ initialMatches }: MatchesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем совпадения по поисковому запросу
  const filteredMatches = initialMatches.filter((match) =>
    match.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Новые совпадения (без истории сообщений, кроме стартового автоматического)
  // Для простоты разделим: если последнее сообщение отправлено системой/партнером как приветствие, но пользователь еще не писал сам.
  // Или просто: новые совпадения — это те, где только 1 сообщение (приветствие от партнера), а остальные — это чаты.
  // Но проще сделать: если сообщений нет вовсе или только 1 приветственное автоматическое.
  // Давайте для наглядности выделим новые совпадения (первые 4 мэтча) в горизонтальную ленту, а остальные — в вертикальный список.
  const newMatches = filteredMatches.filter(m => !m.lastMessage);
  const activeChats = filteredMatches.filter(m => m.lastMessage);

  // Если новых совпадений нет, поместим все мэтчи в ленту для красоты, либо выделим несколько профилей без сообщений
  const horizontalMatches = newMatches.length > 0 ? newMatches : filteredMatches.slice(0, 5);
  const verticalChats = activeChats.length > 0 ? activeChats : filteredMatches;

  if (initialMatches.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
          <MessageSquare className="w-10 h-10 text-zinc-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Здесь будут ваши мэтчи</h3>
        <p className="text-zinc-400 text-sm mb-8 max-w-xs leading-relaxed">
          Продолжайте свайпать анкеты на главном экране. Как только случится взаимная симпатия, профиль появится здесь!
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-gradient text-white font-bold hover:opacity-90 transition shadow-lg shadow-pink-500/20 active:scale-95"
        >
          <Flame className="w-5 h-5 fill-white" />
          Начать свайпать
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* Шапка */}
      <h1 className="text-2xl font-black text-white mb-4">Совпадения</h1>

      {/* Поиск */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Поиск по мэтчам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all duration-300"
        />
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
      </div>

      {/* Раздел: Новые совпадения (горизонтальный список) */}
      {horizontalMatches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-3">
            Новые пары
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {horizontalMatches.map((match) => (
              <Link
                key={match.id}
                href={`/chat/${match.partner.id}`}
                className="flex flex-col items-center flex-shrink-0 w-20 group"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 shadow-md shadow-pink-500/10 group-active:scale-95 transition duration-200">
                  <img
                    src={match.partner.photoUrl}
                    alt={match.partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-zinc-300 mt-2 truncate w-full text-center">
                  {match.partner.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Раздел: Сообщения (вертикальный список диалогов) */}
      <div className="flex-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
          Сообщения
        </h2>
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {verticalChats.map((match) => {
            const hasLastMsg = !!match.lastMessage;
            const timeString = hasLastMsg
              ? new Date(match.lastMessage!.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <motion.div
                key={match.id}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-zinc-900/40 hover:border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/50 transition duration-200"
              >
                <Link
                  href={`/chat/${match.partner.id}`}
                  className="flex items-center gap-4 p-3.5"
                >
                  {/* Аватар */}
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
                    <img
                      src={match.partner.photoUrl}
                      alt={match.partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Текст и имя */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-bold text-white text-sm truncate">
                        {match.partner.name}
                      </h3>
                      {timeString && (
                        <span className="text-[10px] text-zinc-500">{timeString}</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate pr-4">
                      {hasLastMsg
                        ? match.lastMessage!.text
                        : 'Вы совпали! Начните общение прямо сейчас.'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
