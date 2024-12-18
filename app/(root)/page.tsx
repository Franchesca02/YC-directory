/* eslint-disable react/jsx-key */
import StartupCard from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";


export default async function Home({searchParams}: {searchParams: Promise<{query?: string}>
}) 
{

  const query = (await searchParams).query

  const posts = [{
    _createdAt: new Date(),
    views: '55',
    author: {_id: 1, name: 'Ify Enyinnaya'},
    _id: 1,
    description: 'This is the description',
    image: 'https://images.unsplash.com/photo-1593377201811-4516986cbe41?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Robots',
    title: 'We robots',
  }]

  return (
    <>
    <section className="pink_container">
    <h1 className="heading">Pitch Your Startup, <br />Connect with Entreprenuers</h1>
    <p className="sub-heading !max-w-3xl">
    Submit ideas, Vote on Pitches and Get Noticed in Virtual Competition
    </p>

    <SearchForm query={query} />
    </section>

    <section className="section-container">
<p className="text-30-semibold">
  {query ? `Search results for "${query}"` : 'All Startups'}
</p>

<ul className="mt-7 card_grid">
{posts?.length > 0 ? (
  posts.map((post: StartupCardType, index: number) => (
    <StartupCard key={post?._id} post={post}/>
  ))
) : (
  <p className="no-results">No Startup found</p>
)
}
</ul>
    
    </section>
    </>
  );
}
