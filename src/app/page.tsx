import { getProfiles } from './actions';
import ExploreClient from './ExploreClient';

export const revalidate = 0;

export default async function ExplorePage() {
  const initialProfiles = await getProfiles();

  return (
    <div className="w-full h-full flex flex-col">
      <ExploreClient initialProfiles={initialProfiles} />
    </div>
  );
}
