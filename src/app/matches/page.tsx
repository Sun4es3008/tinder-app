import { getMatches } from '../actions';
import MatchesClient from './MatchesClient';

export const revalidate = 0;

export default async function MatchesPage() {
  const rawMatches = await getMatches();
  // Сериализуем объекты Date в строки для передачи в клиентский компонент
  const initialMatches = JSON.parse(JSON.stringify(rawMatches));

  return (
    <div className="w-full h-full flex flex-col">
      <MatchesClient initialMatches={initialMatches} />
    </div>
  );
}
