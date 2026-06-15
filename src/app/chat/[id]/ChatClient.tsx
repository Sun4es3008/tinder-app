'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { sendMessage, getMessages } from '@/app/actions';
import { motion } from 'framer-motion';

interface Partner {
  id: string;
  name: string;
  photoUrl: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface ChatClientProps {
  matchId: string;
  partner: Partner;
  initialMessages: Message[];
}

export default function ChatClient({ matchId, partner, initialMessages }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Скролл вниз к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Фоновое обновление сообщений каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const freshMsgs = await getMessages(matchId);
        setMessages(freshMsgs as any);
      } catch (err) {
        console.error('Ошибка обновления сообщений:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [matchId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    // Оптимистичное добавление сообщения в локальный стейт
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      senderId: 'currentUser',
      text: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Симулируем набор текста собеседником через полсекунды
    let typingTimeout: NodeJS.Timeout;
    typingTimeout = setTimeout(() => {
      setIsTyping(true);
    }, 600);

    try {
      await sendMessage(matchId, textToSend);
      
      // Через 1.8 секунды загружаем актуальные сообщения с авто-ответом партнера
      setTimeout(async () => {
        const freshMsgs = await getMessages(matchId);
        setMessages(freshMsgs as any);
        setIsTyping(false);
      }, 1800);
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-950 text-white relative">
      {/* Шапка чата */}
      <header className="h-16 border-b border-zinc-900 glass flex items-center px-4 justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/matches" className="p-1 hover:bg-zinc-900 rounded-full transition">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
              <img
                src={partner.photoUrl}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">{partner.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500">В сети</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'currentUser';
          const time = new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-brand-gradient text-white rounded-tr-none shadow-md shadow-pink-500/10'
                    : 'bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-800'
                }`}
              >
                <p className="leading-relaxed break-words">{msg.text}</p>
                <span className="block text-[9px] text-zinc-400 text-right mt-1 font-light">
                  {time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Анимация "Печатает..." */}
        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="bg-zinc-900 text-zinc-100 rounded-2xl rounded-tl-none border border-zinc-800 px-4 py-3.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода сообщения */}
      <form
        onSubmit={handleSend}
        className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900/60 px-4 flex items-center gap-3 z-10"
      >
        <input
          type="text"
          placeholder="Напишите сообщение..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white focus:outline-none focus:border-pink-500 transition duration-300"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-pink-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <Send className="w-5 h-5 fill-white ml-0.5" />
        </button>
      </form>
    </div>
  );
}
