import { auth } from '@/auth';
import { StartupCardSkeleton } from '@/components/StartupCard';
import UserStartups from '@/components/UserStartups';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  // Provide default values for potentially null fields
  const userImage = user.image || '/default-avatar.png';
  const userName = user.name || 'Anonymous';
  const username = user?.username || 'user';
  const bio = user?.bio || 'No bio available';

  return (
    <>
      <section className='profile_container'>
        <div className='profile_card'>
          <div className='profile_title'>
            <h3 className='text-24-black uppercase text-center line-clamp-1'>
              {userName}
            </h3>
          </div>
          <Image
            src={userImage}
            alt={`Profile picture of ${userName}`}
            width={220}
            height={220}
            className='profile_image'
            priority
          />
          <p className='text-30-extrabold text-center mt-7'>@{username}</p>
          <p className='text-14-normal mt-1 text-center'>{bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  )
}

export default page;