import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockUsers = [
  {
    name: 'Алина',
    age: 22,
    gender: 'female',
    bio: 'Люблю кофе, долгие прогулки в парке и инди-музыку. Ищу кого-то, с кем можно разделить вечер за чашкой чая. ☕✨',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Максим',
    age: 26,
    gender: 'male',
    bio: 'Разработчик, сноубордист, путешественник. Могу поддержать разговор о космосе, коде и лучшей пицце в городе. 🍕🏂',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'София',
    age: 24,
    gender: 'female',
    bio: 'Фотограф и мечтательница. Люблю пленочную эстетику, путешествия автостопом и виниловые пластинки. Давай сделаем красивый кадр? 📸🎶',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Артем',
    age: 28,
    gender: 'male',
    bio: 'Шеф-повар. Покоряю сердца через желудок. Люблю спорт, активный отдых и хорошее вино. Обещаю кормить вкусно. 🍳🍷',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Дарья',
    age: 23,
    gender: 'female',
    bio: 'Художница. Пишу картины, вдохновляюсь архитектурой города и старыми французскими фильмами. Давай сходим на выставку? 🎨🍿',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Илья',
    age: 25,
    gender: 'male',
    bio: 'Музыкант. Играю на гитаре, пишу песни и обожаю ночные поездки на машине. Ищу свою музу для джема. 🎸🌃',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Екатерина',
    age: 21,
    gender: 'female',
    bio: 'Студентка-архитектор. Влюблена в геометрию, книги по философии и утренний бег. Ищу интересного собеседника. 📚🏃‍♀️',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Даниил',
    age: 27,
    gender: 'male',
    bio: 'Предприниматель и фанат кроссфита. Люблю ставить цели и достигать их. Ищу ту, которая разделит мою страсть к жизни. 💪🚀',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Мария',
    age: 25,
    gender: 'female',
    bio: 'Дизайнер интерьеров. Обожаю минимализм, комнатные растения и теплые уютные свитера. Давай создадим наш уют? 🌿🛋️',
    photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Кирилл',
    age: 24,
    gender: 'male',
    bio: 'Любитель скейтбординга и уличной моды. Снимаю видео, хожу на концерты и всегда за любой движ. 🛹🔥',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Анна',
    age: 26,
    gender: 'female',
    bio: 'Писательница и путешественница. Объехала 20 стран, пишу роман и верю в настоящую любовь. Расскажи мне свою историю. 🗺️✍️',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Александр',
    age: 29,
    gender: 'male',
    bio: 'Инженер и любитель походов. Выходные провожу в горах с палаткой. Ищу компаньона для покорения новых вершин. 🏔️🏕️',
    photoUrl: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Елизавета',
    age: 23,
    gender: 'female',
    bio: 'Танцовщица. Жизнь — это движение. Люблю латте на овсяном, закаты у реки и искренний смех. 💃🌅',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Роман',
    age: 25,
    gender: 'male',
    bio: 'Финансовый аналитик. Днем дружу с цифрами, вечером — с боксерской грушей. Внимательный, надежный, ценю юмор. 📊🥊',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Виктория',
    age: 22,
    gender: 'female',
    bio: 'Люблю печь капкейки, играть на укулеле и гладить котиков. Мой мир полон пастельных тонов. 🧁🐱🌺',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop',
  }
];

async function main() {
  console.log('Clearing database...');
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding mock users...');
  for (const user of mockUsers) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
