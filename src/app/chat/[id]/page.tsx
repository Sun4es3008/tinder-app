import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import ChatClient from './ChatClient';
import { getMessages } from '@/app/actions';

const CURRENT_USER_ID = 'currentUser';

export const revalidate = 0;

export default async function ChatPage({ params }: { params: { id: string } }) {
  const partnerId = params.id;

  const partner = await prisma.user.findUnique({
    where: { id: partnerId }
  });

  if (!partner) {
    notFound();
  }

  const match = await prisma.match.findFirst({
    where: {
      OR: [
        { userId: CURRENT_USER_ID, matchedUserId: partnerId },
        { userId: partnerId, matchedUserId: CURRENT_USER_ID }
      ]
    }
  });

  if (!match) {
    redirect('/');
  }

  const initialMessages = await getMessages(match.id);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950">
      <ChatClient 
        matchId={match.id} 
        partner={partner} 
        initialMessages={JSON.parse(JSON.stringify(initialMessages))} 
      />
    </div>
  );
}
