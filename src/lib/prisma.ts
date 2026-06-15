// Мок-версия Prisma для работы на Netlify (Serverless) без внешней базы данных PostgreSQL.
// Данные будут храниться в оперативной памяти Serverless-функции. 
// Для прототипа и демонстрации дизайна этого более чем достаточно!

const globalForPrisma = globalThis as unknown as { mockDb: any };

if (!globalForPrisma.mockDb) {
  globalForPrisma.mockDb = {
    users: [
      { id: 'cmqfafarp0000i2ijmhg3znu9', name: 'Анна', age: 23, gender: 'female', bio: 'Люблю кофе и долгие прогулки.', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop' },
      { id: 'cmqfafars0001i2ij5v1lciqw', name: 'Мария', age: 26, gender: 'female', bio: 'Дизайнер, обожаю искусство и путешествия.', photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' },
      { id: 'cmqfafarv0002i2ij9tk8ihjn', name: 'Александра', age: 24, gender: 'female', bio: 'Ищу кого-то для совместных тренировок.', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop' },
      { id: 'usr_4', name: 'Елена', age: 22, gender: 'female', bio: 'Студентка, люблю кино и музыку.', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
      { id: 'usr_5', name: 'Дарья', age: 25, gender: 'female', bio: 'Спорт, горы и сноуборд 🏂', photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop' },
      { id: 'usr_6', name: 'Виктория', age: 27, gender: 'female', bio: 'Фотограф. Ищу вдохновение.', photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop' }
    ],
    matches: [],
    messages: []
  };
}

const db = globalForPrisma.mockDb;

export const prisma = {
  user: {
    async findUnique({ where }: any) {
      return db.users.find((u: any) => u.id === where.id) || null;
    },
    async create({ data }: any) {
      const newUser = { ...data, createdAt: new Date(), updatedAt: new Date() };
      db.users.push(newUser);
      return newUser;
    },
    async findMany({ where }: any) {
      if (where?.id?.notIn) {
        return db.users.filter((u: any) => !where.id.notIn.includes(u.id));
      }
      return db.users;
    }
  },
  match: {
    async findMany({ where, orderBy }: any) {
      let result = [...db.matches];
      if (where?.OR) {
        result = result.filter((m: any) => 
          where.OR.some((cond: any) => 
            (cond.userId && m.userId === cond.userId) || 
            (cond.matchedUserId && m.matchedUserId === cond.matchedUserId)
          )
        );
      }
      if (orderBy?.createdAt === 'desc') {
        result.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      return result;
    },
    async findFirst({ where, orderBy }: any) {
      const res = await this.findMany({ where, orderBy });
      return res[0] || null;
    },
    async create({ data }: any) {
      const newMatch = { ...data, id: 'match-' + Date.now(), createdAt: new Date() };
      db.matches.push(newMatch);
      return newMatch;
    }
  },
  message: {
    async findMany({ where, orderBy }: any) {
      let result = [...db.messages];
      if (where?.matchId) {
        result = result.filter((m: any) => m.matchId === where.matchId);
      }
      if (orderBy?.createdAt === 'desc') {
        result.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        result.sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
      }
      return result;
    },
    async findFirst({ where, orderBy }: any) {
      const res = await this.findMany({ where, orderBy });
      return res[0] || null;
    },
    async create({ data }: any) {
      const newMsg = { ...data, id: 'msg-' + Date.now(), createdAt: new Date() };
      db.messages.push(newMsg);
      return newMsg;
    }
  }
} as any;
