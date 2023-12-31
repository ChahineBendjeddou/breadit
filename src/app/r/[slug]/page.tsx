import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        take: INFINIT_SCROLLING_PAGINATION_RESULTS,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!subreddit) return notFound()
  const totalPosts = await db.post.count({
    where: { subredditId: subreddit.id },
  })
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed
        /* @ts-ignore */
        initialPosts={subreddit.posts}
        subredditName={subreddit.name}
        totalPosts={totalPosts}
      />
    </>
  )
}

export default page
