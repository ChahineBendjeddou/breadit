import EditorOutput from '@/components/EditorOutput'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface pageProps {
  params: {
    postId: string
  }
}
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
const page = async ({ params: { postId } }: pageProps) => {
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost
  console.log({ cachedPost })
  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }
  if (!post && !cachedPost) return notFound()
  return (
    <div>
      <div className="flex flex-col items-center justify-between h-full sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-ignore */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>
        <div className="flex-1 w-full p-4 bg-white rounded-sm sm:w-0">
          <p className="mt-1 text-xs text-gray-500 truncate max-h-40">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />
        </div>
      </div>
    </div>
  )
}
function PostVoteShell() {
  return (
    <div className="flex flex-row w-20 pr-6 sm:flex-col">
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className="w-5 h-5 text-zinc-700" />
      </div>
      <div className="py-3 text-sm font-medium text-center sm:py-0 text-zinc-900">
        <Loader2 className="w-3 h-3 m-auto animate-spin" />
      </div>
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className="w-5 h-5 text-zinc-700" />
      </div>
    </div>
  )
}
export default page
