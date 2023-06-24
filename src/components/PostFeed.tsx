'use client'
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useRef } from 'react'
import Post from './Post'
import FeedSkeleton from './FeedSkeleton'
interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
  totalPosts: number
}

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  subredditName,
  totalPosts,
}) => {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINIT_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')
      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  )
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts
  const canFetchNextPage = posts.length !== totalPosts && !isFetchingNextPage

  useEffect(() => {
    if (entry?.isIntersecting && canFetchNextPage) fetchNextPage()
  }, [entry, fetchNextPage, canFetchNextPage])

  return (
    <ul className="flex flex-col col-span-2 mt-5 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post?.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)
        const currentVote = post?.votes.find(
          (vote) => vote.userId === session?.user.id
        )
        if (index === posts.length - 1)
          return (
            <li key={post?.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
              />
            </li>
          )
        return (
          <li key={post.id}>
            <Post
              currentVote={currentVote}
              votesAmt={votesAmt}
              subredditName={post.subreddit.name}
              post={post}
              commentAmt={post.comments.length}
            />
          </li>
        )
      })}
      {isFetchingNextPage && <FeedSkeleton />}
      {posts.length === totalPosts && (
        <p className="text-sm text-center text-gray-500">No more posts</p>
      )}
    </ul>
  )
}

export default PostFeed
