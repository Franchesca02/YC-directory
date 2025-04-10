/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

export const experimental_ppr = true;
const md = markdownit();

// Define the type for the playlist data
interface PlaylistData {
  select?: StartupTypeCard[];
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, playlistData] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch<PlaylistData | null>(PLAYLIST_BY_SLUG_QUERY, {
      slug: "best-startups-of-the-year",
    }),
  ]);
  
  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || "");

  const editorPost = playlistData?.select || []; // Now properly typed

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section-container">
        <img
          src={post.image}
          alt="Thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">

<div className="flex-between gap-5">
  <Link
    href={`/user/${post.author?._id}`}
    className="flex gap-2 items-center mb-3"
  >
    {post?.author?.image ? (
      <Image
        src={post.author.image}
        alt="avatar"
        width={64}
        height={64}
        className="rounded-full drop-shadow-lg"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
        {/* Fallback avatar icon */}
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    )}

    <div>
      <p className="text-20-medium">{post?.author?.name}</p>
      <p className="text-16-medium !text-black-300">
        @{post.author?.username}
      </p>
    </div>
  </Link>
  <p className="category-tag">{post.category}</p>
</div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className="prose max-w-4xl font-work-sans break-all"
            ></article>
          ) : (
            <p className="no-result"> No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {editorPost.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Startups of the Year</p>

            <ul className="mt-7 card_grid-sm">
            {editorPost.map((post: StartupTypeCard, index: number) => 
            <StartupCard key={index} post={post} />
            )}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;