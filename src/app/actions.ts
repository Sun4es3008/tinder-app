'use server';

import { prisma } from '@/lib/prisma';

const CURRENT_USER_ID = 'currentUser';

// Обеспечиваем наличие текущего тестового пользователя
async function ensureCurrentUser() {
  const user = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
  });
  if (!user) {
    return await prisma.user.create({
      data: {
        id: CURRENT_USER_ID,
        name: 'Иван',
        age: 25,
        gender: 'male',
        bio: 'Тестовый аккаунт. Ищу баги и настоящую любовь. 💻✨',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
      },
    });
  }
  return user;
}

// Получить профили других пользователей для свайпов
export async function getProfiles() {
  await ensureCurrentUser();
  // Находим пользователей, с которыми нет мэтчей
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userId: CURRENT_USER_ID },
        { matchedUserId: CURRENT_USER_ID }
      ]
    }
  });

  const matchedUserIds = matches.map((m: { userId: string; matchedUserId: string }) => m.userId === CURRENT_USER_ID ? m.matchedUserId : m.userId);

  return await prisma.user.findMany({
    where: {
      id: {
        notIn: [CURRENT_USER_ID, ...matchedUserIds]
      }
    }
  });
}

// Свайпнуть пользователя (лайк или дизлайк)
export async function swipeUser(targetUserId: string, isLike: boolean) {
  await ensureCurrentUser();
  
  if (!isLike) {
    return { match: false };
  }

  // Если лайк, генерируем мэтч с вероятностью 50%
  const isMatch = Math.random() < 0.5;
  if (isMatch) {
    // Проверяем, существует ли уже мэтч
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userId: CURRENT_USER_ID, matchedUserId: targetUserId },
          { userId: targetUserId, matchedUserId: CURRENT_USER_ID }
        ]
      }
    });

    if (!existingMatch) {
      const match = await prisma.match.create({
        data: {
          userId: CURRENT_USER_ID,
          matchedUserId: targetUserId,
        }
      });

      const matchedUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      });

      // Отправляем первое приветственное сообщение от имени мэтча
      const welcomes = [
        'Привет! Как дела? 😊',
        'Привет! Классный профиль. Чем занимаешься?',
        'О, привет! Рад мэтчу. Давай поболтаем? ✨',
        'Привет! Какое фото красивое. Где это снималось?',
      ];
      const randomWelcome = welcomes[Math.floor(Math.random() * welcomes.length)];
      await prisma.message.create({
        data: {
          matchId: match.id,
          senderId: targetUserId,
          text: randomWelcome,
        }
      });

      return { match: true, matchId: match.id, matchedUser };
    }
  }

  return { match: false };
}

// Получить список мэтчей
export async function getMatches() {
  await ensureCurrentUser();
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userId: CURRENT_USER_ID },
        { matchedUserId: CURRENT_USER_ID }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const results = [];
  for (const match of matches) {
    const partnerId = match.userId === CURRENT_USER_ID ? match.matchedUserId : match.userId;
    const partner = await prisma.user.findUnique({
      where: { id: partnerId }
    });

    if (partner) {
      // Последнее сообщение
      const lastMessage = await prisma.message.findFirst({
        where: { matchId: match.id },
        orderBy: { createdAt: 'desc' }
      });

      results.push({
        id: match.id,
        partner,
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        } : null
      });
    }
  }
  return results;
}

// Получить сообщения
export async function getMessages(matchId: string) {
  return await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: 'asc' }
  });
}

// Отправить сообщение в чате
export async function sendMessage(matchId: string, text: string) {
  await ensureCurrentUser();

  // Сохраняем сообщение текущего пользователя
  const userMessage = await prisma.message.create({
    data: {
      matchId,
      senderId: CURRENT_USER_ID,
      text,
    }
  });

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (match) {
    const partnerId = match.userId === CURRENT_USER_ID ? match.matchedUserId : match.userId;
    
    // Создаем автоматический ответ от партнера через 1 секунду
    const replies = [
      `Звучит здорово! Расскажи об этом подробнее.`,
      `Ого, это интересно! 😄`,
      `Супер! А я сегодня весь день занята делами, но рада твоему сообщению.`,
      `Ха-ха, забавно! Расскажешь еще что-нибудь о себе?`,
      `Интересно. Кстати, чем любишь заниматься по выходным? 🚀`,
      `Круто! Рада, что наши вкусы совпадают.`,
      `Ой, здорово! А давай как-нибудь встретимся на кофе? ☕`
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    await prisma.message.create({
      data: {
        matchId,
        senderId: partnerId,
        text: randomReply,
      }
    });
  }

  return userMessage;
}
