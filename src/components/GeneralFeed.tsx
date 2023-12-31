import { INFINIT_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from './PostFeed'

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINIT_SCROLLING_PAGINATION_RESULTS,
  })
  const totalPosts = await db.post.count()
  //@ts-ignore
  return <PostFeed initialPosts={posts} totalPosts={totalPosts} />
}

export default GeneralFeed
